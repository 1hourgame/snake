// // Phaser Snake game
import Phaser from "phaser";

class MyGame extends Phaser.Scene {
  constructor() {
    super();
    // Array of each snake objects
    this.snake = [];
    // Snake speed, x and y components
    this.snakeSpeed = 3;
    this.speed = new Phaser.Math.Vector2(this.snakeSpeed, 0);
  }

  preload() {
    //
  }

  create() {
    // Add a head to the snake, which is a white circle, 16px in diameter
    this.snake.push(this.add.circle(100, 100, 8, 0xffffff));
    this.physics.add.group(this.snake[0], Phaser.Physics.ARCADE);


    // Add an apple, which is a red circle, 16px in diameter, located at a random position
    this.apple = this.add.circle(
      Phaser.Math.Between(0, 800),
      Phaser.Math.Between(0, 600),
      8,
      0xff0000
    );
    this.physics.add.group(this.apple, Phaser.Physics.ARCADE);

    this.input.on("pointerdown", (pointer) => {
      var touchX = pointer.x;
      var touchY = pointer.y;
      console.log("X: " + touchX + " Y: " + touchY);
      if (this.speed.x) {
        // moving horizontally
        if (touchY < this.snake[0].y) {
          this.speed.x = 0;
          this.speed.y = -this.snakeSpeed;
        } else {
          this.speed.x = 0;
          this.speed.y = this.snakeSpeed;
        }
      } else {
        // moving vertically
        if (touchX < this.snake[0].x) {
          this.speed.x = -this.snakeSpeed;
          this.speed.y = 0;
        } else {
          this.speed.x = this.snakeSpeed;
          this.speed.y = 0;
        }
      }
    });

    console.log("game", game);

    // Add overlap check between the snake and the apple
    this.physics.add.overlap(
      this.snake[0],
      this.apple,
      this.eatApple,
      null,
      this
    );
  }

  update() {
    // Remember position of the last segment
    this.lastX = this.snake[0].x;
    this.lastY = this.snake[0].y;

    // Move the rest of the snake to the position of the previous segment
    for (var i = 1; i < this.snake.length; i++) {
      this.snake[i].x = this.snake[i - 1].x;
      this.snake[i].y = this.snake[i - 1].y;
    }

    // Move the head of the snake according to the speed
    this.snake[0].x += this.speed.x;
    this.snake[0].y += this.speed.y;

    // If snake goes out of bounds, wrap around
    if (this.snake[0].x > 800) {
      this.snake[0].x = 0;
    }
    if (this.snake[0].x < 0) {
      this.snake[0].x = 800;
    }
    if (this.snake[0].y > 600) {
      this.snake[0].y = 0;
    }
    if (this.snake[0].y < 0) {
      this.snake[0].y = 600;
    }
  }

  // Add a new segment to the snake
  addSegment() {
    // Create a new segment at the position of the last segment
    this.snake.push(this.add.circle(this.lastX, this.lastY, 6, 0xffffff));
  }

  // Eat apple
  eatApple() {
    // Add a new segment to the snake
    this.addSegment();
    // Move this.apple to a random position
    this.apple.x = Phaser.Math.Between(0, 800);
    this.apple.y = Phaser.Math.Between(0, 600);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: MyGame,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
