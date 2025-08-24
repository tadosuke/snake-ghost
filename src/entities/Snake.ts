import { type Point } from '../types/types';

export class Snake {
  private body: Point[];
  private direction: string;

  constructor(startX: number, startY: number) {
    this.body = this.createInitialBody(startX, startY);
    this.direction = 'right';
  }

  private createInitialBody(startX: number, startY: number): Point[] {
    return [
      { x: startX, y: startY }, // Head
      { x: startX - 1, y: startY }, // Body segment behind head
      { x: startX - 2, y: startY }, // Tail segment
    ];
  }

  getHead(): Point {
    return this.body[0];
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
