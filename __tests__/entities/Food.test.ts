import { describe, it, expect } from 'vitest';
import { Food } from '../../src/entities/Food';

describe('Food', () => {
  it('initializes correctly with position coordinates', () => {
    const food = new Food(15, 10);

    // Test position storage
    expect(food.getPosition()).toEqual({ x: 15, y: 10 });
  });
});
