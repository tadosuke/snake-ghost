import { type Point } from '../types/types';

const INITIAL_BODY_LENGTH = 3;

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
    return INITIAL_BODY_LENGTH;
  }

  getDirection(): string {
    return this.direction;
  }
}
