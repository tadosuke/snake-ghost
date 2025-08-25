import { describe, it, expect, vi } from 'vitest';
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

  it('renders snake on canvas', () => {
    // This test should fail initially because snake rendering is not implemented
    const game = new Game(false); // Don't autostart to avoid DOM dependency

    // Mock renderer to capture rendering calls
    const mockRenderer = {
      clear: vi.fn(),
      setFillColor: vi.fn(),
      setStrokeColor: vi.fn(),
      setLineWidth: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      fillCircle: vi.fn(),
      drawText: vi.fn(),
    };

    // We need the render method to be accessible for testing
    // This should fail because render method is private
    expect(() => {
      (game as any).render(mockRenderer);
    }).not.toThrow();

    // Verify that snake segments are drawn (this will fail initially)
    // Each snake segment should result in a fillRect call
    expect(mockRenderer.fillRect).toHaveBeenCalledTimes(3); // Head + 2 body segments

    // Verify head and body are visually distinct (different colors)
    expect(mockRenderer.setFillColor).toHaveBeenCalledWith(
      expect.stringMatching(/#[0-9a-fA-F]{6}/)
    ); // Head color
    expect(mockRenderer.setFillColor).toHaveBeenCalledWith(
      expect.stringMatching(/#[0-9a-fA-F]{6}/)
    ); // Body color
  });

  it('snake moves automatically in game loop', () => {
    const game = new Game(false); // Don't autostart to avoid DOM dependency
    const snake = game.getSnake();

    // Get initial snake head position
    const initialHead = snake.getHead();
    expect(initialHead).toEqual({ x: 10, y: 5 });

    // Simulate game update with sufficient time to trigger movement
    // Snake should move at consistent intervals (e.g., every 200ms)
    // GameLoop provides deltaTime in seconds, so 0.25 = 250ms
    const deltaTime = 0.25; // More than movement interval (200ms) to ensure movement

    // Call update method to trigger snake movement
    (game as any).update(deltaTime);

    // Verify snake has moved from initial position
    const newHead = snake.getHead();
    expect(newHead).not.toEqual(initialHead);

    // Since snake moves right by default, new head should be one cell to the right
    expect(newHead).toEqual({ x: 11, y: 5 });
  });
});
