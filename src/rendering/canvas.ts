import type { Point } from '../types/types.ts';

/**
 * Manages HTML5 canvas operations for the Snake Ghost game.
 * Handles canvas initialization, rendering context, and coordinate transformations.
 */
export class CanvasManager {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private readonly width: number;
  private readonly height: number;

  /**
   * Creates a new canvas manager instance.
   * @param canvasId - The HTML element ID of the canvas
   * @param width - Canvas width in pixels (default: 400)
   * @param height - Canvas height in pixels (default: 300)
   */
  constructor(canvasId: string, width = 400, height = 300) {
    // Find the canvas element in the DOM
    const canvasElement = document.getElementById(
      canvasId
    ) as HTMLCanvasElement;
    if (!canvasElement) {
      throw new Error(`Canvas element with id '${canvasId}' not found`);
    }

    // Store canvas reference and dimensions
    this.canvas = canvasElement;
    this.width = width;
    this.height = height;

    // Set canvas dimensions (affects actual drawing area)
    this.canvas.width = width;
    this.canvas.height = height;

    // Get 2D rendering context for drawing operations
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D rendering context');
    }

    this.context = context;
    this.setupCanvas();
  }

  /**
   * Configures canvas for pixel-perfect rendering.
   * Disables smoothing to maintain crisp pixel art appearance.
   */
  private setupCanvas(): void {
    this.context.imageSmoothingEnabled = false;
    this.canvas.style.imageRendering = 'pixelated';
  }

  /**
   * Returns the HTMLCanvasElement for direct manipulation.
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Returns the 2D rendering context for drawing operations.
   */
  getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  /**
   * Returns the canvas width in pixels.
   */
  getWidth(): number {
    return this.width;
  }

  /**
   * Returns the canvas height in pixels.
   */
  getHeight(): number {
    return this.height;
  }

  /**
   * Clears the entire canvas by removing all drawn content.
   */
  clear(): void {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Checks if a point is within the canvas boundaries.
   * @param point - The point to check
   * @returns true if the point is within canvas bounds
   */
  isPointInBounds(point: Point): boolean {
    return (
      point.x >= 0 &&
      point.x < this.width &&
      point.y >= 0 &&
      point.y < this.height
    );
  }

  /**
   * Converts screen coordinates to canvas coordinates.
   * Accounts for canvas scaling and positioning in the viewport.
   * @param screenX - X coordinate relative to the viewport
   * @param screenY - Y coordinate relative to the viewport
   * @returns Canvas coordinates as a Point
   */
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