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
});