// // Phaser Snake game
import Phaser from "phaser";

class MyGame extends Phaser.Scene {
  constructor() {
    super();
    // Array of each snake objects
    this.snake = [];
    // Snake speed, x and y components
    this.speed = new Phaser.Math.Vector2(1, 0);
  }

  preload() {
    //
  }

  create() {
    // game.physics.enable(sprite, Phaser.Physics.ARCADE);

    // Add a head to the snake, which is a white circle, 16px in diameter
    this.snake.push(this.add.circle(100, 100, 8, 0xffffff));

    // Add an apple, which is a red circle, 16px in diameter, located at a random position
    this.apple = this.add.circle(
      Phaser.Math.Between(0, 800),
      Phaser.Math.Between(0, 600),
      8,
      0xff0000
    );

    this.input.on("pointerdown", (pointer) => {
      var touchX = pointer.x;
      var touchY = pointer.y;
      console.log("X: " + touchX + " Y: " + touchY);
      if (this.speed.x) {
        // moving horizontally
        if (touchY < this.snake[0].y) {
          this.speed.x = 0;
          this.speed.y = -1;
        } else {
          this.speed.x = 0;
          this.speed.y = 1;
        }
      } else {
        // moving vertically
        if (touchX < this.snake[0].x) {
          this.speed.x = -1;
          this.speed.y = 0;
        } else {
          this.speed.x = 1;
          this.speed.y = 0;
        }
      }
    });

    console.log("game", game);

    // Add overlap check between the snake and the apple
    game.physics.add.overlap(
      this.snake[0],
      this.apple,
      this.eatApple,
      null,
      game
    );

    // const collectStar = (player, star) => {
    //   star.disableBody(true, true);
    // };
    // game.physics.add.overlap(this.snake[0], stars, collectStar, null, game);
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

    // Check if the snake has eaten an apple
    if (this.snake[0].x === this.apple.x && this.snake[0].y === this.apple.y) {
      // Add a new segment to the snake
      this.snake.push(this.add.circle(lastX, lastY, 8, 0xffffff));
      // Move this.apple to a random position
      this.apple.x = Phaser.Math.Between(0, 800);
      this.apple.y = Phaser.Math.Between(0, 600);
    }

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

// const config = {
//   type: Phaser.AUTO,
//   parent: "phaser-example",
//   width: 800,
//   height: 600,
//   scene: MyGame,
//   // game phisics
//   physics: {
//     default: "arcade",
//     arcade: {
//       gravity: { y: 0 },
//       debug: false,
//     },
//   },
// };
const create = () => {
    console.log("game.physics", game.physics);

}

// const game = new Phaser.Game(config);
var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

console.log("game.physics", game.physics);
