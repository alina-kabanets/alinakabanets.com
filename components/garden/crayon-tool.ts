import { StateNode, atom, createShapeId, type TLShapeId } from "tldraw";
import { CRAYON, type CrayonShape } from "./shapes";

// The crayon the visitor is holding. The tray in garden.tsx writes it,
// the tool reads it when a new stroke starts.
export const currentCrayon = atom("garden-crayon-colour", "#4f9a4a");
export const CRAYON_WIDTH = 6;

// Ignore pointer moves smaller than this (in screen pixels), so a slow hand
// doesn't produce hundreds of tiny segments.
const MIN_SCREEN_DISTANCE = 1.5;

class Idle extends StateNode {
  static override id = "idle";

  override onEnter() {
    this.editor.setCursor({ type: "cross", rotation: 0 });
  }

  override onPointerDown() {
    this.parent.transition("drawing");
  }
}

class Drawing extends StateNode {
  static override id = "drawing";
  private shapeId: TLShapeId | null = null;

  override onEnter() {
    const { x, y } = this.editor.inputs.getCurrentPagePoint();
    this.shapeId = createShapeId();
    // One undo step per stroke.
    this.editor.markHistoryStoppingPoint("crayon stroke");
    this.editor.createShape<CrayonShape>({
      id: this.shapeId,
      type: CRAYON,
      x,
      y,
      props: { color: currentCrayon.get(), width: CRAYON_WIDTH, points: [{ x: 0, y: 0 }] },
    });
  }

  override onPointerMove() {
    const shape = this.shapeId && this.editor.getShape<CrayonShape>(this.shapeId);
    if (!shape) return;
    const page = this.editor.inputs.getCurrentPagePoint();
    const point = { x: page.x - shape.x, y: page.y - shape.y };
    const last = shape.props.points[shape.props.points.length - 1];
    const minDistance = MIN_SCREEN_DISTANCE / this.editor.getZoomLevel();
    if (last && Math.hypot(point.x - last.x, point.y - last.y) < minDistance) return;
    this.editor.updateShape<CrayonShape>({
      id: shape.id,
      type: CRAYON,
      props: { points: [...shape.props.points, point] },
    });
  }

  override onPointerUp() {
    this.parent.transition("idle");
  }
  override onCancel() {
    this.parent.transition("idle");
  }
  override onComplete() {
    this.parent.transition("idle");
  }
  override onExit() {
    this.shapeId = null;
  }
}

export class CrayonTool extends StateNode {
  static override id = "crayon";
  static override initial = "idle";
  static override useCoalescedEvents = true;
  static override isLockable = false;
  static override children() {
    return [Idle, Drawing];
  }
}
