import { describe, it, expect } from 'vitest';
import { Snake } from '../../src/entities/Snake';

describe('Snake', () => {
  it('initializes with starting position (x, y)', () => {
    const startX = 5;
    const startY = 10;
    const snake = new Snake(startX, startY);

    const head = snake.getHead();
    expect(head.x).toBe(startX);
    expect(head.y).toBe(startY);
  });

  it('starts with initial length of 3 segments', () => {
    const snake = new Snake(5, 5);

    expect(snake.getBodyLength()).toBe(3);
  });

  it('has default direction of "right"', () => {
    const snake = new Snake(5, 5);

    expect(snake.getDirection()).toBe('right');
  });

  it('snake body contains correct number of segments', () => {
    const snake = new Snake(5, 5);
    const body = snake.getBody();

    expect(body).toHaveLength(3);
    expect(body[0]).toEqual({ x: 5, y: 5 }); // Head
    expect(body[1]).toEqual({ x: 4, y: 5 }); // Body segment behind head
    expect(body[2]).toEqual({ x: 3, y: 5 }); // Tail segment
  });

  it('first segment is the head at starting position', () => {
    const startX = 7;
    const startY = 3;
    const snake = new Snake(startX, startY);

    const body = snake.getBody();
    const head = snake.getHead();

    expect(body[0]).toBe(head);
    expect(body[0]).toEqual({ x: startX, y: startY });
  });

  it('body segments are positioned correctly behind head', () => {
    const startX = 10;
    const startY = 5;
    const snake = new Snake(startX, startY);

    const body = snake.getBody();

    // Head should be at starting position
    expect(body[0]).toEqual({ x: startX, y: startY });

    // Second segment should be one unit to the left of head (default direction is right)
    expect(body[1]).toEqual({ x: startX - 1, y: startY });

    // Third segment (tail) should be two units to the left of head
    expect(body[2]).toEqual({ x: startX - 2, y: startY });

    // Verify segments are in a line horizontally
    expect(body[0].y).toBe(body[1].y);
    expect(body[1].y).toBe(body[2].y);

    // Verify segments are spaced one unit apart
    expect(body[0].x - body[1].x).toBe(1);
    expect(body[1].x - body[2].x).toBe(1);
  });

  it('can get snake body length', () => {
    const snake = new Snake(5, 5);

    // Snake should start with initial length of 3 segments
    expect(snake.getBodyLength()).toBe(3);

    // Verify that body length matches actual body array length
    const body = snake.getBody();
    expect(snake.getBodyLength()).toBe(body.length);

    // Test with different starting position to ensure consistency
    const snake2 = new Snake(10, 15);
    expect(snake2.getBodyLength()).toBe(3);
  });

  it('can get current direction', () => {
    const snake = new Snake(5, 5);

    // Snake should return its current direction
    const currentDirection = snake.getDirection();
    expect(currentDirection).toBe('right');

    // Verify direction is returned as expected type
    expect(typeof currentDirection).toBe('string');

    // Test with different starting position to ensure consistency
    const snake2 = new Snake(10, 15);
    expect(snake2.getDirection()).toBe('right');

    // Verify direction method always returns the same value for same instance
    expect(snake.getDirection()).toBe(snake.getDirection());
  });
});
