import type { GameLoopState } from './types.ts';
import { Renderer } from './renderer.ts';

export class GameLoop {
  private state: GameLoopState;
  private renderer: Renderer;
  private animationFrameId: number | null = null;
  private updateCallback?: (deltaTime: number) => void;
  private renderCallback?: (renderer: Renderer) => void;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.state = {
      isRunning: false,
      isPaused: false,
      lastFrameTime: 0,
      deltaTime: 0,
    };
  }

  setUpdateCallback(callback: (deltaTime: number) => void): void {
    this.updateCallback = callback;
  }

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

  private loop = (): void => {
    if (!this.state.isRunning) {
      return;
    }

    const currentTime = performance.now();
    this.state.deltaTime = Math.min(
      (currentTime - this.state.lastFrameTime) / 1000,
      0.1
    );
    this.state.lastFrameTime = currentTime;

    if (!this.state.isPaused) {
      if (this.updateCallback) {
        this.updateCallback(this.state.deltaTime);
      }

      if (this.renderCallback) {
        this.renderCallback(this.renderer);
      }
    }

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
