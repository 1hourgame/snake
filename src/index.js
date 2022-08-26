// // Phaser Snake game
import Phaser from "phaser";

const WIDTH = 480;
const HEIGHT = 640;
const DISTANCE_BETWEEN_SEGMENTS = 16;

const COLORS = [0xffffff, 0x55ff55, 0xff5555, 0xffff55]
const COLOR_APPLE = COLORS[2]
const COLOR_HEAD = COLORS[3]
const COLOR_BODY = COLORS[1]
const COLOR_TEXT = COLORS[0]

class MyGame extends Phaser.Scene {
  constructor() {
    super();
    // Array of each snake objects
    this.snake = [];
    // Snake speed, x and y components
    this.snakeSpeed = 3;

    // Score
    this.score = 0;
    // High score
    this.highScore = 0;
  }

  preload() {
    //
  }

  create() {
    // Add a head to the snake, which is a white circle, 16px in diameter
    this.snake.push(this.add.circle(100, 100, 8, COLOR_HEAD));
    this.physics.add.group(this.snake[0], Phaser.Physics.ARCADE);
    this.snake[0].speed = new Phaser.Math.Vector2(this.snakeSpeed, 0);

    // Add an apple, which is a red circle, 16px in diameter, located at a random position
    this.apple = this.add.circle(
      Phaser.Math.Between(0, WIDTH),
      Phaser.Math.Between(0, HEIGHT),
      8,
      COLOR_APPLE
    );
    this.physics.add.group(this.apple, Phaser.Physics.ARCADE);

    this.input.on("pointerdown", (pointer) => {
      var touchX = pointer.x;
      var touchY = pointer.y;
      console.log("X: " + touchX + " Y: " + touchY);
      const speed = this.snake[0].speed;
      if (speed.x) {
        // moving horizontally
        if (touchY < this.snake[0].y) {
          speed.x = 0;
          speed.y = -this.snakeSpeed;
        } else {
          speed.x = 0;
          speed.y = this.snakeSpeed;
        }
      } else {
        // moving vertically
        if (touchX < this.snake[0].x) {
          speed.x = -this.snakeSpeed;
          speed.y = 0;
        } else {
          speed.x = this.snakeSpeed;
          speed.y = 0;
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

    // Load high score from local storage
    this.highScore = localStorage.getItem("highScore") || 0;

    // Add score text
    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "12px",
      fill: `#${COLOR_TEXT.toString(16)}`,
    }).setScale(3);;
    this.highScoreText = this.add.text(
      16,
      48,
      "High score: " + this.highScore,
      {
        fontSize: "12px",
        fill: `#${COLOR_TEXT.toString(16)}`,
      }
    ).setScale(3);;
  }

  update() {
    // Remember position of the last segment
    const len = this.snake.length;

    // Move the rest of the snake to the position of the previous segment
    for (var i = 1; i < this.snake.length; i++) {
      const segment = this.snake[i];
      segment.x += segment.speed.x;
      segment.y += segment.speed.y;

      const prevSegment = this.snake[i - 1];
      // if distance between the segments is more than DISTANCE_BETWEEN_SEGMENTS,
      // change the speed of the segment to the speed of the previous segment
      if (
        Phaser.Math.Distance.Between(
          segment.x,
          segment.y,
          prevSegment.x,
          prevSegment.y
        ) > DISTANCE_BETWEEN_SEGMENTS
      ) {
        segment.speed.x = prevSegment.speed.x;
        segment.speed.y = prevSegment.speed.y;
        // Align the segments to the previous segment
        segment.x =
          prevSegment.x -
          Math.sign(segment.speed.x) * DISTANCE_BETWEEN_SEGMENTS;
        segment.y =
          prevSegment.y -
          Math.sign(segment.speed.y) * DISTANCE_BETWEEN_SEGMENTS;
      }
    }

    // Move the head of the snake according to the speed
    const speed = this.snake[0].speed;
    this.snake[0].x += speed.x;
    this.snake[0].y += speed.y;

    // If snake goes out of bounds, wrap around
    if (this.snake[0].x > WIDTH) {
      this.snake[0].x = 0;
    }
    if (this.snake[0].x < 0) {
      this.snake[0].x = WIDTH;
    }
    if (this.snake[0].y > HEIGHT) {
      this.snake[0].y = 0;
    }
    if (this.snake[0].y < 0) {
      this.snake[0].y = HEIGHT;
    }
  }

  // Add a new segment to the snake
  addSegment() {
    const lastSegment = this.snake[this.snake.length - 1];
    // last segment speed
    const speed = lastSegment.speed;
    // new segment position
    const x = lastSegment.x - Math.sign(speed.x) * DISTANCE_BETWEEN_SEGMENTS;
    const y = lastSegment.y - Math.sign(speed.y) * DISTANCE_BETWEEN_SEGMENTS;
    // Create a new segment
    const newSegment = this.add.circle(x, y, 6, COLOR_BODY);
    newSegment.speed = new Phaser.Math.Vector2(speed);
    this.snake.push(newSegment);

    // Add physics to the new segment
    this.physics.add.group(newSegment, Phaser.Physics.ARCADE);

    // Add overlap check between the snake and the new segment, if this is not
    // the second segment
    if (this.snake.length > 2) {
      this.physics.add.overlap(
        this.snake[0],
        newSegment,
        this.gameOver,
        null,
        this
      );
    }
  }

  // Eat apple
  eatApple() {
    // Add a new segment to the snake
    this.addSegment();
    // Move this.apple to a random position
    this.apple.x = Phaser.Math.Between(0, WIDTH);
    this.apple.y = Phaser.Math.Between(0, HEIGHT);

    // Add to score
    this.score++;
    this.scoreText.setText("Score: " + this.score);
    // Check if new high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.highScoreText.setText("High score: " + this.highScore);
      localStorage.setItem("highScore", this.highScore);
    }
  }

  // Game over
  gameOver() {
    // Stop the game
    this.physics.pause();
    // Show the game over text
    this.gameOverText = this.add.text(WIDTH / 2, HEIGHT / 2, "Game over", {
      fontSize: "16px",
      fill: `#${COLOR_TEXT.toString(16)}`,
    }).setScale(3);
    this.gameOverText.setOrigin(0.5);
    // Reset the score
    this.score = 0;
    this.scoreText.setText("Score: " + this.score);
    // Reset the high score
    this.highScore = localStorage.getItem("highScore") || 0;
    this.highScoreText.setText("High score: " + this.highScore);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: WIDTH,
  height: HEIGHT,
  scene: MyGame,
  backgroundColor: "#000",
  pixelArt: true,

  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
