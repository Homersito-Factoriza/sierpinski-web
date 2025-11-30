const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const orderInput = document.getElementById('order');
const sizeInput = document.getElementById('size');
const orderValue = document.getElementById('orderValue');
const trianglesEl = document.getElementById('triangles'); // opcional
const statusMessage = document.getElementById('statusMessage');
const btnDraw = document.querySelector('.btn-draw');
const btnReset = document.querySelector('.btn-reset');
const btnDownload = document.querySelector('.btn-download');

// Actualiza el valor del orden y los triángulos
function updateOrderValue(value) {
    if(orderValue) orderValue.textContent = value;
    updateTriangles(value);
}

// Actualiza el contador de triángulos
function updateTriangles(order) {
    const triangles = Math.pow(3, parseInt(order)); // aproximación rápida
    if(trianglesEl) trianglesEl.textContent = triangles.toLocaleString();
}

// Dibuja un triángulo en el canvas
function drawTriangle(ctx, p1, p2, p3, color = 'white') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.lineTo(p3[0], p3[1]);
    ctx.closePath();
    ctx.fill();
}

// Punto medio
function midpoint(a, b) {
    return [(a[0]+b[0])/2, (a[1]+b[1])/2];
}

// Genera los triángulos de Sierpinski
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

// Dibuja el fractal en el canvas
function drawFractal() {
    const order = parseInt(orderInput.value);
    const size = parseInt(sizeInput.value);

    if (isNaN(order) || isNaN(size)) {
        showStatus('Por favor, completa todos los campos', 'error');
        return;
    }

    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);

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

// Resetea el formulario y canvas
function resetForm() {
    orderInput.value = 5;
    sizeInput.value = 600;
    updateOrderValue(5);
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    if(statusMessage) statusMessage.style.display = 'none';
}

// Descargar PNG
function downloadPNG() {
    const link = document.createElement('a');
    link.download = `sierpinski_order${orderInput.value}_size${sizeInput.value}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Mostrar mensaje de estado
function showStatus(msg,type='success') {
    if(!statusMessage) return;
    statusMessage.textContent = msg;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
}

// Event listeners
if(orderInput) orderInput.addEventListener('input', e => updateOrderValue(e.target.value));
if(btnDraw) btnDraw.addEventListener('click', drawFractal);
if(btnReset) btnReset.addEventListener('click', resetForm);
if(btnDownload) btnDownload.addEventListener('click', downloadPNG);

// Inicializa el canvas
updateTriangles(5);
ctx.fillStyle = 'black';
ctx.fillRect(0,0,canvas.width,canvas.height);
