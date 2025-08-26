import { Point } from '../types/types';
import { Snake } from './Snake';

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

  isValidPosition(snakeBody: Point[]): boolean {
    const currentPosition = this.getPosition();
    return !snakeBody.some(
      (segment) =>
        segment.x === currentPosition.x && segment.y === currentPosition.y
    );
  }

  generateRandomPositionAvoidingSnake(
    gameWidth: number,
    gameHeight: number,
    snakeBody: Point[]
  ): void {
    let attempts = 0;
    const maxAttempts = gameWidth * gameHeight; // Prevent infinite loop

    do {
      this.generateRandomPosition(gameWidth, gameHeight);
      attempts++;
    } while (!this.isValidPosition(snakeBody) && attempts < maxAttempts);
  }

  isConsumedBy(snake: Snake): boolean {
    const snakeHead = snake.getHead();
    const currentPosition = this.getPosition();

    return (
      snakeHead.x === currentPosition.x && snakeHead.y === currentPosition.y
    );
  }

  respawn(gameWidth: number, gameHeight: number, snakeBody: Point[]): void {
    this.generateRandomPositionAvoidingSnake(gameWidth, gameHeight, snakeBody);
  }
}
