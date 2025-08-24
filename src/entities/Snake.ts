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

  getDirectionVector(): Point {
    switch (this.direction) {
      case 'right':
        return { x: 1, y: 0 };
      case 'left':
        return { x: -1, y: 0 };
      case 'up':
        return { x: 0, y: -1 };
      case 'down':
        return { x: 0, y: 1 };
      default:
        return { x: 1, y: 0 }; // Default to right
    }
  }

  private isOppositeDirection(currentDir: string, newDir: string): boolean {
    return (
      (currentDir === 'right' && newDir === 'left') ||
      (currentDir === 'left' && newDir === 'right') ||
      (currentDir === 'up' && newDir === 'down') ||
      (currentDir === 'down' && newDir === 'up')
    );
  }

  setDirection(newDirection: string): void {
    // Prevent immediate direction reversal
    if (this.isOppositeDirection(this.direction, newDirection)) {
      return; // Ignore invalid direction change
    }

    this.direction = newDirection;
  }

  containsPosition(x: number, y: number): boolean {
    return this.body.some((segment) => segment.x === x && segment.y === y);
  }

  move(): void {
    const head = this.getHead();
    let newHead: Point;

    // Calculate new head position based on direction
    switch (this.direction) {
      case 'right':
        newHead = { x: head.x + 1, y: head.y };
        break;
      case 'left':
        newHead = { x: head.x - 1, y: head.y };
        break;
      case 'up':
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case 'down':
        newHead = { x: head.x, y: head.y + 1 };
        break;
      default:
        newHead = { x: head.x + 1, y: head.y }; // Default to right
    }

    // Add new head to front
    this.body.unshift(newHead);

    // Remove tail to maintain length (body follows head)
    this.body.pop();
  }
}
