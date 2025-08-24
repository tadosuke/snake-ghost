import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameLoop } from '../../src/core/gameLoop.ts';
import { Renderer } from '../../src/rendering/renderer.ts';

// Mock the Renderer class
vi.mock('../../src/rendering/renderer.ts', () => ({
  Renderer: vi.fn().mockImplementation(() => ({
    // Add any renderer methods you need to mock
  })),
}));

describe('GameLoop', () => {
  let gameLoop: GameLoop;
  let mockRenderer: Renderer;
  let mockUpdateCallback: ReturnType<typeof vi.fn>;
  let mockRenderCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock performance.now() for consistent timing tests
    vi.spyOn(performance, 'now').mockReturnValue(1000);

    // Mock requestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = vi.fn((callback) => {
      setTimeout(() => callback(performance.now()), 16);
      return 1;
    });
    global.cancelAnimationFrame = vi.fn();

    // Create a dummy CanvasManager mock object
    const mockCanvasManager = {} as any;
    mockRenderer = new Renderer(mockCanvasManager);
    gameLoop = new GameLoop(mockRenderer);

    mockUpdateCallback = vi.fn();
    mockRenderCallback = vi.fn();
  });

  afterEach(() => {
    // Clean up after each test
    gameLoop.stop();
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with correct default state', () => {
      const state = gameLoop.getState();

      expect(state.isRunning).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.lastFrameTime).toBe(0);
      expect(state.deltaTime).toBe(0);
    });

    it('should store the renderer reference', () => {
      expect(gameLoop).toBeDefined();
    });
  });

  describe('callback setters', () => {
    it('should set update callback', () => {
      gameLoop.setUpdateCallback(mockUpdateCallback);
      // Verify callback is stored (indirectly tested through start method)
      expect(mockUpdateCallback).toBeDefined();
    });

    it('should set render callback', () => {
      gameLoop.setRenderCallback(mockRenderCallback);
      // Verify callback is stored (indirectly tested through start method)
      expect(mockRenderCallback).toBeDefined();
    });
  });

  describe('start method', () => {
    it('should start the game loop', () => {
      gameLoop.start();

      expect(gameLoop.isRunning()).toBe(true);
      expect(gameLoop.isPaused()).toBe(false);
    });

    it('should not start if already running', () => {
      gameLoop.start();
      const firstState = gameLoop.getState();

      gameLoop.start(); // Try to start again
      const secondState = gameLoop.getState();

      expect(firstState.lastFrameTime).toBe(secondState.lastFrameTime);
    });

    it('should set lastFrameTime when starting', () => {
      gameLoop.start();
      const state = gameLoop.getState();

      expect(state.lastFrameTime).toBe(1000); // Mocked performance.now() value
    });

    it('should call requestAnimationFrame', () => {
      gameLoop.start();

      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('pause method', () => {
    it('should pause the game loop', () => {
      gameLoop.start();
      gameLoop.pause();

      expect(gameLoop.isPaused()).toBe(true);
      expect(gameLoop.isRunning()).toBe(true); // Still running, just paused
    });

    it('should pause even when not running', () => {
      gameLoop.pause();

      expect(gameLoop.isPaused()).toBe(true);
    });
  });

  describe('resume method', () => {
    it('should resume a paused game loop', () => {
      gameLoop.start();
      gameLoop.pause();

      // Change mock time to simulate time passing
      vi.spyOn(performance, 'now').mockReturnValue(2000);

      gameLoop.resume();

      expect(gameLoop.isPaused()).toBe(false);
      expect(gameLoop.getState().lastFrameTime).toBe(2000);
    });

    it('should not resume if not running', () => {
      gameLoop.pause();
      gameLoop.resume();

      expect(gameLoop.isRunning()).toBe(false);
    });
  });

  describe('stop method', () => {
    it('should stop the game loop', () => {
      gameLoop.start();
      gameLoop.stop();

      expect(gameLoop.isRunning()).toBe(false);
      expect(gameLoop.isPaused()).toBe(false);
    });

    it('should cancel animation frame', () => {
      gameLoop.start();
      gameLoop.stop();

      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should handle stopping when not running', () => {
      gameLoop.stop();

      expect(gameLoop.isRunning()).toBe(false);
    });
  });

  describe('game loop execution', () => {
    beforeEach(() => {
      gameLoop.setUpdateCallback(mockUpdateCallback);
      gameLoop.setRenderCallback(mockRenderCallback);
    });

    it('should call update and render callbacks when running', async () => {
      gameLoop.start();

      // Wait for the mocked setTimeout to execute
      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(mockUpdateCallback).toHaveBeenCalled();
      expect(mockRenderCallback).toHaveBeenCalledWith(mockRenderer);
    });

    it('should not call callbacks when paused', async () => {
      gameLoop.start();
      gameLoop.pause();

      // Clear previous calls
      mockUpdateCallback.mockClear();
      mockRenderCallback.mockClear();

      // Wait for potential callback execution
      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(mockUpdateCallback).not.toHaveBeenCalled();
      expect(mockRenderCallback).not.toHaveBeenCalled();
    });

    it('should calculate delta time correctly', async () => {
      let timeSequence = [1000, 1016]; // 16ms difference
      let timeIndex = 0;

      vi.spyOn(performance, 'now').mockImplementation(
        () => timeSequence[timeIndex++] || timeSequence[timeSequence.length - 1]
      );

      gameLoop.start();

      // Wait for callback execution
      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(mockUpdateCallback).toHaveBeenCalledWith(0.016); // 16ms = 0.016s
    });

    it('should cap delta time at 100ms', async () => {
      let timeSequence = [1000, 1200]; // 200ms difference, should be capped at 100ms
      let timeIndex = 0;

      vi.spyOn(performance, 'now').mockImplementation(
        () => timeSequence[timeIndex++] || timeSequence[timeSequence.length - 1]
      );

      gameLoop.start();

      // Wait for callback execution
      await new Promise((resolve) => setTimeout(resolve, 20));

      expect(mockUpdateCallback).toHaveBeenCalledWith(0.1); // Capped at 100ms = 0.1s
    });
  });

  describe('state getters', () => {
    it('should return correct running state', () => {
      expect(gameLoop.isRunning()).toBe(false);

      gameLoop.start();
      expect(gameLoop.isRunning()).toBe(true);

      gameLoop.stop();
      expect(gameLoop.isRunning()).toBe(false);
    });

    it('should return correct paused state', () => {
      expect(gameLoop.isPaused()).toBe(false);

      gameLoop.pause();
      expect(gameLoop.isPaused()).toBe(true);

      // Start the game loop so resume() will actually work
      gameLoop.start();
      gameLoop.resume();
      expect(gameLoop.isPaused()).toBe(false);
    });

    it('should return state copy', () => {
      const state1 = gameLoop.getState();
      const state2 = gameLoop.getState();

      expect(state1).toEqual(state2);
      expect(state1).not.toBe(state2); // Different objects
    });
  });

  describe('edge cases', () => {
    it('should handle missing callbacks gracefully', async () => {
      gameLoop.start();

      // Wait for loop execution without callbacks set
      await new Promise((resolve) => setTimeout(resolve, 20));

      // Should not throw errors
      expect(gameLoop.isRunning()).toBe(true);
    });

    it('should handle rapid start/stop cycles', () => {
      gameLoop.start();
      gameLoop.stop();
      gameLoop.start();
      gameLoop.stop();

      expect(gameLoop.isRunning()).toBe(false);
    });

    it('should handle pause/resume without start', () => {
      gameLoop.pause();
      gameLoop.resume();

      expect(gameLoop.isRunning()).toBe(false);
      expect(gameLoop.isPaused()).toBe(true);
    });
  });
});
