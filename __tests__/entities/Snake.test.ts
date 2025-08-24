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

  it('can get all body segments', () => {
    const startX = 8;
    const startY = 6;
    const snake = new Snake(startX, startY);

    // Get all body segments
    const allSegments = snake.getBody();

    // Verify we get an array of all segments
    expect(Array.isArray(allSegments)).toBe(true);
    expect(allSegments).toHaveLength(3);

    // Verify each segment has correct Point structure
    allSegments.forEach((segment, index) => {
      expect(segment).toHaveProperty('x');
      expect(segment).toHaveProperty('y');
      expect(typeof segment.x).toBe('number');
      expect(typeof segment.y).toBe('number');
    });

    // Verify segments are in correct order (head to tail)
    expect(allSegments[0]).toEqual({ x: startX, y: startY }); // Head
    expect(allSegments[1]).toEqual({ x: startX - 1, y: startY }); // Body
    expect(allSegments[2]).toEqual({ x: startX - 2, y: startY }); // Tail

    // Verify method returns reference to internal array (not a copy)
    const segments1 = snake.getBody();
    const segments2 = snake.getBody();
    expect(segments1).toBe(segments2);

    // Test with different starting position
    const snake2 = new Snake(0, 0);
    const segments3 = snake2.getBody();
    expect(segments3).toHaveLength(3);
    expect(segments3[0]).toEqual({ x: 0, y: 0 });
  });

  it('can check if position is part of snake body', () => {
    const startX = 10;
    const startY = 5;
    const snake = new Snake(startX, startY);

    // Test head position
    expect(snake.containsPosition(startX, startY)).toBe(true);

    // Test body segment positions
    expect(snake.containsPosition(startX - 1, startY)).toBe(true); // Body segment
    expect(snake.containsPosition(startX - 2, startY)).toBe(true); // Tail segment

    // Test positions not in snake body
    expect(snake.containsPosition(startX + 1, startY)).toBe(false); // In front of head
    expect(snake.containsPosition(startX, startY + 1)).toBe(false); // Above head
    expect(snake.containsPosition(startX, startY - 1)).toBe(false); // Below head
    expect(snake.containsPosition(startX - 3, startY)).toBe(false); // Behind tail

    // Test completely different positions
    expect(snake.containsPosition(0, 0)).toBe(false);
    expect(snake.containsPosition(100, 100)).toBe(false);

    // Test with different starting position to ensure consistency
    const snake2 = new Snake(0, 0);
    expect(snake2.containsPosition(0, 0)).toBe(true); // Head
    expect(snake2.containsPosition(-1, 0)).toBe(true); // Body
    expect(snake2.containsPosition(-2, 0)).toBe(true); // Tail
    expect(snake2.containsPosition(1, 0)).toBe(false); // Not in body
  });

  it('snake moves right correctly', () => {
    const startX = 5;
    const startY = 5;
    const snake = new Snake(startX, startY);

    // Verify initial state
    expect(snake.getDirection()).toBe('right');
    const initialBody = snake.getBody();
    expect(initialBody).toHaveLength(3);
    expect(initialBody[0]).toEqual({ x: startX, y: startY }); // Head
    expect(initialBody[1]).toEqual({ x: startX - 1, y: startY }); // Body
    expect(initialBody[2]).toEqual({ x: startX - 2, y: startY }); // Tail

    // Move right
    snake.move();

    // Verify new state after moving right
    const newBody = snake.getBody();
    expect(newBody).toHaveLength(3); // Length should remain the same

    // Head should move one position to the right
    expect(newBody[0]).toEqual({ x: startX + 1, y: startY });

    // Body segments should follow (previous head becomes new body segment)
    expect(newBody[1]).toEqual({ x: startX, y: startY }); // Old head position
    expect(newBody[2]).toEqual({ x: startX - 1, y: startY }); // Old body position

    // Old tail should be removed (startX - 2, startY should no longer be in body)
    expect(snake.containsPosition(startX - 2, startY)).toBe(false);

    // New head position should be in body
    expect(snake.containsPosition(startX + 1, startY)).toBe(true);

    // Test multiple moves in sequence
    snake.move();
    const bodyAfterSecondMove = snake.getBody();
    expect(bodyAfterSecondMove[0]).toEqual({ x: startX + 2, y: startY }); // Head moves further right
    expect(bodyAfterSecondMove[1]).toEqual({ x: startX + 1, y: startY }); // Previous head position
    expect(bodyAfterSecondMove[2]).toEqual({ x: startX, y: startY }); // Previous body position

    // Direction should remain the same
    expect(snake.getDirection()).toBe('right');
  });

  it('snake moves left correctly', () => {
    const startX = 10;
    const startY = 7;
    const snake = new Snake(startX, startY);

    // First change to up (valid change from right)
    snake.setDirection('up');
    // Then change to left (valid change from up)
    snake.setDirection('left');
    expect(snake.getDirection()).toBe('left');

    // Verify initial state
    const initialBody = snake.getBody();
    expect(initialBody).toHaveLength(3);
    expect(initialBody[0]).toEqual({ x: startX, y: startY }); // Head
    expect(initialBody[1]).toEqual({ x: startX - 1, y: startY }); // Body
    expect(initialBody[2]).toEqual({ x: startX - 2, y: startY }); // Tail

    // Move left
    snake.move();

    // Verify new state after moving left
    const newBody = snake.getBody();
    expect(newBody).toHaveLength(3); // Length should remain the same

    // Head should move one position to the left
    expect(newBody[0]).toEqual({ x: startX - 1, y: startY });

    // Body segments should follow (previous head becomes new body segment)
    expect(newBody[1]).toEqual({ x: startX, y: startY }); // Old head position
    expect(newBody[2]).toEqual({ x: startX - 1, y: startY }); // Old body position

    // Old tail should be removed (startX - 2, startY should no longer be in body)
    expect(snake.containsPosition(startX - 2, startY)).toBe(false);

    // New head position should be in body
    expect(snake.containsPosition(startX - 1, startY)).toBe(true);

    // Test multiple moves in sequence
    snake.move();
    const bodyAfterSecondMove = snake.getBody();
    expect(bodyAfterSecondMove[0]).toEqual({ x: startX - 2, y: startY }); // Head moves further left
    expect(bodyAfterSecondMove[1]).toEqual({ x: startX - 1, y: startY }); // Previous head position
    expect(bodyAfterSecondMove[2]).toEqual({ x: startX, y: startY }); // Previous body position

    // Direction should remain left
    expect(snake.getDirection()).toBe('left');
  });

  it('snake moves up correctly', () => {
    const startX = 8;
    const startY = 12;
    const snake = new Snake(startX, startY);

    // Set direction to up
    snake.setDirection('up');
    expect(snake.getDirection()).toBe('up');

    // Verify initial state
    const initialBody = snake.getBody();
    expect(initialBody).toHaveLength(3);
    expect(initialBody[0]).toEqual({ x: startX, y: startY }); // Head
    expect(initialBody[1]).toEqual({ x: startX - 1, y: startY }); // Body
    expect(initialBody[2]).toEqual({ x: startX - 2, y: startY }); // Tail

    // Move up
    snake.move();

    // Verify new state after moving up
    const newBody = snake.getBody();
    expect(newBody).toHaveLength(3); // Length should remain the same

    // Head should move one position up (y decreases)
    expect(newBody[0]).toEqual({ x: startX, y: startY - 1 });

    // Body segments should follow (previous head becomes new body segment)
    expect(newBody[1]).toEqual({ x: startX, y: startY }); // Old head position
    expect(newBody[2]).toEqual({ x: startX - 1, y: startY }); // Old body position

    // Old tail should be removed
    expect(snake.containsPosition(startX - 2, startY)).toBe(false);

    // New head position should be in body
    expect(snake.containsPosition(startX, startY - 1)).toBe(true);

    // Test multiple moves in sequence
    snake.move();
    const bodyAfterSecondMove = snake.getBody();
    expect(bodyAfterSecondMove[0]).toEqual({ x: startX, y: startY - 2 }); // Head moves further up
    expect(bodyAfterSecondMove[1]).toEqual({ x: startX, y: startY - 1 }); // Previous head position
    expect(bodyAfterSecondMove[2]).toEqual({ x: startX, y: startY }); // Previous body position

    // Direction should remain up
    expect(snake.getDirection()).toBe('up');

    // Verify body forms a vertical line going upward
    expect(bodyAfterSecondMove[0].x).toBe(bodyAfterSecondMove[1].x);
    expect(bodyAfterSecondMove[1].x).toBe(bodyAfterSecondMove[2].x);
    expect(bodyAfterSecondMove[0].y).toBe(startY - 2);
    expect(bodyAfterSecondMove[1].y).toBe(startY - 1);
    expect(bodyAfterSecondMove[2].y).toBe(startY);
  });

  it('snake moves down correctly', () => {
    const startX = 6;
    const startY = 4;
    const snake = new Snake(startX, startY);

    // Set direction to down
    snake.setDirection('down');
    expect(snake.getDirection()).toBe('down');

    // Verify initial state
    const initialBody = snake.getBody();
    expect(initialBody).toHaveLength(3);
    expect(initialBody[0]).toEqual({ x: startX, y: startY }); // Head
    expect(initialBody[1]).toEqual({ x: startX - 1, y: startY }); // Body
    expect(initialBody[2]).toEqual({ x: startX - 2, y: startY }); // Tail

    // Move down
    snake.move();

    // Verify new state after moving down
    const newBody = snake.getBody();
    expect(newBody).toHaveLength(3); // Length should remain the same

    // Head should move one position down (y increases)
    expect(newBody[0]).toEqual({ x: startX, y: startY + 1 });

    // Body segments should follow (previous head becomes new body segment)
    expect(newBody[1]).toEqual({ x: startX, y: startY }); // Old head position
    expect(newBody[2]).toEqual({ x: startX - 1, y: startY }); // Old body position

    // Old tail should be removed
    expect(snake.containsPosition(startX - 2, startY)).toBe(false);

    // New head position should be in body
    expect(snake.containsPosition(startX, startY + 1)).toBe(true);

    // Test multiple moves in sequence
    snake.move();
    const bodyAfterSecondMove = snake.getBody();
    expect(bodyAfterSecondMove[0]).toEqual({ x: startX, y: startY + 2 }); // Head moves further down
    expect(bodyAfterSecondMove[1]).toEqual({ x: startX, y: startY + 1 }); // Previous head position
    expect(bodyAfterSecondMove[2]).toEqual({ x: startX, y: startY }); // Previous body position

    // Direction should remain down
    expect(snake.getDirection()).toBe('down');

    // Verify body forms a vertical line going downward
    expect(bodyAfterSecondMove[0].x).toBe(bodyAfterSecondMove[1].x);
    expect(bodyAfterSecondMove[1].x).toBe(bodyAfterSecondMove[2].x);
    expect(bodyAfterSecondMove[0].y).toBe(startY + 2);
    expect(bodyAfterSecondMove[1].y).toBe(startY + 1);
    expect(bodyAfterSecondMove[2].y).toBe(startY);

    // Verify segments are properly spaced
    expect(bodyAfterSecondMove[1].y - bodyAfterSecondMove[2].y).toBe(1);
    expect(bodyAfterSecondMove[0].y - bodyAfterSecondMove[1].y).toBe(1);
  });

  it('snake cannot reverse direction immediately (right to left)', () => {
    const snake = new Snake(5, 5);

    // Verify initial direction is right
    expect(snake.getDirection()).toBe('right');

    // Try to set direction to left (opposite of right)
    snake.setDirection('left');

    // Direction should remain right (invalid change ignored)
    expect(snake.getDirection()).toBe('right');

    // Test that snake still moves right after attempted reversal
    const initialHead = snake.getHead();
    snake.move();
    const newHead = snake.getHead();

    // Head should have moved right, not left
    expect(newHead.x).toBe(initialHead.x + 1);
    expect(newHead.y).toBe(initialHead.y);
  });

  it('snake cannot reverse direction immediately (left to right)', () => {
    const snake = new Snake(5, 5);

    // First change to up, then to left (to get snake moving left)
    snake.setDirection('up');
    snake.setDirection('left');
    expect(snake.getDirection()).toBe('left');

    // Try to set direction to right (opposite of left)
    snake.setDirection('right');

    // Direction should remain left (invalid change ignored)
    expect(snake.getDirection()).toBe('left');

    // Test that snake still moves left after attempted reversal
    const initialHead = snake.getHead();
    snake.move();
    const newHead = snake.getHead();

    // Head should have moved left, not right
    expect(newHead.x).toBe(initialHead.x - 1);
    expect(newHead.y).toBe(initialHead.y);
  });

  it('snake cannot reverse direction immediately (up to down)', () => {
    const snake = new Snake(5, 5);

    // Change to up direction (valid change from default right)
    snake.setDirection('up');
    expect(snake.getDirection()).toBe('up');

    // Try to set direction to down (opposite of up)
    snake.setDirection('down');

    // Direction should remain up (invalid change ignored)
    expect(snake.getDirection()).toBe('up');

    // Test that snake still moves up after attempted reversal
    const initialHead = snake.getHead();
    snake.move();
    const newHead = snake.getHead();

    // Head should have moved up (y decreased), not down
    expect(newHead.x).toBe(initialHead.x);
    expect(newHead.y).toBe(initialHead.y - 1);
  });
});
