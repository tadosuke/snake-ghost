import { Point } from '../types/types';

export class Food {
  private position: Point;

  constructor(x: number, y: number) {
    this.position = { x, y };
  }

  getPosition(): Point {
    return this.position;
  }

  setPosition(x: number, y: number): void {
    this.position = { x, y };
  }

  generateRandomPosition(gameWidth: number, gameHeight: number): void {
    const x = Math.floor(Math.random() * gameWidth);
    const y = Math.floor(Math.random() * gameHeight);
    this.setPosition(x, y);
  }
}
