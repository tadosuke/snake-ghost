import { type Point } from '../types/types';

export class Snake {
  private body: Point[];
  private direction: string;
  private growthPending: number;

  constructor(startX: number, startY: number) {
    this.body = this.createInitialBody(startX, startY);
    this.direction = 'right';
    this.growthPending = 0;
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

  checkSelfCollision(): boolean {
    const head = this.getHead();
    const direction = this.getDirectionVector();

    // Calculate the next position the head would move to
    const nextHeadPosition = {
      x: head.x + direction.x,
      y: head.y + direction.y,
    };

    // Check if next head position collides with any body segment (excluding the head itself)
    return this.body
      .slice(1)
      .some(
        (segment) =>
          segment.x === nextHeadPosition.x && segment.y === nextHeadPosition.y
      );
  }

  checkBoundaryCollision(gameWidth: number, gameHeight: number): boolean {
    const head = this.getHead();
    const direction = this.getDirectionVector();

    // Calculate the next position the head would move to
    const nextHeadPosition = {
      x: head.x + direction.x,
      y: head.y + direction.y,
    };

    // Check if next position is outside game boundaries
    return (
      nextHeadPosition.x < 0 ||
      nextHeadPosition.x >= gameWidth ||
      nextHeadPosition.y < 0 ||
      nextHeadPosition.y >= gameHeight
    );
  }

  reset(startX: number, startY: number): void {
    // Reset body to initial state
    this.body = this.createInitialBody(startX, startY);

    // Reset direction to default
    this.direction = 'right';

    // Clear any pending growth
    this.growthPending = 0;
  }

  eat(): void {
    this.growthPending += 1;
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

    // Handle growth: if growth is pending, don't remove tail
    if (this.growthPending > 0) {
      this.growthPending -= 1;
    } else {
      // Remove tail to maintain length (body follows head)
      this.body.pop();
    }
  }
}
