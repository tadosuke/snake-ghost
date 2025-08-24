export interface Point {
  x: number;
  y: number;
}

export interface Vector2D extends Point {
  x: number;
  y: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface RenderState {
  fillColor: string;
  strokeColor: string;
  lineWidth: number;
}

export interface GameLoopState {
  isRunning: boolean;
  isPaused: boolean;
  lastFrameTime: number;
  deltaTime: number;
}