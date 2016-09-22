let canvas;
let ctx;
let rafID;

let img;
let imgB;

let K;
let ctr = 0;
let lastPoint = 0;
const points = [];


function resize() {
  const viewportAspect = window.innerWidth / window.innerHeight;
  const imgAspect = img.width / img.height;

  const size = {
    W: window.innerWidth,
    H: window.innerHeight,
  };

  const offset = {
    X: 0,
    Y: 0,
  };

  if (viewportAspect < imgAspect) {
    size.W = size.H * imgAspect;
    offset.X = (window.innerWidth - size.W) / 2;
  } else {
    size.H = size.W / imgAspect;
    offset.Y = (window.innerHeight - size.H) / 2;
  }

  canvas.style.width = `${1 + size.W}px`;
  canvas.style.height = `${1 + size.H}px`;

  canvas.style.left = `${offset.X}px`;
  canvas.style.top = `${offset.Y}px`;

  canvas.rect = canvas.getBoundingClientRect();

  K = img.width / size.W;  // same as: K = img.height / H;
}


function renderPath() {
  const now = performance.now();

  for (let i = 0; i < points.length; i += 1) {
    if (now - points[i].t > 1000) {
      points.length = i;
    }
  }

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.globalCompositeOperation = 'source-over';
  for (let i = 1; i < points.length; i += 1) {
    const d = Math.sqrt(
      Math.pow(points[i].x - points[i - 1].x, 2)
      + Math.pow(points[i].y - points[i - 1].y, 2));

    const alpha = Math.max(1 - ((now - points[i].t) / 1000), 0);

    ctx.beginPath();
    ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
    ctx.lineWidth = 30 + (70 * Math.max(1 - (d / 100), 0));
    ctx.moveTo(points[i - 1].x, points[i - 1].y);
    ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();
  }

  ctx.restore();
}


function renderImages() {
  ctx.globalCompositeOperation = 'source-in';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = 'destination-over';
  ctx.drawImage(imgB, 0, 0, canvas.width, canvas.height);
}


function render() {
  rafID = requestAnimationFrame(render);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (points.length === 0) {
    cancelAnimationFrame(rafID);
    rafID = 0;
  }

  renderPath();
  renderImages();
}


function onLoaded() {
  ctr += 1;
  if (ctr < 2) {
    return;
  }

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.shadowBlur = 20;

  resize();

  rafID = requestAnimationFrame(render);
}


function initResources() {
  canvas = document.querySelector('canvas');
  ctx = canvas.getContext('2d');

  img = new Image();
  img.src = '1.jpg';

  imgB = new Image();
  imgB.src = '1.b.jpg';

  img.onload = imgB.onload = onLoaded;
}


function init() {
  window.addEventListener('mousemove', (e) => {
    const point = {
      x: (e.clientX - canvas.rect.left) * K,
      y: (e.clientY - canvas.rect.top) * K,
      t: performance.now(),
    };

    if (point.t - lastPoint < 20) {
      return;
    }

    lastPoint = point.t;
    points.unshift(point);

    if (rafID === 0) {
      rafID = requestAnimationFrame(render);
    }
  });

  window.addEventListener('resize', resize);

  initResources();
}

init();
