import { describe, it, expect } from 'vitest';
import { Snake } from '../../src/entities/Snake';

describe('Snake', () => {
  it('initializes correctly with starting position and default values', () => {
    const snake = new Snake(10, 5);

    // Test starting position, length, and direction
    expect(snake.getHead()).toEqual({ x: 10, y: 5 });
    expect(snake.getBodyLength()).toBe(3);
    expect(snake.getDirection()).toBe('right');

    // Test body structure: head at start, segments trailing to the left
    const body = snake.getBody();
    expect(body[0]).toEqual({ x: 10, y: 5 }); // Head
    expect(body[1]).toEqual({ x: 9, y: 5 }); // Body segment
    expect(body[2]).toEqual({ x: 8, y: 5 }); // Tail segment
  });

  it('can check if position is part of snake body', () => {
    const snake = new Snake(10, 5);

    // Test positions in snake body
    expect(snake.containsPosition(10, 5)).toBe(true); // Head
    expect(snake.containsPosition(9, 5)).toBe(true); // Body segment
    expect(snake.containsPosition(8, 5)).toBe(true); // Tail segment

    // Test positions not in snake body
    expect(snake.containsPosition(11, 5)).toBe(false); // In front of head
    expect(snake.containsPosition(7, 5)).toBe(false); // Behind tail
    expect(snake.containsPosition(10, 6)).toBe(false); // Different y coordinate
  });

  it('snake moves in all directions correctly', () => {
    const snake = new Snake(10, 10);

    // Test right movement (default direction)
    const initialHead = snake.getHead();
    snake.move();
    expect(snake.getHead()).toEqual({ x: initialHead.x + 1, y: initialHead.y });

    // Test up movement
    snake.setDirection('up');
    const headBeforeUp = snake.getHead();
    snake.move();
    expect(snake.getHead()).toEqual({
      x: headBeforeUp.x,
      y: headBeforeUp.y - 1,
    });

    // Test left movement
    snake.setDirection('left');
    const headBeforeLeft = snake.getHead();
    snake.move();
    expect(snake.getHead()).toEqual({
      x: headBeforeLeft.x - 1,
      y: headBeforeLeft.y,
    });

    // Test down movement
    snake.setDirection('down');
    const headBeforeDown = snake.getHead();
    snake.move();
    expect(snake.getHead()).toEqual({
      x: headBeforeDown.x,
      y: headBeforeDown.y + 1,
    });
  });

  it('snake cannot reverse direction immediately', () => {
    const snake = new Snake(5, 5);

    // Test right to left reversal prevention
    expect(snake.getDirection()).toBe('right');
    snake.setDirection('left');
    expect(snake.getDirection()).toBe('right');

    // Test up to down reversal prevention
    snake.setDirection('up');
    expect(snake.getDirection()).toBe('up');
    snake.setDirection('down');
    expect(snake.getDirection()).toBe('up');
  });

  it('snake head position updates correctly after movement', () => {
    const snake = new Snake(10, 10);

    // Test right movement (default direction)
    const initialHead = snake.getHead();
    snake.move();
    const newHead = snake.getHead();
    expect(newHead.x).toBe(initialHead.x + 1);
    expect(newHead.y).toBe(initialHead.y);
  });

  it('snake body follows head when moving', () => {
    const snake = new Snake(10, 10);

    // Capture initial head position
    const initialHead = snake.getHead();

    // Move and verify body follows
    snake.move();
    const bodyAfterMove = snake.getBody();

    // Body segment should be where head was
    expect(bodyAfterMove[1]).toEqual(initialHead);

    // Verify length remains constant
    expect(bodyAfterMove).toHaveLength(3);
  });

  it('can set new direction', () => {
    const snake = new Snake(5, 5);

    // Test setting valid directions (non-opposite to current)
    expect(snake.getDirection()).toBe('right');

    snake.setDirection('up');
    expect(snake.getDirection()).toBe('up');

    snake.setDirection('left');
    expect(snake.getDirection()).toBe('left');

    snake.setDirection('down');
    expect(snake.getDirection()).toBe('down');
  });

  it('can get current direction vector', () => {
    const snake = new Snake(5, 5);

    // Test each direction vector
    expect(snake.getDirectionVector()).toEqual({ x: 1, y: 0 }); // right (default)

    snake.setDirection('up');
    expect(snake.getDirectionVector()).toEqual({ x: 0, y: -1 });

    snake.setDirection('left');
    expect(snake.getDirectionVector()).toEqual({ x: -1, y: 0 });

    snake.setDirection('down');
    expect(snake.getDirectionVector()).toEqual({ x: 0, y: 1 });
  });

  it('snake grows when eating food', () => {
    const snake = new Snake(10, 10);

    // Verify initial length
    expect(snake.getBodyLength()).toBe(3);

    // Eating should not immediately change length
    snake.eat();
    expect(snake.getBodyLength()).toBe(3);

    // Moving after eating should increase length by 1
    snake.move();
    expect(snake.getBodyLength()).toBe(4);

    // Subsequent moves without eating should maintain length
    snake.move();
    expect(snake.getBodyLength()).toBe(4);
  });

  it('new segment added to tail when growing', () => {
    const snake = new Snake(10, 10);

    // Move once to establish tail position
    snake.move();
    const tailPositionBeforeGrowth = snake.getBody()[2];

    // Eat and move to trigger growth
    snake.eat();
    snake.move();

    // Verify new tail segment is at the position that would have been removed
    const bodyAfterGrowth = snake.getBody();
    expect(bodyAfterGrowth).toHaveLength(4);
    expect(bodyAfterGrowth[3]).toEqual(tailPositionBeforeGrowth);
  });

  it('multiple consecutive growths work correctly', () => {
    const snake = new Snake(10, 10);

    // Initial length should be 3
    expect(snake.getBodyLength()).toBe(3);

    // Eat 3 times in a row (should stack growth)
    snake.eat();
    snake.eat();
    snake.eat();

    // Length should still be 3 (growth happens on move)
    expect(snake.getBodyLength()).toBe(3);

    // First move: length should increase to 4
    snake.move();
    expect(snake.getBodyLength()).toBe(4);

    // Second move: length should increase to 5
    snake.move();
    expect(snake.getBodyLength()).toBe(5);

    // Third move: length should increase to 6
    snake.move();
    expect(snake.getBodyLength()).toBe(6);

    // Fourth move: no more pending growth, length should remain 6
    snake.move();
    expect(snake.getBodyLength()).toBe(6);
  });

  it('snake detects self-collision with body', () => {
    const snake = new Snake(3, 3);

    // Initially no collision
    expect(snake.checkSelfCollision()).toBe(false);

    // Create a collision scenario by making the snake trace a path that loops back on itself
    snake.eat();
    snake.eat();

    // Move right to extend the snake
    snake.move(); // (4,3)
    snake.move(); // (5,3)

    // Create a rectangular path that will eventually lead to collision
    snake.setDirection('down');
    snake.move(); // (5,4)

    snake.setDirection('left');
    snake.move(); // (4,4)
    snake.move(); // (3,4)

    snake.setDirection('up');
    snake.move(); // (3,3)

    snake.setDirection('left');
    snake.move(); // (2,3)

    snake.setDirection('up');
    snake.move(); // (2,2)

    snake.setDirection('right');
    snake.move(); // (3,2)

    // Now moving down would collide with body segment at (3,3)
    snake.setDirection('down');
    expect(snake.checkSelfCollision()).toBe(true);
  });

  it('snake detects boundary collision (walls)', () => {
    const gameWidth = 20;
    const gameHeight = 15;

    // Test collision at each boundary
    const snakeRight = new Snake(gameWidth - 1, 10);
    expect(snakeRight.checkBoundaryCollision(gameWidth, gameHeight)).toBe(true);

    const snakeLeft = new Snake(0, 10);
    snakeLeft.setDirection('up');
    snakeLeft.setDirection('left');
    expect(snakeLeft.checkBoundaryCollision(gameWidth, gameHeight)).toBe(true);

    const snakeTop = new Snake(10, 0);
    snakeTop.setDirection('up');
    expect(snakeTop.checkBoundaryCollision(gameWidth, gameHeight)).toBe(true);

    const snakeBottom = new Snake(10, gameHeight - 1);
    snakeBottom.setDirection('down');
    expect(snakeBottom.checkBoundaryCollision(gameWidth, gameHeight)).toBe(
      true
    );

    // Test no collision in center
    const snakeCenter = new Snake(10, 7);
    expect(snakeCenter.checkBoundaryCollision(gameWidth, gameHeight)).toBe(
      false
    );
  });

  it('snake can reset to initial state', () => {
    const startX = 10;
    const startY = 8;
    const snake = new Snake(startX, startY);

    // Store initial state
    const initialHead = snake.getHead();
    const initialBody = [...snake.getBody()];
    const initialDirection = snake.getDirection();
    const initialLength = snake.getBodyLength();

    // Modify snake state: add growth, move, and change direction
    snake.eat();
    snake.eat();
    snake.move(); // Grow and move
    snake.move();
    snake.setDirection('up');
    snake.move();

    // Reset and verify all state is restored
    snake.reset(startX, startY);
    expect(snake.getHead()).toEqual(initialHead);
    expect(snake.getBody()).toEqual(initialBody);
    expect(snake.getDirection()).toBe(initialDirection);
    expect(snake.getBodyLength()).toBe(initialLength);

    // Verify growth is cleared
    snake.move();
    expect(snake.getBodyLength()).toBe(initialLength);
  });
});
