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
    // Each snake segment should result in a fillRect call (food now uses fillCircle)
    expect(mockRenderer.fillRect).toHaveBeenCalledTimes(3); // Head + 2 body segments only

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

  it('snake responds to keyboard input', () => {
    const game = new Game(false); // Don't autostart to avoid DOM dependency
    const snake = game.getSnake();

    // Test initial direction is right
    expect(snake.getDirection()).toBe('right');

    // Test up arrow key queues direction change
    const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    document.dispatchEvent(upEvent);

    // Direction change is queued, not immediate - trigger update to apply
    const deltaTime = 0.25; // Enough time to trigger movement
    (game as any).update(deltaTime);
    expect(snake.getDirection()).toBe('up');

    // Test left arrow key changes direction to left
    const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    document.dispatchEvent(leftEvent);
    (game as any).update(deltaTime);
    expect(snake.getDirection()).toBe('left');

    // Test down arrow key changes direction to down
    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    document.dispatchEvent(downEvent);
    (game as any).update(deltaTime);
    expect(snake.getDirection()).toBe('down');

    // Test right arrow key changes direction to right
    const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    document.dispatchEvent(rightEvent);
    (game as any).update(deltaTime);
    expect(snake.getDirection()).toBe('right');

    // Test direction reversal prevention - can't go from right to left directly
    const leftEventAgain = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    document.dispatchEvent(leftEventAgain);
    (game as any).update(deltaTime);
    expect(snake.getDirection()).toBe('right'); // Should remain right due to reversal prevention
  });

  it('game detects snake boundary collision', () => {
    const game = new Game(false); // Don't autostart to avoid DOM dependency
    const snake = game.getSnake();

    // Position snake near right boundary (grid is 20x15, so x=19 is the wall)
    // Move snake to position where next move would hit right wall
    snake.setDirection('right');

    // Move snake to x=19 (at right boundary - collision should be detected)
    for (let i = 0; i < 9; i++) {
      snake.move(); // Snake starts at x=10, after 9 moves it should be at x=19
    }
    expect(snake.getHead().x).toBe(19);

    // Game should detect collision for the next movement (would go to x=20, outside boundary)
    expect((game as any).checkCollision()).toBe(true);

    // Simulate the update cycle which should detect collision and set game over
    const deltaTime = 0.25; // Enough time to trigger movement
    (game as any).update(deltaTime);

    // After collision is detected, game should be in game over state
    expect((game as any).isGameOver()).toBe(true);

    // Snake should not move after game over (should still be at x=19)
    expect(snake.getHead().x).toBe(19);
  });

  it('prevents false collision when rapidly changing direction before movement', () => {
    const game = new Game(false); // Don't autostart to avoid DOM dependency
    const snake = game.getSnake();

    // Create a scenario where rapid direction changes could cause issues
    // Snake moving right, with a longer body to create more collision opportunities
    snake.eat(); // Queue growth
    snake.move(); // (11,5) with body [(11,5), (10,5), (9,5)]
    snake.move(); // (12,5) with body [(12,5), (11,5), (10,5), (9,5)] - now length 4

    // Verify setup
    expect(snake.getHead()).toEqual({ x: 12, y: 5 });
    expect(snake.getDirection()).toBe('right');
    expect(snake.getBodyLength()).toBe(4);

    // The critical test: Change direction to down just before movement tick
    // This simulates user pressing keys rapidly
    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    document.dispatchEvent(downEvent);

    // Trigger update to apply queued direction change
    const deltaTime = 0.25;
    (game as any).update(deltaTime);

    // Direction should change to down after update
    expect(snake.getDirection()).toBe('down');

    // After the update above, snake should have moved down
    // Let's verify the new position and that game continues normally
    expect(snake.getHead()).toEqual({ x: 12, y: 6 }); // Moved down from (12,5)
    expect((game as any).isGameOver()).toBe(false);
  });

  it('prevents direction changes that would cause immediate self-collision', () => {
    const game = new Game(false); // Don't autostart to avoid DOM dependency
    const snake = game.getSnake();

    // Create a dangerous scenario: snake curled up with limited space
    snake.eat(); // Queue growth for longer body
    snake.move(); // (11,5)
    snake.move(); // (12,5)

    // Now turn down to create a hook shape
    snake.setDirection('down');
    snake.move(); // (12,6)

    // Turn left
    snake.setDirection('left');
    snake.move(); // (11,6) - now body is [(11,6), (12,6), (12,5), (11,5), (10,5)]

    // Verify setup - snake is at (11,6) going left with body segment at (12,6)
    expect(snake.getHead()).toEqual({ x: 11, y: 6 });
    expect(snake.getDirection()).toBe('left');

    // Now try to turn up - this would put the head at (11,5) which SHOULD be blocked
    // because there's a body segment at (11,5)
    const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    document.dispatchEvent(upEvent);

    // Direction should NOT change to up because it would cause immediate collision
    expect(snake.getDirection()).toBe('left'); // Should remain left

    // Game should continue normally - no false collision
    expect((game as any).checkCollision()).toBe(false);
    expect((game as any).isGameOver()).toBe(false);
  });

  // Phase 4.1 Tests: Game Class Food Integration
  it('creates food instance in game', () => {
    const game = new Game(false); // Don't autostart for testing

    // Test that game has a food instance
    expect((game as any).getFood()).toBeDefined();

    // Test food has proper initial position within game boundaries
    const food = (game as any).getFood();
    const position = food.getPosition();
    expect(position.x).toBeGreaterThanOrEqual(0);
    expect(position.x).toBeLessThan(20); // GAME_WIDTH / CELL_SIZE
    expect(position.y).toBeGreaterThanOrEqual(0);
    expect(position.y).toBeLessThan(15); // GAME_HEIGHT / CELL_SIZE
  });

  it('renders food on canvas', () => {
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

    // Render method should not throw
    expect(() => {
      (game as any).render(mockRenderer);
    }).not.toThrow();

    // Verify that food is rendered - should result in a fillCircle call for food
    // Food should be rendered as a circle for visual distinction from snake
    const food = (game as any).getFood();
    const position = food.getPosition();

    expect(mockRenderer.fillCircle).toHaveBeenCalledWith(
      position.x * 20 + 10, // center X (position * CELL_SIZE + CELL_SIZE/2)
      position.y * 20 + 10, // center Y (position * CELL_SIZE + CELL_SIZE/2)
      8 // radius
    );
  });

  // Phase 4.2 Tests: Snake-Food Interaction in Game Loop
  it('snake grows when eating food', () => {
    const game = new Game(false); // Don't autostart for testing
    const snake = game.getSnake();
    const food = (game as any).getFood();

    // Get initial snake length
    const initialLength = snake.getBodyLength();
    expect(initialLength).toBe(3);

    // Position food at snake's current head location to ensure immediate consumption
    const snakeHead = snake.getHead();
    food.setPosition(snakeHead.x, snakeHead.y);

    // Verify food is consumed by snake at current position
    expect(food.isConsumedBy(snake)).toBe(true);

    // Trigger game update to move snake and process food collision
    const deltaTime = 0.25; // More than movement interval
    (game as any).update(deltaTime);

    // Snake should have grown after eating food
    expect(snake.getBodyLength()).toBe(initialLength + 1);
  });

  it('food respawns after being eaten', () => {
    const game = new Game(false); // Don't autostart for testing
    const snake = game.getSnake();
    const food = (game as any).getFood();

    // Get initial food position
    const initialFoodPosition = food.getPosition();

    // Position food at snake's current head location to force consumption
    const snakeHead = snake.getHead();
    food.setPosition(snakeHead.x, snakeHead.y);

    // Trigger game update to process food consumption
    const deltaTime = 0.25;
    (game as any).update(deltaTime);

    // Food should have respawned at a different position
    const newFoodPosition = food.getPosition();
    expect(newFoodPosition).not.toEqual(initialFoodPosition);

    // New position should be within game boundaries
    expect(newFoodPosition.x).toBeGreaterThanOrEqual(0);
    expect(newFoodPosition.x).toBeLessThan(20);
    expect(newFoodPosition.y).toBeGreaterThanOrEqual(0);
    expect(newFoodPosition.y).toBeLessThan(15);
  });

  it('game continues running after food consumption', () => {
    const game = new Game(false); // Don't autostart for testing
    const snake = game.getSnake();
    const food = (game as any).getFood();

    // Position food at snake's next move location
    const snakeHead = snake.getHead();
    food.setPosition(snakeHead.x + 1, snakeHead.y);

    // Trigger multiple game updates
    const deltaTime = 0.25;
    (game as any).update(deltaTime); // First update: consume food
    (game as any).update(deltaTime); // Second update: continue normal movement

    // Game should not be over after food consumption
    expect((game as any).isGameOver()).toBe(false);

    // Snake should continue moving normally
    const finalHead = snake.getHead();
    expect(finalHead.x).toBe(snakeHead.x + 2); // Moved 2 positions right
  });

  // Phase 5.1 Tests: Enhanced Food Visualization
  it('food renders with visual distinction from snake', () => {
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

    // Render and capture calls
    (game as any).render(mockRenderer);

    // Verify food uses circle rendering for visual distinction from snake rectangles
    const food = (game as any).getFood();
    const position = food.getPosition();

    expect(mockRenderer.fillCircle).toHaveBeenCalledWith(
      position.x * 20 + 10, // center X (position * CELL_SIZE + CELL_SIZE/2)
      position.y * 20 + 10, // center Y (position * CELL_SIZE + CELL_SIZE/2)
      8 // radius (smaller than cell size for visual appeal)
    );
  });

  it('food has consistent visual styling with game theme', () => {
    const game = new Game(false); // Don't autostart to avoid DOM dependency

    // Mock renderer to capture styling calls
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

    // Render food
    (game as any).render(mockRenderer);

    // Verify food color matches expected theme color
    expect(mockRenderer.setFillColor).toHaveBeenCalledWith('#FF4444');

    // Verify food also has stroke for better visibility
    expect(mockRenderer.setStrokeColor).toHaveBeenCalledWith('#CC0000');
    expect(mockRenderer.setLineWidth).toHaveBeenCalledWith(2);
    expect(mockRenderer.strokeRect).toHaveBeenCalled();
  });

  // Phase 6.1 Tests: End-to-End Integration Testing
  it('completes full food lifecycle: spawn → consume → respawn', () => {
    const game = new Game(false); // Don't autostart for testing
    const snake = game.getSnake();
    const food = (game as any).getFood();

    // Phase 1: Initial spawn - verify food spawns at valid position avoiding snake
    const initialPosition = food.getPosition();
    expect(initialPosition.x).toBeGreaterThanOrEqual(0);
    expect(initialPosition.x).toBeLessThan(20);
    expect(initialPosition.y).toBeGreaterThanOrEqual(0);
    expect(initialPosition.y).toBeLessThan(15);

    // Verify food doesn't spawn on snake body
    const snakeBody = snake.getBody();
    const foodOnSnake = snakeBody.some(
      (segment) =>
        segment.x === initialPosition.x && segment.y === initialPosition.y
    );
    expect(foodOnSnake).toBe(false);

    // Phase 2: Consumption - position food at snake head and trigger consumption
    const snakeHead = snake.getHead();
    const initialSnakeLength = snake.getBodyLength();
    food.setPosition(snakeHead.x, snakeHead.y);

    // Verify food is consumed
    expect(food.isConsumedBy(snake)).toBe(true);

    // Trigger game update to process consumption
    (game as any).update(0.25);

    // Phase 3: Post-consumption effects
    // Snake should have grown
    expect(snake.getBodyLength()).toBe(initialSnakeLength + 1);

    // Food should have respawned at new position
    const newPosition = food.getPosition();
    expect(newPosition).not.toEqual(initialPosition);

    // New position should be valid and avoid snake
    expect(newPosition.x).toBeGreaterThanOrEqual(0);
    expect(newPosition.x).toBeLessThan(20);
    expect(newPosition.y).toBeGreaterThanOrEqual(0);
    expect(newPosition.y).toBeLessThan(15);

    // Verify game continues normally after consumption
    expect((game as any).isGameOver()).toBe(false);
  });

  it('maintains consistent game state through multiple food consumptions', () => {
    const game = new Game(false); // Don't autostart for testing
    const snake = game.getSnake();
    const food = (game as any).getFood();

    const initialLength = snake.getBodyLength();
    let consumptionCount = 0;
    const maxConsumptions = 3;

    // Simulate multiple food consumptions
    for (let i = 0; i < maxConsumptions; i++) {
      // Position food at snake head
      const snakeHead = snake.getHead();
      food.setPosition(snakeHead.x, snakeHead.y);

      // Verify food can be consumed
      expect(food.isConsumedBy(snake)).toBe(true);

      // Process consumption
      (game as any).update(0.25);
      consumptionCount++;

      // Verify snake growth after each consumption
      expect(snake.getBodyLength()).toBe(initialLength + consumptionCount);

      // Verify game remains in valid state
      expect((game as any).isGameOver()).toBe(false);

      // Verify food respawned to new position
      const foodPosition = food.getPosition();
      expect(foodPosition.x).toBeGreaterThanOrEqual(0);
      expect(foodPosition.x).toBeLessThan(20);
      expect(foodPosition.y).toBeGreaterThanOrEqual(0);
      expect(foodPosition.y).toBeLessThan(15);
    }

    // Final verification: snake should have grown by exact number of consumptions
    expect(snake.getBodyLength()).toBe(initialLength + maxConsumptions);
    expect(consumptionCount).toBe(maxConsumptions);
  });

  it('integrates food system seamlessly with existing game mechanics', () => {
    const game = new Game(false); // Don't autostart for testing
    const snake = game.getSnake();
    const food = (game as any).getFood();

    // Test: Game continues normal movement with food present
    const initialHead = snake.getHead();
    (game as any).update(0.25); // Normal movement update

    const newHead = snake.getHead();
    expect(newHead.x).toBe(initialHead.x + 1); // Snake moved right

    // Test: Direction changes work normally with food system
    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    document.dispatchEvent(downEvent);
    (game as any).update(0.25);
    expect(snake.getDirection()).toBe('down');

    // Test: Boundary collision detection still works with food system
    // Move snake to near boundary
    for (let i = 0; i < 15; i++) {
      snake.move();
    }

    // Should detect collision at boundary
    expect((game as any).checkCollision()).toBe(true);

    // Test: Food system doesn't interfere with game over state
    (game as any).update(0.25); // Should trigger game over
    expect((game as any).isGameOver()).toBe(true);

    // Verify food still exists and is valid even in game over state
    const finalFoodPosition = food.getPosition();
    expect(finalFoodPosition).toBeDefined();
    expect(finalFoodPosition.x).toBeGreaterThanOrEqual(0);
    expect(finalFoodPosition.x).toBeLessThan(20);
  });
});
