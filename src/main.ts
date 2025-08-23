import './style.css';
import { CanvasManager } from './canvas.ts';
import { Renderer } from './renderer.ts';
import { GameLoop } from './gameLoop.ts';

class Game {
  private canvasManager!: CanvasManager;
  private renderer!: Renderer;
  private gameLoop!: GameLoop;

  constructor() {
    try {
      this.canvasManager = new CanvasManager('gameCanvas', 400, 300);
      this.renderer = new Renderer(this.canvasManager);
      this.gameLoop = new GameLoop(this.renderer);

      this.setupGameLoop();
      this.start();
    } catch (error) {
      console.error('Failed to initialize game:', error);
    }
  }

  private setupGameLoop(): void {
    this.gameLoop.setUpdateCallback((deltaTime: number) => {
      this.update(deltaTime);
    });

    this.gameLoop.setRenderCallback((renderer: Renderer) => {
      this.render(renderer);
    });
  }

  private update(_deltaTime: number): void {
    // Game update logic will go here
  }

  private render(renderer: Renderer): void {
    renderer.clear('#242424');

    renderer.setFillColor('#646cff');
    renderer.fillRect(50, 50, 100, 50);

    renderer.setStrokeColor('#ffffff');
    renderer.setLineWidth(2);
    renderer.strokeRect(200, 100, 80, 80);

    renderer.setFillColor('#ff6464');
    renderer.fillCircle(320, 150, 30);

    renderer.setFillColor('#ffffff');
    renderer.drawText('Snake Ghost - Canvas Ready!', 10, 30, '16px monospace');
  }

  start(): void {
    this.gameLoop.start();
  }

  stop(): void {
    this.gameLoop.stop();
  }
}

new Game();
