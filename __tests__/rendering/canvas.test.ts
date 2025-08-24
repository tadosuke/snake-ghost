import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CanvasManager } from '../../src/rendering/canvas.ts';
import type { Point } from '../../src/types/types.ts';

describe('CanvasManager', () => {
  let canvasManager: CanvasManager;
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    // Create a mock canvas element
    mockCanvas = {
      width: 0,
      height: 0,
      style: { imageRendering: '' },
      getContext: vi.fn(),
      getBoundingClientRect: vi.fn(() => ({
        left: 10,
        top: 20,
        width: 400,
        height: 300,
      })),
    } as unknown as HTMLCanvasElement;

    // Create a mock 2D context
    mockContext = {
      imageSmoothingEnabled: true,
      clearRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    // Mock the canvas getContext method to return our mock context
    mockCanvas.getContext = vi.fn().mockReturnValue(mockContext);

    // Mock document.getElementById to return our mock canvas
    vi.spyOn(document, 'getElementById').mockReturnValue(mockCanvas);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create a canvas manager with default dimensions', () => {
      canvasManager = new CanvasManager('test-canvas');

      expect(document.getElementById).toHaveBeenCalledWith('test-canvas');
      expect(mockCanvas.width).toBe(400);
      expect(mockCanvas.height).toBe(300);
      expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    });

    it('should create a canvas manager with custom dimensions', () => {
      canvasManager = new CanvasManager('test-canvas', 800, 600);

      expect(mockCanvas.width).toBe(800);
      expect(mockCanvas.height).toBe(600);
    });

    it('should throw error if canvas element is not found', () => {
      vi.spyOn(document, 'getElementById').mockReturnValue(null);

      expect(() => {
        new CanvasManager('non-existent-canvas');
      }).toThrow("Canvas element with id 'non-existent-canvas' not found");
    });

    it('should throw error if 2D context is not available', () => {
      mockCanvas.getContext = vi.fn().mockReturnValue(null);

      expect(() => {
        new CanvasManager('test-canvas');
      }).toThrow('Failed to get 2D rendering context');
    });

    it('should setup canvas for pixel-perfect rendering', () => {
      canvasManager = new CanvasManager('test-canvas');

      expect(mockContext.imageSmoothingEnabled).toBe(false);
      expect(mockCanvas.style.imageRendering).toBe('pixelated');
    });
  });

  describe('getter methods', () => {
    beforeEach(() => {
      canvasManager = new CanvasManager('test-canvas', 800, 600);
    });

    it('should return the canvas element', () => {
      const canvas = canvasManager.getCanvas();
      expect(canvas).toBe(mockCanvas);
    });

    it('should return the 2D rendering context', () => {
      const context = canvasManager.getContext();
      expect(context).toBe(mockContext);
    });

    it('should return the correct width', () => {
      const width = canvasManager.getWidth();
      expect(width).toBe(800);
    });

    it('should return the correct height', () => {
      const height = canvasManager.getHeight();
      expect(height).toBe(600);
    });
  });

  describe('clear method', () => {
    beforeEach(() => {
      canvasManager = new CanvasManager('test-canvas', 800, 600);
    });

    it('should clear the entire canvas', () => {
      canvasManager.clear();

      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });
  });

  describe('isPointInBounds method', () => {
    beforeEach(() => {
      canvasManager = new CanvasManager('test-canvas', 400, 300);
    });

    it('should return true for points within bounds', () => {
      const pointInBounds: Point = { x: 200, y: 150 };
      expect(canvasManager.isPointInBounds(pointInBounds)).toBe(true);
    });

    it('should return true for points on the edge (inclusive)', () => {
      const pointOnEdge: Point = { x: 0, y: 0 };
      expect(canvasManager.isPointInBounds(pointOnEdge)).toBe(true);
    });

    it('should return false for points outside bounds (negative coordinates)', () => {
      const pointOutside: Point = { x: -1, y: 150 };
      expect(canvasManager.isPointInBounds(pointOutside)).toBe(false);
    });

    it('should return false for points outside bounds (exceeding width)', () => {
      const pointOutside: Point = { x: 400, y: 150 };
      expect(canvasManager.isPointInBounds(pointOutside)).toBe(false);
    });

    it('should return false for points outside bounds (exceeding height)', () => {
      const pointOutside: Point = { x: 200, y: 300 };
      expect(canvasManager.isPointInBounds(pointOutside)).toBe(false);
    });

    it('should handle edge case at maximum bounds', () => {
      const pointAtMax: Point = { x: 399, y: 299 };
      expect(canvasManager.isPointInBounds(pointAtMax)).toBe(true);
    });
  });

  describe('screenToCanvas method', () => {
    beforeEach(() => {
      canvasManager = new CanvasManager('test-canvas', 400, 300);
    });

    it('should convert screen coordinates to canvas coordinates without scaling', () => {
      // Mock getBoundingClientRect to return same size as canvas
      mockCanvas.getBoundingClientRect = vi.fn(() => ({
        left: 10,
        top: 20,
        width: 400,
        height: 300,
      }));

      const canvasPoint = canvasManager.screenToCanvas(210, 170);

      expect(canvasPoint).toEqual({ x: 200, y: 150 });
    });

    it('should handle scaling when canvas is displayed at different size', () => {
      // Mock getBoundingClientRect to return half the canvas size (2x scale)
      mockCanvas.getBoundingClientRect = vi.fn(() => ({
        left: 10,
        top: 20,
        width: 200, // Half the canvas width
        height: 150, // Half the canvas height
      }));

      const canvasPoint = canvasManager.screenToCanvas(110, 95);

      // Should scale up by factor of 2
      expect(canvasPoint).toEqual({ x: 200, y: 150 });
    });

    it('should handle different scaling factors for x and y', () => {
      // Mock uneven scaling
      mockCanvas.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        width: 200, // 2x scale for width
        height: 100, // 3x scale for height
      }));

      const canvasPoint = canvasManager.screenToCanvas(100, 50);

      expect(canvasPoint).toEqual({ x: 200, y: 150 });
    });

    it('should account for canvas offset position', () => {
      // Mock canvas positioned away from origin
      mockCanvas.getBoundingClientRect = vi.fn(() => ({
        left: 50,
        top: 100,
        width: 400,
        height: 300,
      }));

      const canvasPoint = canvasManager.screenToCanvas(250, 250);

      expect(canvasPoint).toEqual({ x: 200, y: 150 });
    });

    it('should handle fractional coordinates', () => {
      mockCanvas.getBoundingClientRect = vi.fn(() => ({
        left: 10.5,
        top: 20.5,
        width: 400,
        height: 300,
      }));

      const canvasPoint = canvasManager.screenToCanvas(210.5, 170.5);

      expect(canvasPoint).toEqual({ x: 200, y: 150 });
    });
  });

  describe('integration tests', () => {
    beforeEach(() => {
      canvasManager = new CanvasManager('test-canvas', 800, 600);
    });

    it('should maintain consistent dimensions throughout operations', () => {
      expect(canvasManager.getWidth()).toBe(800);
      expect(canvasManager.getHeight()).toBe(600);

      canvasManager.clear();

      expect(canvasManager.getWidth()).toBe(800);
      expect(canvasManager.getHeight()).toBe(600);
    });

    it('should work correctly with coordinate conversion and bounds checking', () => {
      // Set up a known canvas position and size
      mockCanvas.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        width: 800,
        height: 600,
      }));

      // Convert screen coordinates to canvas coordinates
      const canvasPoint = canvasManager.screenToCanvas(400, 300);

      // Check if the converted point is in bounds
      const isInBounds = canvasManager.isPointInBounds(canvasPoint);

      expect(canvasPoint).toEqual({ x: 400, y: 300 });
      expect(isInBounds).toBe(true);
    });

    it('should handle edge case where converted point is at canvas boundary', () => {
      mockCanvas.getBoundingClientRect = vi.fn(() => ({
        left: 0,
        top: 0,
        width: 800,
        height: 600,
      }));

      // Convert coordinates that should result in max valid coordinates
      const canvasPoint = canvasManager.screenToCanvas(799, 599);
      const isInBounds = canvasManager.isPointInBounds(canvasPoint);

      expect(canvasPoint).toEqual({ x: 799, y: 599 });
      expect(isInBounds).toBe(true);
    });
  });
});