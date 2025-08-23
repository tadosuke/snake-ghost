import type { Point, RenderState } from './types.ts';
import { CanvasManager } from './canvas.ts';

export class Renderer {
  private canvasManager: CanvasManager;
  private context: CanvasRenderingContext2D;
  private renderState: RenderState;

  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
    this.context = canvasManager.getContext();
    this.renderState = {
      fillColor: '#ffffff',
      strokeColor: '#000000',
      lineWidth: 1,
    };
    this.applyRenderState();
  }

  private applyRenderState(): void {
    this.context.fillStyle = this.renderState.fillColor;
    this.context.strokeStyle = this.renderState.strokeColor;
    this.context.lineWidth = this.renderState.lineWidth;
  }

  setFillColor(color: string): void {
    this.renderState.fillColor = color;
    this.context.fillStyle = color;
  }

  setStrokeColor(color: string): void {
    this.renderState.strokeColor = color;
    this.context.strokeStyle = color;
  }

  setLineWidth(width: number): void {
    this.renderState.lineWidth = width;
    this.context.lineWidth = width;
  }

  clear(color?: string): void {
    if (color) {
      this.setFillColor(color);
      this.fillRect(
        0,
        0,
        this.canvasManager.getWidth(),
        this.canvasManager.getHeight()
      );
    } else {
      this.canvasManager.clear();
    }
  }

  fillRect(x: number, y: number, width: number, height: number): void {
    this.context.fillRect(x, y, width, height);
  }

  strokeRect(x: number, y: number, width: number, height: number): void {
    this.context.strokeRect(x, y, width, height);
  }

  fillCircle(x: number, y: number, radius: number): void {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fill();
  }

  strokeCircle(x: number, y: number, radius: number): void {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.stroke();
  }

  drawLine(from: Point, to: Point): void {
    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.stroke();
  }

  drawText(text: string, x: number, y: number, font?: string): void {
    if (font) {
      this.context.font = font;
    }
    this.context.fillText(text, x, y);
  }

  save(): void {
    this.context.save();
  }

  restore(): void {
    this.context.restore();
  }

  getRenderState(): RenderState {
    return { ...this.renderState };
  }
}
