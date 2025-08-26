import { describe, it, expect } from 'vitest';
import { Food } from '../../src/entities/Food';

describe('Food', () => {
  it('initializes correctly with position coordinates', () => {
    const food = new Food(15, 10);

    // Test position storage
    expect(food.getPosition()).toEqual({ x: 15, y: 10 });
  });

  it('getPosition returns correct coordinates', () => {
    const food = new Food(5, 8);

    // Test position retrieval
    const position = food.getPosition();
    expect(position.x).toBe(5);
    expect(position.y).toBe(8);
  });

  it('setPosition updates position correctly', () => {
    const food = new Food(10, 10);

    // Update position
    food.setPosition(20, 25);

    // Verify new position
    expect(food.getPosition()).toEqual({ x: 20, y: 25 });
  });
});
