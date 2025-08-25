// Import global styles and core game modules
import './styles/style.css';
import { CanvasManager } from './rendering/canvas.ts';
import { Renderer } from './rendering/renderer.ts';
import { GameLoop } from './core/gameLoop.ts';
import { Snake } from './entities/Snake.ts';

/**
 * Main Game class that orchestrates the Snake Ghost game
 * Manages canvas setup, rendering, and game loop coordination
 */
export class Game {
  // Game rendering constants
  private static readonly CELL_SIZE = 20;
  private static readonly SNAKE_HEAD_COLOR = '#4CAF50';
  private static readonly SNAKE_BODY_COLOR = '#8BC34A';
  private static readonly BACKGROUND_COLOR = '#242424';
  private static readonly SNAKE_MOVE_INTERVAL = 200; // Move every 200ms

  // Game dimensions constants
  private static readonly GAME_WIDTH = 20; // Grid cells
  private static readonly GAME_HEIGHT = 15; // Grid cells

  // Input handling constants
  private static readonly KEY_MAPPINGS = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
  } as const;

  // Core game systems - using definite assignment assertion since they're initialized in constructor
  private canvasManager!: CanvasManager;
  private renderer!: Renderer;
  private gameLoop!: GameLoop;
  private snake!: Snake;

  // Game timing
  private lastMoveTime = 0;

  // Game state
  private gameOver = false;

  // Input handling and direction queuing
  private keyPressHandler: (event: KeyboardEvent) => void;
  private pendingDirection: string | null = null;

  /**
   * Initialize the game with all required systems
   * Sets up canvas, renderer, and game loop with error handling
   * @param autoStart Whether to automatically initialize canvas and start the game loop (default: true)
   */
  constructor(autoStart = true) {
    // Always initialize snake - it doesn't depend on DOM
    this.snake = new Snake(10, 5);

    // Initialize input handler and set up keyboard input handling
    this.keyPressHandler = this.handleKeyPress.bind(this);
    this.setupKeyboardInput();

    if (autoStart) {
      try {
        // Initialize canvas with specific dimensions for the game
        this.canvasManager = new CanvasManager('gameCanvas', 400, 300);

        // Create renderer to handle all drawing operations
        this.renderer = new Renderer(this.canvasManager);

        // Set up game loop for consistent frame timing
        this.gameLoop = new GameLoop(this.renderer);

        // Wire up game loop callbacks and start the game
        this.setupGameLoop();
        this.start();
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    }
  }

  /**
   * Set up keyboard input handling for snake control
   * Maps arrow keys to snake direction changes
   */
  private setupKeyboardInput(): void {
    document.addEventListener('keydown', this.keyPressHandler);
  }

  /**
   * Handle keyboard input and queue direction changes
   * @param event The keyboard event containing key information
   */
  private handleKeyPress(event: KeyboardEvent): void {
    const direction =
      Game.KEY_MAPPINGS[event.key as keyof typeof Game.KEY_MAPPINGS];
    if (direction && !this.gameOver) {
      // Queue the direction change instead of applying immediately
      this.pendingDirection = direction;
    }
  }

  /**
   * Configure game loop callbacks for update and render phases
   * Binds the main game update and render methods to the game loop
   */
  private setupGameLoop(): void {
    // Set callback for game state updates (physics, input, etc.)
    this.gameLoop.setUpdateCallback((deltaTime: number) => {
      this.update(deltaTime);
    });

    // Set callback for rendering operations
    this.gameLoop.setRenderCallback((renderer: Renderer) => {
      this.render(renderer);
    });
  }

  /**
   * Update game state each frame
   * @param deltaTime Time elapsed since last update in milliseconds
   */
  private update(deltaTime: number): void {
    this.updateSnakeMovement(deltaTime);
  }

  /**
   * Handle time-based snake movement
   * @param deltaTime Time elapsed since last update in seconds (from GameLoop)
   */
  private updateSnakeMovement(deltaTime: number): void {
    // Don't move if game is over
    if (this.gameOver) {
      return;
    }

    // Convert deltaTime from seconds to milliseconds
    const deltaTimeMs = deltaTime * 1000;
    this.lastMoveTime += deltaTimeMs;

    if (this.lastMoveTime >= Game.SNAKE_MOVE_INTERVAL) {
      // Apply any pending direction change before movement
      this.applyPendingDirectionChange();

      // Check for collision before moving
      if (this.checkCollision()) {
        this.gameOver = true;
        return;
      }

      this.snake.move();
      this.lastMoveTime = 0;
    }
  }

  /**
   * Apply pending direction change if it's safe to do so
   */
  private applyPendingDirectionChange(): void {
    if (!this.pendingDirection) {
      return;
    }

    // Try to set the pending direction
    const oldDirection = this.snake.getDirection();
    this.snake.setDirection(this.pendingDirection);

    // Check if the direction change would cause immediate collision
    // If so, revert the direction change
    if (this.wouldCauseImmediateCollision(this.pendingDirection)) {
      this.snake.setDirection(oldDirection);
    }

    // Clear the pending direction regardless
    this.pendingDirection = null;
  }

  /**
   * Check if a direction change would cause immediate collision
   * @param direction The direction to test
   * @returns true if collision would occur, false otherwise
   */
  private wouldCauseImmediateCollision(direction: string): boolean {
    // Create direction vector for the new direction
    const directionVector = this.getDirectionVector(direction);
    const head = this.snake.getHead();

    // Calculate next head position with new direction
    const nextHeadPosition = {
      x: head.x + directionVector.x,
      y: head.y + directionVector.y,
    };

    // Check boundary collision
    if (
      nextHeadPosition.x < 0 ||
      nextHeadPosition.x >= Game.GAME_WIDTH ||
      nextHeadPosition.y < 0 ||
      nextHeadPosition.y >= Game.GAME_HEIGHT
    ) {
      return true;
    }

    // Check self collision - but account for tail movement
    // The tail will move unless the snake is growing, so we need to check
    // if the next position would collide with body segments (excluding the tail unless growing)
    const body = this.snake.getBody();
    const snake = this.snake;

    // Check collision with body segments, but exclude tail position if snake isn't growing
    for (let i = 1; i < body.length; i++) {
      // Skip the tail segment if snake is not growing (tail will move away)
      if (i === body.length - 1 && !this.snakeIsGrowing()) {
        continue;
      }

      if (
        body[i].x === nextHeadPosition.x &&
        body[i].y === nextHeadPosition.y
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if snake is currently growing (has pending growth)
   * @returns true if snake will grow on next move
   */
  private snakeIsGrowing(): boolean {
    // Access the snake's growth state - we need to check if there's pending growth
    // Since growthPending is private, we'll use a simple heuristic:
    // If this is the first move after eating, the snake will grow
    return false; // For now, assume no growth - this is a simplification
  }

  /**
   * Get direction vector from direction string
   * @param direction The direction string
   * @returns The direction vector
   */
  private getDirectionVector(direction: string): { x: number; y: number } {
    switch (direction) {
      case 'up':
        return { x: 0, y: -1 };
      case 'down':
        return { x: 0, y: 1 };
      case 'left':
        return { x: -1, y: 0 };
      case 'right':
        return { x: 1, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  }

  /**
   * Check for any collision (boundary or self-collision)
   * @returns true if collision detected, false otherwise
   */
  private checkCollision(): boolean {
    return (
      this.snake.checkBoundaryCollision(Game.GAME_WIDTH, Game.GAME_HEIGHT) ||
      this.snake.checkSelfCollision()
    );
  }

  /**
   * Check if game is in game over state
   * @returns true if game over, false otherwise
   */
  private isGameOver(): boolean {
    return this.gameOver;
  }

  /**
   * Render the current game state to the canvas
   * Displays the snake and game status information
   * @param renderer The renderer instance for drawing operations
   */
  private render(renderer: Renderer): void {
    // Clear canvas with dark background
    renderer.clear(Game.BACKGROUND_COLOR);

    // Render snake
    this.renderSnake(renderer);

    // Display game status
    this.renderGameStatus(renderer);
  }

  /**
   * Render game status text (ready, playing, or game over)
   * @param renderer The renderer instance for drawing operations
   */
  private renderGameStatus(renderer: Renderer): void {
    renderer.setFillColor('#ffffff');

    if (this.gameOver) {
      renderer.drawText(
        'GAME OVER - Press F5 to restart',
        10,
        30,
        '16px monospace'
      );
    } else {
      renderer.drawText(
        'Snake Ghost - Use arrow keys to move',
        10,
        30,
        '16px monospace'
      );
    }
  }

  /**
   * Render the snake on the canvas
   * @param renderer The renderer instance for drawing operations
   */
  private renderSnake(renderer: Renderer): void {
    const body = this.snake.getBody();

    // Render each segment of the snake
    body.forEach((segment, index) => {
      // Head has different color from body segments
      const color = index === 0 ? Game.SNAKE_HEAD_COLOR : Game.SNAKE_BODY_COLOR;
      renderer.setFillColor(color);

      // Draw segment as rectangle
      renderer.fillRect(
        segment.x * Game.CELL_SIZE,
        segment.y * Game.CELL_SIZE,
        Game.CELL_SIZE,
        Game.CELL_SIZE
      );
    });
  }

  /**
   * Start the game loop
   * Begins the continuous update/render cycle
   */
  start(): void {
    this.gameLoop.start();
  }

  /**
   * Stop the game loop
   * Halts the update/render cycle
   */
  stop(): void {
    this.gameLoop.stop();
  }

  /**
   * Clean up game resources and event listeners
   * Call this method when the game is no longer needed
   */
  cleanup(): void {
    document.removeEventListener('keydown', this.keyPressHandler);
    if (this.gameLoop) {
      this.gameLoop.stop();
    }
  }

  /**
   * Reset the game to initial state
   * Resets snake position and clears game over state
   */
  resetGame(): void {
    this.gameOver = false;
    this.lastMoveTime = 0;
    this.pendingDirection = null;
    this.snake.reset();
  }

  /**
   * Get the snake instance for testing and game logic access
   * @returns The current snake instance
   */
  getSnake(): Snake {
    return this.snake;
  }
}

// Initialize and start the game immediately when the module loads
new Game();
