// Import type definitions and renderer from appropriate directories
import type { GameLoopState } from '../types/types.ts';
import { Renderer } from '../rendering/renderer.ts';

/**
 * GameLoop class manages the main game loop with consistent frame timing
 * Handles update/render cycle, pause/resume functionality, and frame rate management
 */
export class GameLoop {
  private state: GameLoopState;
  private renderer: Renderer;
  private animationFrameId: number | null = null; // Tracks RAF ID for cleanup
  private updateCallback?: (deltaTime: number) => void; // Game logic update function
  private renderCallback?: (renderer: Renderer) => void; // Rendering function

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.state = {
      isRunning: false,
      isPaused: false,
      lastFrameTime: 0,
      deltaTime: 0,
    };
  }

  // Set the game logic update function
  setUpdateCallback(callback: (deltaTime: number) => void): void {
    this.updateCallback = callback;
  }

  // Set the rendering function
  setRenderCallback(callback: (renderer: Renderer) => void): void {
    this.renderCallback = callback;
  }

  start(): void {
    if (this.state.isRunning) {
      return;
    }

    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.lastFrameTime = performance.now();
    this.loop();
  }

  pause(): void {
    this.state.isPaused = true;
  }

  resume(): void {
    if (!this.state.isRunning) {
      return;
    }
    this.state.isPaused = false;
    this.state.lastFrameTime = performance.now();
  }

  stop(): void {
    this.state.isRunning = false;
    this.state.isPaused = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // Main game loop - runs every frame
  private loop = (): void => {
    if (!this.state.isRunning) {
      return;
    }

    const currentTime = performance.now();
    // Calculate delta time in seconds, capped at 100ms to prevent huge jumps
    this.state.deltaTime = Math.min(
      (currentTime - this.state.lastFrameTime) / 1000,
      0.1
    );
    this.state.lastFrameTime = currentTime;

    if (!this.state.isPaused) {
      // Update game logic
      if (this.updateCallback) {
        this.updateCallback(this.state.deltaTime);
      }

      // Render the frame
      if (this.renderCallback) {
        this.renderCallback(this.renderer);
      }
    }

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  getState(): GameLoopState {
    return { ...this.state };
  }

  isRunning(): boolean {
    return this.state.isRunning;
  }

  isPaused(): boolean {
    return this.state.isPaused;
  }
}