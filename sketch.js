const canvas_width = 800;
const canvas_height = 800;
const EPSILON = 1e-6;

const num_balls = 200;
const radius = 350;
const ball_size = 15;
const balls = [];
const common_freq = 2;

const string_gap = 20;
let periodic = false;

const time_factor = 2000;
let time;
let paused = false;

class Ball {
  constructor(angle, freq, phase, color) {
    this.angle = angle;
    this.freq = freq;
    this.phase = phase;
    this.color = color;

    this.size = ball_size;
    this.x = this.y = 0;
  }

  update(t) {
    let value = sin(this.phase + this.freq * t);
    this.x = radius * cos(this.angle) * value;
    this.y = radius * sin(this.angle) * value;
  }

  draw() {
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.size);
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

function draw_strings() {
  // TODO: try with beginShape / endShape
  // TODO: color each loop of string differently
  stroke("green");
  strokeWeight(2);
  for (let i = 0; i < num_balls; i++) {
    const cur = balls[i];
    if (!periodic && i + string_gap >= num_balls) continue;
    const next = balls[(i + string_gap) % num_balls];
    line(cur.x, cur.y, next.x, next.y);
  }
}

function draw_balls() {
  for (let ball of balls) {
    ball.draw();
  }
}

function freq_fn(i, n) {
  // return common_freq + (i - n / 2) / (1 * n);
  return common_freq;
}

function phase_fn(i, n) {
  // return ((i - num_balls / 2) * 2 * PI) / (2 * num_balls);
  return sin(PI * cos((3 * PI * i) / n));
  // return cos((2 * PI * i) / n);
}

function isclose(a, b) {
  return abs(a - b) < EPSILON;
}

function setup() {
  createCanvas(canvas_width, canvas_height);
  time = 0;

  // populate balls
  let start_color = color(218, 165, 32);
  let end_color = color(72, 61, 139);

  for (let i = 0; i < num_balls; i++) {
    let angle = (i * 2 * PI) / num_balls;
    let freq = freq_fn(i, num_balls);
    let phase = phase_fn(i, num_balls);
    let color = lerpColor(start_color, end_color, abs((2 * i) / num_balls - 1));
    balls.push(new Ball(angle, freq, phase, color));
  }

  // check periodicity
  const first = balls[0];
  const last_freq = freq_fn(num_balls, num_balls);
  const last_phase = phase_fn(num_balls, num_balls);
  if (isclose(first.freq, last_freq) && isclose(first.phase, last_phase)) {
    periodic = true;
  }
}

function mousePressed() {
  paused = !paused;
}

function draw() {
  // background(50);
  background("rgba(50, 50, 50, 1)");
  if (!paused) {
    time += deltaTime / time_factor;
  }

  for (let ball of balls) {
    ball.update(time);
  }

  translate(canvas_width / 2, canvas_height / 2);
  draw_guidelines();
  draw_strings();
  draw_balls();
}
