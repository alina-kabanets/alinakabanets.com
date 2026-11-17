"use client";

import { useCallback, useState } from "react";
import type { PublicPlant, VisitorPlant } from "@/lib/garden";
import { PlantPreview } from "./plant-preview";

// Alina's review queue: approve or reject new plants, or take one out of the
// garden again. The password is only kept while the page is open.

type Queue = { pending: VisitorPlant[]; approved: PublicPlant[] };

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export function GardenReview() {
  const [password, setPassword] = useState("");
  const [queue, setQueue] = useState<Queue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async (pw: string) => {
    setError(null);
    const res = await fetch("/api/garden/review", { headers: { Authorization: `Bearer ${pw}` } });
    if (res.status === 401) {
      setQueue(null);
      setError("Wrong password.");
      return;
    }
    if (!res.ok) {
      setError("The garden’s database isn’t connected.");
      return;
    }
    setQueue(await res.json());
  }, []);

  const act = async (id: string, action: "approve" | "reject" | "remove") => {
    setBusy(id);
    const res = await fetch("/api/garden/review", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${password}` },
      body: JSON.stringify({ id, action }),
    });
    setBusy(null);
    if (!res.ok) setError("That didn’t work. Try again.");
    await load(password);
  };

  if (!queue) {
    return (
      <form
        className="mt-10 flex max-w-sm flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void load(password);
        }}
      >
        <label className="flex flex-col gap-1 text-sm text-muted">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-b border-line bg-transparent py-1 text-base text-ink outline-none focus:border-ink"
            autoComplete="current-password"
            autoFocus
          />
        </label>
        <button type="submit" className="self-start rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper">
          Open the queue
        </button>
        {error && <p className="text-sm text-muted">{error}</p>}
      </form>
    );
  }

  return (
    <div className="mt-10">
      {error && <p className="mb-6 text-sm text-muted">{error}</p>}

      <h2 className="text-sm text-muted">Waiting · {queue.pending.length}</h2>
      {queue.pending.length === 0 ? (
        <p className="mt-4 text-base">Nothing to review. 🌱</p>
      ) : (
        <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {queue.pending.map((plant) => (
            <li key={plant.id} className="rounded-xl border border-line p-4">
              <PlantPreview strokes={plant.strokes} className="h-56 w-full" />
              <p className="mt-3 text-base font-medium">{plant.name}</p>
              <p className="text-sm text-muted">
                {[plant.note, when(plant.createdAt)].filter(Boolean).join(" · ")}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => act(plant.id, "approve")}
                  disabled={busy === plant.id}
                  className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper disabled:opacity-40"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => act(plant.id, "reject")}
                  disabled={busy === plant.id}
                  className="rounded-full px-4 py-2 text-sm font-medium hover:bg-tint disabled:opacity-40"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-16 text-sm text-muted">In the garden · {queue.approved.length}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {queue.approved.map((plant) => (
          <li key={plant.id} className="rounded-xl border border-line p-3">
            <PlantPreview strokes={plant.strokes} className="h-28 w-full" />
            <a href={`/garden/p/${plant.id}`} className="mt-2 block truncate text-sm hover:underline">
              {plant.name}
            </a>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Take ${plant.name}’s plant out of the garden?`)) void act(plant.id, "remove");
              }}
              disabled={busy === plant.id}
              className="mt-1 text-xs text-muted underline underline-offset-2 disabled:opacity-40"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
