import { Redis } from "@upstash/redis";
import type { PlantStatus, PublicPlant, VisitorPlant, VisitorStroke } from "./garden";

// Where visitors' plants live: Upstash Redis, connected through the Vercel
// Marketplace (it sets KV_REST_API_URL and KV_REST_API_TOKEN, or the
// UPSTASH_REDIS_REST_* pair). On the dev server without those, plants are kept
// in memory so the garden can be tried locally; they vanish on restart.
//
// Keys:
//   garden:plant:<id>   the plant (JSON)
//   garden:pending      ids waiting for review, oldest first
//   garden:approved     ids in the garden, in planting order
//   garden:rate:<ip>    plants from one address in the current hour

const configured = Boolean(
  (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
);
const dev = process.env.NODE_ENV === "development";

export const storeAvailable = configured || dev;

const redis = configured ? Redis.fromEnv() : null;

type Memory = {
  plants: Map<string, VisitorPlant>;
  pending: string[];
  approved: string[];
  rate: Map<string, { count: number; until: number }>;
};
// On globalThis so every API route on the dev server shares one copy.
const memory: Memory = ((globalThis as { __garden?: Memory }).__garden ??= {
  plants: new Map(),
  pending: [],
  approved: [],
  rate: new Map(),
});

const plantKey = (id: string) => `garden:plant:${id}`;
const PER_HOUR = 5;

/** Counts a submission from this address; true once it's over the hourly limit. */
export async function overRateLimit(ip: string, perHour = PER_HOUR) {
  if (redis) {
    const key = `garden:rate:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, 3600);
    return count > perHour;
  }
  const now = Date.now();
  const entry = memory.rate.get(ip);
  const next = entry && entry.until > now ? { ...entry, count: entry.count + 1 } : { count: 1, until: now + 3_600_000 };
  memory.rate.set(ip, next);
  return next.count > perHour;
}

export async function addPlant(input: { name: string; note: string; strokes: VisitorStroke[] }) {
  const plant: VisitorPlant = {
    id: crypto.randomUUID().replace(/-/g, "").slice(0, 12),
    ...input,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  if (redis) {
    await redis.set(plantKey(plant.id), plant);
    await redis.rpush("garden:pending", plant.id);
  } else {
    memory.plants.set(plant.id, plant);
    memory.pending.push(plant.id);
  }
  return plant;
}

async function getPlants(ids: string[]): Promise<VisitorPlant[]> {
  if (ids.length === 0) return [];
  if (redis) {
    const plants = await redis.mget<(VisitorPlant | null)[]>(...ids.map(plantKey));
    return plants.filter((p): p is VisitorPlant => Boolean(p));
  }
  return ids.map((id) => memory.plants.get(id)).filter((p): p is VisitorPlant => Boolean(p));
}

const list = async (key: "garden:pending" | "garden:approved") =>
  redis ? await redis.lrange<string>(key, 0, -1) : [...memory[key === "garden:pending" ? "pending" : "approved"]];

export async function approvedPlants(): Promise<PublicPlant[]> {
  const plants = await getPlants(await list("garden:approved"));
  return plants.map((p) => ({ id: p.id, name: p.name, note: p.note, strokes: p.strokes, createdAt: p.createdAt }));
}

export async function pendingPlants() {
  return getPlants(await list("garden:pending"));
}

export async function getPlant(id: string) {
  const [plant] = await getPlants([id]);
  return plant ?? null;
}

/** Statuses for a visitor's own plants, so their seed knows whether it sprouted. */
export async function statuses(ids: string[]): Promise<Record<string, PlantStatus>> {
  const plants = await getPlants(ids);
  return Object.fromEntries(plants.map((p) => [p.id, p.status]));
}

export async function review(id: string, decision: "approve" | "reject") {
  const plant = await getPlant(id);
  if (!plant || plant.status !== "pending") return false;
  const updated: VisitorPlant = { ...plant, status: decision === "approve" ? "approved" : "rejected" };
  if (redis) {
    await redis.set(plantKey(id), updated);
    await redis.lrem("garden:pending", 0, id);
    if (decision === "approve") await redis.rpush("garden:approved", id);
  } else {
    memory.plants.set(id, updated);
    memory.pending = memory.pending.filter((p) => p !== id);
    if (decision === "approve") memory.approved.push(id);
  }
  return true;
}

/** Takes an approved plant out of the garden again. */
export async function remove(id: string) {
  const plant = await getPlant(id);
  if (!plant) return false;
  const updated: VisitorPlant = { ...plant, status: "rejected" };
  if (redis) {
    await redis.set(plantKey(id), updated);
    await redis.lrem("garden:approved", 0, id);
    await redis.lrem("garden:pending", 0, id);
  } else {
    memory.plants.set(id, updated);
    memory.approved = memory.approved.filter((p) => p !== id);
    memory.pending = memory.pending.filter((p) => p !== id);
  }
  return true;
}

/* ---------------------------------------------------------------- watering */

// When each plant was last watered (ms since epoch), in one Redis hash:
//   garden:water   { <plant id>: <timestamp> }
const memoryWater: Map<string, number> = ((globalThis as { __gardenWater?: Map<string, number> }).__gardenWater ??=
  new Map());

export async function wateredTimes(): Promise<Record<string, number>> {
  if (redis) {
    const all = await redis.hgetall<Record<string, number>>("garden:water");
    return all ?? {};
  }
  return Object.fromEntries(memoryWater);
}

export async function water(id: string) {
  const now = Date.now();
  if (redis) await redis.hset("garden:water", { [id]: now });
  else memoryWater.set(id, now);
  return now;
}

/** Counts a watering from this address; true once it's over the hourly limit. */
export async function overWaterLimit(ip: string) {
  return overRateLimit(`water:${ip}`, 60);
}
