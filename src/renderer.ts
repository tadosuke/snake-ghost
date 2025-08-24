// Import type definitions and canvas management
import type { Point, RenderState } from './types.ts';
import { CanvasManager } from './canvas.ts';

/**
 * Renderer class that provides high-level drawing operations for the game
 * Wraps the canvas 2D context with convenient methods and state management
 */
export class Renderer {
  // Canvas management instance
  private canvasManager: CanvasManager;
  
  // Raw 2D rendering context from the canvas
  private context: CanvasRenderingContext2D;
  
  // Current rendering state (colors, line width, etc.)
  private renderState: RenderState;

  /**
   * Initialize the renderer with a canvas manager
   * Sets up default rendering state and applies it to the context
   * @param canvasManager The canvas manager instance to render to
   */
  constructor(canvasManager: CanvasManager) {
    this.canvasManager = canvasManager;
    this.context = canvasManager.getContext();
    
    // Initialize with default rendering settings
    this.renderState = {
      fillColor: '#ffffff',    // White fill by default
      strokeColor: '#000000',  // Black stroke by default
      lineWidth: 1,           // 1px line width by default
    };
    
    // Apply the initial state to the canvas context
    this.applyRenderState();
  }

  /**
   * Apply the current render state to the canvas context
   * Synchronizes internal state with the actual canvas rendering context
   */
  private applyRenderState(): void {
    this.context.fillStyle = this.renderState.fillColor;
    this.context.strokeStyle = this.renderState.strokeColor;
    this.context.lineWidth = this.renderState.lineWidth;
  }

  /**
   * Set the fill color for subsequent draw operations
   * @param color CSS color string (hex, rgb, rgba, or named color)
   */
  setFillColor(color: string): void {
    this.renderState.fillColor = color;
    this.context.fillStyle = color;
  }

  /**
   * Set the stroke color for subsequent draw operations
   * @param color CSS color string (hex, rgb, rgba, or named color)
   */
  setStrokeColor(color: string): void {
    this.renderState.strokeColor = color;
    this.context.strokeStyle = color;
  }

  /**
   * Set the line width for subsequent stroke operations
   * @param width Line width in pixels
   */
  setLineWidth(width: number): void {
    this.renderState.lineWidth = width;
    this.context.lineWidth = width;
  }

  /**
   * Clear the canvas, optionally with a background color
   * @param color Optional background color to fill with after clearing
   */
  clear(color?: string): void {
    if (color) {
      // Clear with a specific background color by filling the entire canvas
      this.setFillColor(color);
      this.fillRect(
        0,
        0,
        this.canvasManager.getWidth(),
        this.canvasManager.getHeight()
      );
    } else {
      // Clear to transparent using the canvas manager's clear method
      this.canvasManager.clear();
    }
  }

  /**
   * Draw a filled rectangle
   * @param x Left edge x coordinate
   * @param y Top edge y coordinate  
   * @param width Rectangle width
   * @param height Rectangle height
   */
  fillRect(x: number, y: number, width: number, height: number): void {
    this.context.fillRect(x, y, width, height);
  }

  /**
   * Draw a stroked rectangle outline
   * @param x Left edge x coordinate
   * @param y Top edge y coordinate
   * @param width Rectangle width
   * @param height Rectangle height
   */
  strokeRect(x: number, y: number, width: number, height: number): void {
    this.context.strokeRect(x, y, width, height);
  }

  /**
   * Draw a filled circle
   * @param x Center x coordinate
   * @param y Center y coordinate
   * @param radius Circle radius in pixels
   */
  fillCircle(x: number, y: number, radius: number): void {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fill();
  }

  /**
   * Draw a stroked circle outline
   * @param x Center x coordinate
   * @param y Center y coordinate
   * @param radius Circle radius in pixels
   */
  strokeCircle(x: number, y: number, radius: number): void {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.stroke();
  }

  /**
   * Draw a line between two points
   * @param from Starting point coordinates
   * @param to Ending point coordinates
   */
  drawLine(from: Point, to: Point): void {
    this.context.beginPath();
    this.context.moveTo(from.x, from.y);
    this.context.lineTo(to.x, to.y);
    this.context.stroke();
  }

  /**
   * Draw text at the specified position
   * @param text The text string to draw
   * @param x Left edge x coordinate for the text
   * @param y Baseline y coordinate for the text
   * @param font Optional font specification (e.g., "16px Arial")
   */
  drawText(text: string, x: number, y: number, font?: string): void {
    if (font) {
      this.context.font = font;
    }
    this.context.fillText(text, x, y);
  }

  /**
   * Save the current canvas state (transformations, styles, etc.)
   * Can be restored later with restore()
   */
  save(): void {
    this.context.save();
  }

  /**
   * Restore the most recently saved canvas state
   * Used with save() to temporarily change rendering settings
   */
  restore(): void {
    this.context.restore();
  }

  /**
   * Get a copy of the current rendering state
   * @returns A copy of the current render state object
   */
  getRenderState(): RenderState {
    return { ...this.renderState };
  }
}
