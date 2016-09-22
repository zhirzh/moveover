let canvas;
let ctx;
let fps;
let last;
let rafID;

let img;
let imgB;

let zoom;
const points = [];


function createPath(e) {
  points.unshift({
    x: (e.clientX - canvas.rect.left) * zoom,
    y: (e.clientY - canvas.rect.top) * zoom,
    t: performance.now(),
  });
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

    const delta = now - points[i].t;
    const alpha = Math.max(1 - (delta / 1000), 0);

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


function render(HRTimestamp) {
  rafID = requestAnimationFrame(render);
  if (HRTimestamp - last < 1000 / fps) {
    return;
  }
  last = HRTimestamp;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  renderPath();
  renderImages();

  if (points.length === 0) {
    cancelAnimationFrame(rafID);
    rafID = 0;
  }
}


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

  zoom = img.width / size.W;  // same as: zoom = img.height / H;
}


function onLoaded() {
  canvas.width = img.width;
  canvas.height = img.height;

  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.shadowBlur = 20;
}


function loadImage(src) {
  const image = new Image();
  image.src = src;
  image.promise = new Promise((res) => {
    image.onload = res;
  });

  return image;
}


function restartAnimation() {
  if (rafID === 0) {
    rafID = requestAnimationFrame(render);
  }
}


function bindEventListeners() {
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', createPath);
  window.addEventListener('mousemove', restartAnimation);
}


function init({ canvas: _canvas, imgSrc, imgBSrc, fps: _fps = 60 }) {
  canvas = _canvas;
  ctx = canvas.getContext('2d');
  fps = _fps;
  last = 0;

  img = loadImage(imgSrc);
  imgB = loadImage(imgBSrc);

  Promise.all([img.promise, imgB.promise])
    .then(onLoaded)
    .then(resize)
    .then(render)
    .then(bindEventListeners);
}

init({
  canvas: document.querySelector('canvas'),
  imgSrc: '1.jpg',
  imgBSrc: '1.b.jpg',
  fps: 30,
});
