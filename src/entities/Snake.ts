import { Point } from '../types/types';

export class Snake {
  private head: Point;

  constructor(startX: number, startY: number) {
    this.head = { x: startX, y: startY };
  }

  getHead(): Point {
    return this.head;
  }
}