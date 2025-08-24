import { type Point } from '../types/types';

export class Snake {
  private head: Point;
  private direction: string;

  constructor(startX: number, startY: number) {
    this.head = { x: startX, y: startY };
    this.direction = 'right';
  }

  getHead(): Point {
    return this.head;
  }

  getBodyLength(): number {
    return 3;
  }

  getDirection(): string {
    return this.direction;
  }
}
