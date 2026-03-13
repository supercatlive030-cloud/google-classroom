const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
function resize(){
  canvas.width = Math.min(window.innerWidth - 40, 800);
  canvas.height = 480;
}
window.addEventListener('resize', resize);
resize();

let x = 50, y = 50, vx = 3, vy = 2, r = 20;
function step(){
  x += vx; y += vy;
  if(x - r < 0 || x + r > canvas.width) vx *= -1;
  if(y - r < 0 || y + r > canvas.height) vy *= -1;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#2b6cff';
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fill();
  requestAnimationFrame(step);
}
step();
