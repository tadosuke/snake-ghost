import { describe, it, expect } from 'vitest';
import { Game } from '../src/main';

describe('Game', () => {
  it('creates snake instance in game', () => {
    const game = new Game(false); // Don't autostart for testing

    // Test that game has a snake instance
    expect(game.getSnake()).toBeDefined();

    // Test snake has proper initial state
    const snake = game.getSnake();
    expect(snake.getHead()).toEqual({ x: 10, y: 5 });
    expect(snake.getDirection()).toBe('right');
    expect(snake.getBodyLength()).toBe(3);
  });
});
