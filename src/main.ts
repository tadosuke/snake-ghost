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

  // Input handling
  private keyPressHandler: (event: KeyboardEvent) => void;

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
   * Handle keyboard input and update snake direction
   * @param event The keyboard event containing key information
   */
  private handleKeyPress(event: KeyboardEvent): void {
    const direction =
      Game.KEY_MAPPINGS[event.key as keyof typeof Game.KEY_MAPPINGS];
    if (direction) {
      this.snake.setDirection(direction);
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
    // Convert deltaTime from seconds to milliseconds
    const deltaTimeMs = deltaTime * 1000;
    this.lastMoveTime += deltaTimeMs;

    if (this.lastMoveTime >= Game.SNAKE_MOVE_INTERVAL) {
      this.snake.move();
      this.lastMoveTime = 0;
    }
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

    // Display status text
    renderer.setFillColor('#ffffff');
    renderer.drawText('Snake Ghost - Canvas Ready!', 10, 30, '16px monospace');
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
   * Get the snake instance for testing and game logic access
   * @returns The current snake instance
   */
  getSnake(): Snake {
    return this.snake;
  }
}

// Initialize and start the game immediately when the module loads
new Game();
