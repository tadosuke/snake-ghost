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
});