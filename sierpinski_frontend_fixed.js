const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const orderInput = document.getElementById('order');
const sizeInput = document.getElementById('size');
const orderValue = document.getElementById('orderValue');
const trianglesEl = document.getElementById('triangles');
const statusMessage = document.getElementById('statusMessage');

const btnDraw = document.querySelector('.btn-draw');
const btnReset = document.querySelector('.btn-reset');
const btnDownload = document.querySelector('.btn-download');

/* UTILS */
function updateOrderValue(value) {
    orderValue.textContent = value;
    updateTriangles(value);
}

function updateTriangles(order) {
    const n = parseInt(order);
    const triangles = Math.pow(3, n);
    trianglesEl.textContent = triangles.toLocaleString();
}

function drawTriangle(ctx, p1, p2, p3, color = 'white') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.lineTo(p3[0], p3[1]);
    ctx.closePath();
    ctx.fill();
}

/* Sierpinski */
function midpoint(a, b) {
    return [(a[0]+b[0])/2, (a[1]+b[1])/2];
}

function sierpinskiPoints(order, p1, p2, p3, triangles=[]) {
    if (order === 0) {
        triangles.push([p1,p2,p3]);
        return triangles;
    }

    const m12 = midpoint(p1,p2);
    const m23 = midpoint(p2,p3);
    const m31 = midpoint(p3,p1);

    sierpinskiPoints(order-1, p1, m12, m31, triangles);
    sierpinskiPoints(order-1, m12, p2, m23, triangles);
    sierpinskiPoints(order-1, m31, m23, p3, triangles);

    return triangles;
}

/* MAIN FUNCTIONS */
function drawFractal() {
    const order = parseInt(orderInput.value);
    const size = parseInt(sizeInput.value);

    if (isNaN(order) || isNaN(size) || size <= 0) {
        showStatus('Por favor, completa todos los campos', 'error');
        return;
    }

    canvas.width = size;
    canvas.height = size;

    // Fondo negro
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Triángulo inicial (coordenadas relativas al canvas)
    const p1 = [0, canvas.height];
    const p2 = [canvas.width/2, 0];
    const p3 = [canvas.width, canvas.height];

    const triangles = sierpinskiPoints(order, p1, p2, p3);

    triangles.forEach(tri => drawTriangle(ctx, tri[0], tri[1], tri[2], 'white'));

    showStatus(`✓ Fractal dibujado (${triangles.length} triángulos)`, 'success');
}

function resetForm() {
    orderInput.value = 5;
    sizeInput.value = 600;
    updateOrderValue(5);
    drawFractal();
    statusMessage.style.display = 'none';
}

function downloadPNG() {
    const link = document.createElement('a');
    link.download = `sierpinski_order${orderInput.value}_size${sizeInput.value}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function showStatus(msg,type='success') {
    statusMessage.textContent = msg;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
}

/* EVENTOS */
orderInput.addEventListener('input', e => updateOrderValue(e.target.value));
btnDraw.addEventListener('click', drawFractal);
btnReset.addEventListener('click', resetForm);
btnDownload.addEventListener('click', downloadPNG);

/* INIT */
updateTriangles(5);
drawFractal();
