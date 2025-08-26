import { describe, it, expect } from 'vitest';
import { Food } from '../../src/entities/Food';
import { Snake } from '../../src/entities/Snake';

describe('Food', () => {
  it('initializes correctly with position coordinates', () => {
    const food = new Food(15, 10);

    // Test position storage
    expect(food.getPosition()).toEqual({ x: 15, y: 10 });
  });

  it('getPosition returns correct coordinates', () => {
    const food = new Food(5, 8);

    // Test position retrieval
    const position = food.getPosition();
    expect(position.x).toBe(5);
    expect(position.y).toBe(8);
  });

  it('setPosition updates position correctly', () => {
    const food = new Food(10, 10);

    // Update position
    food.setPosition(20, 25);

    // Verify new position
    expect(food.getPosition()).toEqual({ x: 20, y: 25 });
  });

  it('generates random position within game boundaries', () => {
    const gameWidth = 20;
    const gameHeight = 15;
    const food = new Food(0, 0);

    // Generate random position
    food.generateRandomPosition(gameWidth, gameHeight);

    // Verify position is within boundaries
    const position = food.getPosition();
    expect(position.x).toBeGreaterThanOrEqual(0);
    expect(position.x).toBeLessThan(gameWidth);
    expect(position.y).toBeGreaterThanOrEqual(0);
    expect(position.y).toBeLessThan(gameHeight);
  });

  it('food position is within valid game grid', () => {
    const gameWidth = 10;
    const gameHeight = 8;
    const food = new Food(0, 0);

    // Generate multiple positions to test randomness
    for (let i = 0; i < 100; i++) {
      food.generateRandomPosition(gameWidth, gameHeight);
      const position = food.getPosition();

      // All positions must be integers within grid bounds
      expect(Number.isInteger(position.x)).toBe(true);
      expect(Number.isInteger(position.y)).toBe(true);
      expect(position.x).toBeGreaterThanOrEqual(0);
      expect(position.x).toBeLessThan(gameWidth);
      expect(position.y).toBeGreaterThanOrEqual(0);
      expect(position.y).toBeLessThan(gameHeight);
    }
  });

  it('food does not generate on snake body positions', () => {
    const snake = new Snake(5, 5);
    const food = new Food(0, 0);

    // Get snake body positions
    const snakeBody = snake.getBody();

    // Test that food position is invalid when on snake body
    expect(food.isValidPosition(snakeBody)).toBe(true); // Initially valid (not on snake)

    // Set food position to snake head
    const head = snake.getHead();
    food.setPosition(head.x, head.y);
    expect(food.isValidPosition(snakeBody)).toBe(false); // Should be invalid

    // Set food position to snake body segment
    const bodySegment = snakeBody[1];
    food.setPosition(bodySegment.x, bodySegment.y);
    expect(food.isValidPosition(snakeBody)).toBe(false); // Should be invalid
  });

  it('food regenerates if initial position conflicts with snake', () => {
    const snake = new Snake(10, 10);
    const food = new Food(0, 0);
    const gameWidth = 20;
    const gameHeight = 15;

    // Make snake longer to increase collision chance
    snake.eat();
    snake.eat();
    snake.move();
    snake.move();

    // Generate random position avoiding snake
    food.generateRandomPositionAvoidingSnake(
      gameWidth,
      gameHeight,
      snake.getBody()
    );

    // Verify position is valid (not on snake)
    expect(food.isValidPosition(snake.getBody())).toBe(true);
  });

  it('detects when snake head position matches food position', () => {
    const snake = new Snake(10, 10);
    const food = new Food(15, 8);

    // Initially no consumption (different positions)
    expect(food.isConsumedBy(snake)).toBe(false);

    // Move food to snake head position
    const head = snake.getHead();
    food.setPosition(head.x, head.y);

    // Should detect consumption
    expect(food.isConsumedBy(snake)).toBe(true);
  });

  it('isConsumedBy method returns boolean correctly', () => {
    const snake = new Snake(5, 5);
    const food = new Food(0, 0);

    // Test various scenarios
    expect(food.isConsumedBy(snake)).toBe(false); // Different positions

    // Move snake and check consumption at different positions
    snake.move(); // Snake head moves right to (6, 5)
    expect(food.isConsumedBy(snake)).toBe(false);

    // Place food at new snake head position
    food.setPosition(6, 5);
    expect(food.isConsumedBy(snake)).toBe(true);

    // Move food away
    food.setPosition(10, 10);
    expect(food.isConsumedBy(snake)).toBe(false);
  });

  it('food generates new position after consumption', () => {
    const snake = new Snake(5, 5);
    const food = new Food(5, 5); // Place food at snake head initially
    const gameWidth = 20;
    const gameHeight = 15;

    // Verify food is at snake head position (consumed)
    expect(food.isConsumedBy(snake)).toBe(true);

    // Respawn food
    food.respawn(gameWidth, gameHeight, snake.getBody());

    // Verify food is no longer at snake position
    expect(food.isConsumedBy(snake)).toBe(false);
    expect(food.isValidPosition(snake.getBody())).toBe(true);
  });

  it('new position avoids snake body after respawn', () => {
    const snake = new Snake(10, 10);
    const food = new Food(0, 0);
    const gameWidth = 15;
    const gameHeight = 12;

    // Make snake longer to increase collision opportunities
    snake.eat();
    snake.eat();
    snake.eat();
    snake.move();
    snake.move();
    snake.move();

    // Test respawn multiple times to ensure reliability
    for (let i = 0; i < 10; i++) {
      food.respawn(gameWidth, gameHeight, snake.getBody());

      // Verify food is not on any snake body segment
      expect(food.isValidPosition(snake.getBody())).toBe(true);

      // Verify food is within game boundaries
      const position = food.getPosition();
      expect(position.x).toBeGreaterThanOrEqual(0);
      expect(position.x).toBeLessThan(gameWidth);
      expect(position.y).toBeGreaterThanOrEqual(0);
      expect(position.y).toBeLessThan(gameHeight);
    }
  });
});
