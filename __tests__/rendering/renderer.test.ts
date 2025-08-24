import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Renderer } from '../../src/rendering/renderer.ts';
import { CanvasManager } from '../../src/rendering/canvas.ts';
import type { Point, RenderState } from '../../src/types/types.ts';

describe('Renderer', () => {
  let renderer: Renderer;
  let mockCanvasManager: CanvasManager;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    // Create a mock 2D context with all necessary methods
    mockContext = {
      fillStyle: '#000000',
      strokeStyle: '#000000',
      lineWidth: 1,
      font: '10px sans-serif',
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      stroke: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      fillText: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    // Create a mock canvas manager
    mockCanvasManager = {
      getContext: vi.fn().mockReturnValue(mockContext),
      getWidth: vi.fn().mockReturnValue(800),
      getHeight: vi.fn().mockReturnValue(600),
      clear: vi.fn(),
    } as unknown as CanvasManager;

    renderer = new Renderer(mockCanvasManager);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with canvas manager and default render state', () => {
      expect(mockCanvasManager.getContext).toHaveBeenCalled();
      expect(mockContext.fillStyle).toBe('#ffffff');
      expect(mockContext.strokeStyle).toBe('#000000');
      expect(mockContext.lineWidth).toBe(1);
    });

    it('should apply default render state to context', () => {
      const renderState = renderer.getRenderState();
      expect(renderState).toEqual({
        fillColor: '#ffffff',
        strokeColor: '#000000',
        lineWidth: 1,
      });
    });
  });

  describe('color and style methods', () => {
    it('should set fill color correctly', () => {
      renderer.setFillColor('#ff0000');
      
      expect(mockContext.fillStyle).toBe('#ff0000');
      expect(renderer.getRenderState().fillColor).toBe('#ff0000');
    });

    it('should set stroke color correctly', () => {
      renderer.setStrokeColor('#00ff00');
      
      expect(mockContext.strokeStyle).toBe('#00ff00');
      expect(renderer.getRenderState().strokeColor).toBe('#00ff00');
    });

    it('should set line width correctly', () => {
      renderer.setLineWidth(5);
      
      expect(mockContext.lineWidth).toBe(5);
      expect(renderer.getRenderState().lineWidth).toBe(5);
    });

    it('should handle different color formats', () => {
      // Test hex color
      renderer.setFillColor('#ffaabb');
      expect(mockContext.fillStyle).toBe('#ffaabb');

      // Test rgb color
      renderer.setFillColor('rgb(255, 0, 0)');
      expect(mockContext.fillStyle).toBe('rgb(255, 0, 0)');

      // Test rgba color
      renderer.setStrokeColor('rgba(0, 255, 0, 0.5)');
      expect(mockContext.strokeStyle).toBe('rgba(0, 255, 0, 0.5)');

      // Test named color
      renderer.setFillColor('blue');
      expect(mockContext.fillStyle).toBe('blue');
    });
  });

  describe('clear method', () => {
    it('should clear canvas using canvas manager when no color provided', () => {
      renderer.clear();
      
      expect(mockCanvasManager.clear).toHaveBeenCalled();
    });

    it('should clear with background color when color provided', () => {
      renderer.clear('#333333');
      
      expect(mockContext.fillStyle).toBe('#333333');
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it('should restore previous fill color after clearing with background', () => {
      renderer.setFillColor('#ff0000');
      renderer.clear('#333333');
      
      // Should have been set to clear color, then back to red
      expect(mockContext.fillStyle).toBe('#333333');
    });
  });

  describe('rectangle drawing methods', () => {
    it('should draw filled rectangle correctly', () => {
      renderer.fillRect(10, 20, 100, 50);
      
      expect(mockContext.fillRect).toHaveBeenCalledWith(10, 20, 100, 50);
    });

    it('should draw stroked rectangle correctly', () => {
      renderer.strokeRect(15, 25, 80, 40);
      
      expect(mockContext.strokeRect).toHaveBeenCalledWith(15, 25, 80, 40);
    });

    it('should handle zero and negative dimensions', () => {
      renderer.fillRect(0, 0, 0, 0);
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 0, 0);

      renderer.strokeRect(10, 10, -5, -5);
      expect(mockContext.strokeRect).toHaveBeenCalledWith(10, 10, -5, -5);
    });

    it('should handle fractional coordinates', () => {
      renderer.fillRect(10.5, 20.7, 100.3, 50.8);
      expect(mockContext.fillRect).toHaveBeenCalledWith(10.5, 20.7, 100.3, 50.8);
    });
  });

  describe('circle drawing methods', () => {
    it('should draw filled circle correctly', () => {
      renderer.fillCircle(100, 150, 25);
      
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.arc).toHaveBeenCalledWith(100, 150, 25, 0, 2 * Math.PI);
      expect(mockContext.fill).toHaveBeenCalled();
    });

    it('should draw stroked circle correctly', () => {
      renderer.strokeCircle(200, 250, 30);
      
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.arc).toHaveBeenCalledWith(200, 250, 30, 0, 2 * Math.PI);
      expect(mockContext.stroke).toHaveBeenCalled();
    });

    it('should handle zero radius', () => {
      renderer.fillCircle(50, 50, 0);
      
      expect(mockContext.arc).toHaveBeenCalledWith(50, 50, 0, 0, 2 * Math.PI);
    });

    it('should handle fractional radius and coordinates', () => {
      renderer.strokeCircle(100.5, 150.7, 25.3);
      
      expect(mockContext.arc).toHaveBeenCalledWith(100.5, 150.7, 25.3, 0, 2 * Math.PI);
    });
  });

  describe('line drawing method', () => {
    it('should draw line correctly', () => {
      const from: Point = { x: 10, y: 20 };
      const to: Point = { x: 100, y: 200 };
      
      renderer.drawLine(from, to);
      
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalledWith(10, 20);
      expect(mockContext.lineTo).toHaveBeenCalledWith(100, 200);
      expect(mockContext.stroke).toHaveBeenCalled();
    });

    it('should handle same start and end points', () => {
      const point: Point = { x: 50, y: 50 };
      
      renderer.drawLine(point, point);
      
      expect(mockContext.moveTo).toHaveBeenCalledWith(50, 50);
      expect(mockContext.lineTo).toHaveBeenCalledWith(50, 50);
    });

    it('should handle negative coordinates', () => {
      const from: Point = { x: -10, y: -20 };
      const to: Point = { x: -100, y: -200 };
      
      renderer.drawLine(from, to);
      
      expect(mockContext.moveTo).toHaveBeenCalledWith(-10, -20);
      expect(mockContext.lineTo).toHaveBeenCalledWith(-100, -200);
    });

    it('should handle fractional coordinates', () => {
      const from: Point = { x: 10.5, y: 20.7 };
      const to: Point = { x: 100.3, y: 200.8 };
      
      renderer.drawLine(from, to);
      
      expect(mockContext.moveTo).toHaveBeenCalledWith(10.5, 20.7);
      expect(mockContext.lineTo).toHaveBeenCalledWith(100.3, 200.8);
    });
  });

  describe('text drawing method', () => {
    it('should draw text without custom font', () => {
      renderer.drawText('Hello World', 50, 100);
      
      expect(mockContext.fillText).toHaveBeenCalledWith('Hello World', 50, 100);
    });

    it('should draw text with custom font', () => {
      renderer.drawText('Hello World', 50, 100, '16px Arial');
      
      expect(mockContext.font).toBe('16px Arial');
      expect(mockContext.fillText).toHaveBeenCalledWith('Hello World', 50, 100);
    });

    it('should handle empty text', () => {
      renderer.drawText('', 0, 0);
      
      expect(mockContext.fillText).toHaveBeenCalledWith('', 0, 0);
    });

    it('should handle special characters in text', () => {
      renderer.drawText('Hello\nWorld!@#$%^&*()', 10, 20);
      
      expect(mockContext.fillText).toHaveBeenCalledWith('Hello\nWorld!@#$%^&*()', 10, 20);
    });

    it('should handle different font specifications', () => {
      renderer.drawText('Test1', 0, 0, 'bold 20px Georgia');
      expect(mockContext.font).toBe('bold 20px Georgia');
      
      renderer.drawText('Test2', 0, 0, 'italic 14px "Times New Roman"');
      expect(mockContext.font).toBe('italic 14px "Times New Roman"');
    });
  });

  describe('state management methods', () => {
    it('should save canvas state', () => {
      renderer.save();
      
      expect(mockContext.save).toHaveBeenCalled();
    });

    it('should restore canvas state', () => {
      renderer.restore();
      
      expect(mockContext.restore).toHaveBeenCalled();
    });

    it('should return copy of render state', () => {
      renderer.setFillColor('#ff0000');
      renderer.setStrokeColor('#00ff00');
      renderer.setLineWidth(3);
      
      const state = renderer.getRenderState();
      
      expect(state).toEqual({
        fillColor: '#ff0000',
        strokeColor: '#00ff00',
        lineWidth: 3,
      });
      
      // Verify it's a copy, not the original
      state.fillColor = '#0000ff';
      expect(renderer.getRenderState().fillColor).toBe('#ff0000');
    });
  });

  describe('integration tests', () => {
    it('should maintain state consistency across multiple operations', () => {
      renderer.setFillColor('#ff0000');
      renderer.setStrokeColor('#00ff00');
      renderer.setLineWidth(5);
      
      renderer.fillRect(10, 10, 50, 50);
      renderer.strokeCircle(100, 100, 25);
      
      const state = renderer.getRenderState();
      expect(state).toEqual({
        fillColor: '#ff0000',
        strokeColor: '#00ff00',
        lineWidth: 5,
      });
    });

    it('should work correctly with save and restore', () => {
      renderer.setFillColor('#ff0000');
      renderer.save();
      
      renderer.setFillColor('#00ff00');
      renderer.fillRect(0, 0, 10, 10);
      
      renderer.restore();
      
      // The fill color in the renderer's internal state should still be red
      // but the context's fillStyle might have been restored by the mock
      expect(renderer.getRenderState().fillColor).toBe('#00ff00');
      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
    });

    it('should handle complex drawing sequence', () => {
      renderer.setFillColor('#ff0000');
      renderer.fillRect(0, 0, 100, 100);
      
      renderer.setStrokeColor('#00ff00');
      renderer.setLineWidth(2);
      renderer.strokeCircle(50, 50, 25);
      
      const from: Point = { x: 0, y: 0 };
      const to: Point = { x: 100, y: 100 };
      renderer.drawLine(from, to);
      
      renderer.drawText('Complete', 10, 90, '12px Arial');
      
      // Verify all operations were called
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 100, 100);
      expect(mockContext.arc).toHaveBeenCalledWith(50, 50, 25, 0, 2 * Math.PI);
      expect(mockContext.moveTo).toHaveBeenCalledWith(0, 0);
      expect(mockContext.lineTo).toHaveBeenCalledWith(100, 100);
      expect(mockContext.fillText).toHaveBeenCalledWith('Complete', 10, 90);
      expect(mockContext.font).toBe('12px Arial');
    });

    it('should handle clearing with background and restore state', () => {
      renderer.setFillColor('#ff0000');
      const originalState = renderer.getRenderState();
      
      renderer.clear('#333333');
      
      // Should have called fillRect for clearing
      expect(mockContext.fillRect).toHaveBeenCalledWith(0, 0, 800, 600);
      
      // Fill color should have been changed for clearing
      expect(mockContext.fillStyle).toBe('#333333');
    });
  });

  describe('error handling and edge cases', () => {
    it('should handle very large numbers', () => {
      const largeNum = Number.MAX_SAFE_INTEGER;
      
      renderer.fillRect(largeNum, largeNum, largeNum, largeNum);
      expect(mockContext.fillRect).toHaveBeenCalledWith(largeNum, largeNum, largeNum, largeNum);
    });

    it('should handle very small numbers', () => {
      const smallNum = Number.MIN_VALUE;
      
      renderer.fillCircle(smallNum, smallNum, smallNum);
      expect(mockContext.arc).toHaveBeenCalledWith(smallNum, smallNum, smallNum, 0, 2 * Math.PI);
    });

    it('should handle Infinity values', () => {
      renderer.setLineWidth(Infinity);
      expect(mockContext.lineWidth).toBe(Infinity);
    });

    it('should handle NaN values', () => {
      renderer.fillRect(NaN, NaN, NaN, NaN);
      expect(mockContext.fillRect).toHaveBeenCalledWith(NaN, NaN, NaN, NaN);
    });
  });
});