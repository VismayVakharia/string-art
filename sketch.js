const canvas_weight = 800;
const canvas_height = 800;

const num_balls = 60;
const radius = 350;
const ball_size = 15;
const balls = [];
const common_freq = 2;

const string_gap = 4;

const time_factor = 2000;
let time;

class Ball {
  constructor(angle, freq, phase, color) {
    this.angle = angle;
    this.freq = freq;
    this.phase = phase;
    this.color = color;
    this.size = ball_size;
  }

  get_position(t) {
    let value = sin(this.phase + this.freq * t);
    let x = radius * cos(this.angle) * value;
    let y = radius * sin(this.angle) * value;
    return { x, y };
  }

  draw(t) {
    const pos = this.get_position(t);
    fill(this.color);
    noStroke();
    circle(pos.x, pos.y, this.size);
  }
}

function draw_guidelines() {
  stroke("black");
  strokeWeight(1);
  for (let i = 0; i < num_balls; i++) {
    let angle = (i * 2 * PI) / num_balls;
    let color = "gray";
    let x1 = radius * cos(angle);
    let y1 = radius * sin(angle);

    line(x1, y1, -x1, -y1);
  }

  noFill();
  stroke("gray");
  strokeWeight(4);
  circle(0, 0, 2 * radius);
}

function setup() {
  createCanvas(canvas_weight, canvas_height);
  time = 0;

  // populate balls
  let start_color = color(218, 165, 32);
  let end_color = color(72, 61, 139);

  for (let i = 0; i < num_balls; i++) {
    let angle = (i * 2 * PI) / num_balls;
    let freq = common_freq + (i - num_balls / 2) / (1 * num_balls);
    // let freq = common_freq;
    let phase = ((i - num_balls / 2) * 2 * PI) / (1.5 * num_balls);
    let color = lerpColor(start_color, end_color, i / num_balls);
    balls.push(new Ball(angle, freq, phase, color));
  }

  // highlight "middle" ball
  balls[floor(num_balls / 2)].color = "red";
}

function draw() {
  // background(50);
  background("rgba(50, 50, 50, 1)");
  time += deltaTime / time_factor;

  translate(canvas_weight / 2, canvas_height / 2);

  draw_guidelines();

  for (let ball of balls) {
    ball.draw(time);
  }
}
