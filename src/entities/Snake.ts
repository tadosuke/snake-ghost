import { type Point } from '../types/types';

const INITIAL_BODY_LENGTH = 3;

export class Snake {
  private head: Point;
  private body: Point[];
  private direction: string;

  constructor(startX: number, startY: number) {
    this.head = { x: startX, y: startY };
    this.body = [
      { x: startX, y: startY },     // Head
      { x: startX - 1, y: startY }, // Body segment behind head  
      { x: startX - 2, y: startY }  // Tail segment
    ];
    this.direction = 'right';
  }

  getHead(): Point {
    return this.head;
  }

  getBody(): Point[] {
    return this.body;
  }

  getBodyLength(): number {
    return this.body.length;
  }

  getDirection(): string {
    return this.direction;
  }
}
