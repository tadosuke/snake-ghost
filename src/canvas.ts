import type { Point } from './types.ts';

export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private readonly width: number;
  private readonly height: number;

  constructor(canvasId: string, width = 400, height = 300) {
    const canvasElement = document.getElementById(
      canvasId
    ) as HTMLCanvasElement;
    if (!canvasElement) {
      throw new Error(`Canvas element with id '${canvasId}' not found`);
    }

    this.canvas = canvasElement;
    this.width = width;
    this.height = height;

    this.canvas.width = width;
    this.canvas.height = height;

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D rendering context');
    }

    this.context = context;
    this.setupCanvas();
  }

  private setupCanvas(): void {
    this.context.imageSmoothingEnabled = false;
    this.canvas.style.imageRendering = 'pixelated';
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  clear(): void {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  isPointInBounds(point: Point): boolean {
    return (
      point.x >= 0 &&
      point.x < this.width &&
      point.y >= 0 &&
      point.y < this.height
    );
  }

  screenToCanvas(screenX: number, screenY: number): Point {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.width / rect.width;
    const scaleY = this.height / rect.height;

    return {
      x: (screenX - rect.left) * scaleX,
      y: (screenY - rect.top) * scaleY,
    };
  }
}
