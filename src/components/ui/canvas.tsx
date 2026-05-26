import { motion } from 'framer-motion';

class Oscillator {
  phase: number = 0;
  offset: number = 0;
  frequency: number = 0;
  amplitude: number = 0;

  constructor(options: { phase?: number; offset?: number; frequency?: number; amplitude?: number } = {}) {
    this.phase = options.phase || 0;
    this.offset = options.offset || 0;
    this.frequency = options.frequency || 0.001;
    this.amplitude = options.amplitude || 1;
  }

  update() {
    this.phase += this.frequency;
    return this.offset + Math.sin(this.phase) * this.amplitude;
  }
}

class NodeItem {
  x: number = 0;
  y: number = 0;
  vy: number = 0;
  vx: number = 0;
}

const E = {
  debug: true,
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
};

const pos = { x: 0, y: 0 };
let lines: LineItem[] = [];
let ctx: any = null;
let oscillatorInstance: Oscillator;

class LineItem {
  spring: number;
  friction: number;
  nodes: NodeItem[];

  constructor(options: { spring: number }) {
    this.spring = options.spring + 0.1 * Math.random() - 0.05;
    this.friction = E.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];
    for (let n = 0; n < E.size; n++) {
      const t = new NodeItem();
      t.x = pos.x;
      t.y = pos.y;
      this.nodes.push(t);
    }
  }

  update() {
    let e = this.spring;
    let t = this.nodes[0];
    t.vx += (pos.x - t.x) * e;
    t.vy += (pos.y - t.y) * e;
    for (let i = 0, a = this.nodes.length; i < a; i++) {
      t = this.nodes[i];
      if (i > 0) {
        const n = this.nodes[i - 1];
        t.vx += (n.x - t.x) * e;
        t.vy += (n.y - t.y) * e;
        t.vx += n.vx * E.dampening;
        t.vy += n.vy * E.dampening;
      }
      t.vx *= this.friction;
      t.vy *= this.friction;
      t.x += t.vx;
      t.y += t.vy;
      e *= E.tension;
    }
  }

  draw(context: CanvasRenderingContext2D) {
    let e, t;
    let n = this.nodes[0].x;
    let i = this.nodes[0].y;
    context.beginPath();
    context.moveTo(n, i);
    let a;
    for (a = 1; a < this.nodes.length - 2; a++) {
      e = this.nodes[a];
      t = this.nodes[a + 1];
      n = 0.5 * (e.x + t.x);
      i = 0.5 * (e.y + t.y);
      context.quadraticCurveTo(e.x, e.y, n, i);
    }
    e = this.nodes[a];
    t = this.nodes[a + 1];
    context.quadraticCurveTo(e.x, e.y, t.x, t.y);
    context.stroke();
    context.closePath();
  }
}

function render() {
  if (ctx && ctx.running) {
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = "source-over";
    
    // Smooth shifting rainbow color strand ribbon following the mouse!
    ctx.strokeStyle = "hsla(" + Math.round(oscillatorInstance.update()) + ",100%,50%,0.025)";
    ctx.lineWidth = 10;
    
    for (let t = 0; t < E.trails; t++) {
      if (lines[t]) {
        lines[t].update();
        lines[t].draw(ctx);
      }
    }
    ctx.frame++;
    window.requestAnimationFrame(render);
  }
}

function resizeCanvas() {
  if (ctx && ctx.canvas) {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }
}

export const renderCanvas = function () {
  const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvasElement) return () => {};
  
  ctx = canvasElement.getContext("2d");
  if (!ctx) return () => {};
  
  ctx.running = true;
  ctx.frame = 1;
  
  oscillatorInstance = new Oscillator({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  });
  
  // Set initial pos in center of screen
  pos.x = window.innerWidth / 2;
  pos.y = window.innerHeight / 2;

  lines = [];
  for (let e = 0; e < E.trails; e++) {
    lines.push(new LineItem({ spring: 0.45 + (e / E.trails) * 0.025 }));
  }

  function c(e: MouseEvent | TouchEvent) {
    if ('touches' in e && e.touches && e.touches.length > 0) {
      pos.x = e.touches[0].clientX;
      pos.y = e.touches[0].clientY;
    } else if ('clientX' in e) {
      pos.x = e.clientX;
      pos.y = e.clientY;
    }
  }

  function l(e: TouchEvent) {
    if (e.touches.length === 1) {
      pos.x = e.touches[0].clientX;
      pos.y = e.touches[0].clientY;
    }
  }

  document.addEventListener("mousemove", c);
  document.addEventListener("touchmove", c, { passive: true });
  document.addEventListener("touchstart", l, { passive: true });
  window.addEventListener("resize", resizeCanvas);

  const focusHandler = () => {
    if (ctx && !ctx.running) {
      ctx.running = true;
      render();
    }
  };
  window.addEventListener("focus", focusHandler);

  resizeCanvas();
  render();

  // Returns memory-safe cleanup listener handler
  return () => {
    if (ctx) ctx.running = false;
    document.removeEventListener("mousemove", c);
    document.removeEventListener("touchmove", c);
    document.removeEventListener("touchstart", l);
    window.removeEventListener("resize", resizeCanvas);
    window.removeEventListener("focus", focusHandler);
  };
};
