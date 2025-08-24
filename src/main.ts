// Import global styles and core game modules
import './styles/style.css';
import { CanvasManager } from './rendering/canvas.ts';
import { Renderer } from './rendering/renderer.ts';
import { GameLoop } from './core/gameLoop.ts';

/**
 * Main Game class that orchestrates the Snake Ghost game
 * Manages canvas setup, rendering, and game loop coordination
 */
class Game {
  // Core game systems - using definite assignment assertion since they're initialized in constructor
  private canvasManager!: CanvasManager;
  private renderer!: Renderer;
  private gameLoop!: GameLoop;

  /**
   * Initialize the game with all required systems
   * Sets up canvas, renderer, and game loop with error handling
   */
  constructor() {
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
   * @param _deltaTime Time elapsed since last update in milliseconds
   */
  private update(_deltaTime: number): void {
    // Game update logic will go here
  }

  /**
   * Render the current game state to the canvas
   * Currently displays test graphics to verify rendering pipeline
   * @param renderer The renderer instance for drawing operations
   */
  private render(renderer: Renderer): void {
    // Clear canvas with dark background
    renderer.clear('#242424');

    // Draw test rectangle (blue-ish)
    renderer.setFillColor('#646cff');
    renderer.fillRect(50, 50, 100, 50);

    // Draw test outlined rectangle (white border)
    renderer.setStrokeColor('#ffffff');
    renderer.setLineWidth(2);
    renderer.strokeRect(200, 100, 80, 80);

    // Draw test circle (red-ish)
    renderer.setFillColor('#ff6464');
    renderer.fillCircle(320, 150, 30);

    // Display status text
    renderer.setFillColor('#ffffff');
    renderer.drawText('Snake Ghost - Canvas Ready!', 10, 30, '16px monospace');
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
}

// Initialize and start the game immediately when the module loads
new Game();
