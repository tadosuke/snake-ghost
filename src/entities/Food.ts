import { Point } from '../types/types';

export class Food {
  private position: Point;

  constructor(x: number, y: number) {
    this.position = { x, y };
  }

  getPosition(): Point {
    return this.position;
  }
}
