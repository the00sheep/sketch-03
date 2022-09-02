const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const animate = () => {
  console.log('domestika');
  requestAnimationFrame(animate);
};
// animate();
let rgbR = 0;
let rgbG = 0;
let rgbB = 0;
let rgbalph = 0;

let speed = 3;

function changeRGB(r, g, b) {
  rgbR = r;
  rgbG = g;
  rgbB = b;
}

function changeRGB(r, g, b, alph) {
  rgbR = r;
  rgbG = g;
  rgbB = b;
  rgbalph = alph;
}

const sketch = ({ context, width, height }) => {
  const agents = [];

  for (let i = 0; i < 60; i++) {
    const x = random.range(0.4 * width, 0.6 * width);
    const y = random.range(0.4 * height, 0.6 * height);

    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const dist = agent.pos.getDistance(other.pos);

        if (dist > 200) continue;

        context.lineWidth = math.mapRange(dist, 0, 200, 12, 1);

        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.strokeStyle = 'rgb(0,255,200,0.4)';
        context.stroke();
      }
    }

    agents.forEach((agent) => {
      agent.update();
      agent.draw(context);
      //agent.bounce(width, height);
      agent.wrap(width, height);
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = random.range(4, 12);
  }

  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }

  wrap(width, height) {
    this.pos.x = (this.pos.x + width) % width;
    this.pos.y = (this.pos.y + height) % height;
  }

  update() {
    this.pos.x += this.vel.x * speed;
    this.pos.y += this.vel.y * speed;
  }

  draw(context) {
    context.save();
    changeRGB(0, 255, 255);
    //context.fillStyle = 'rgb(0,255,255)';
    context.fillStyle = `rgb(${rgbR},${rgbG},${rgbB})`;
    context.translate(this.pos.x, this.pos.y);

    context.lineWidth = 4;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    changeRGB(100, 40, 240, 0.7);
    context.strokeStyle = `rgb(${rgbR},${rgbG},${rgbB},${rgbalph})`;

    context.stroke();

    context.restore();
  }
}
