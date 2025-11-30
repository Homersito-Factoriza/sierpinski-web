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
    const triangles = Math.pow(3, parseInt(order));
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

/* GENERAR TRIÁNGULOS SIERPINSKI */
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

/* FUNCIONES PRINCIPALES */
function drawFractal() {
    const order = parseInt(orderInput.value);
    const size = parseInt(sizeInput.value);

    if (!order || !size) {
        showStatus('Por favor, completa todos los campos', 'error');
        return;
    }

    // Ajustar tamaño real del canvas
    canvas.width = size;
    canvas.height = size;

    // Limpiar canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Generar triángulos
    const p1 = [-size/2,-size/2];
    const p2 = [0,size/2];
    const p3 = [size/2,-size/2];

    const triangles = sierpinskiPoints(order,p1,p2,p3);

    const offsetX = canvas.width/2;
    const offsetY = canvas.height/2;
    const scale = Math.min(canvas.width, canvas.height)/size*0.8;

    triangles.forEach(tri => {
        const p1t = [tri[0][0]*scale+offsetX, -tri[0][1]*scale+offsetY];
        const p2t = [tri[1][0]*scale+offsetX, -tri[1][1]*scale+offsetY];
        const p3t = [tri[2][0]*scale+offsetX, -tri[2][1]*scale+offsetY];
        drawTriangle(ctx,p1t,p2t,p3t,'white');
    });

    showStatus(`✓ Fractal dibujado (${triangles.length} triángulos)`, 'success');
}

function resetForm() {
    orderInput.value = 5;
    sizeInput.value = 600;
    updateOrderValue(5);

    canvas.width = parseInt(sizeInput.value);
    canvas.height = parseInt(sizeInput.value);

    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
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

/* INICIALIZACIÓN */
updateTriangles(5);
canvas.width = parseInt(sizeInput.value);
canvas.height = parseInt(sizeInput.value);
ctx.fillStyle = 'black';
ctx.fillRect(0,0,canvas.width,canvas.height);
