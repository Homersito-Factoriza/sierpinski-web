const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const orderInput = document.getElementById('order');
const sizeInput = document.getElementById('size');
const trianglesEl = document.getElementById('triangles');
const statusMessage = document.getElementById('statusMessage');

function midpoint(a,b) {
    return [(a[0]+b[0])/2, (a[1]+b[1])/2];
}

function sierpinskiPoints(order, p1, p2, p3, triangles=[]) {
    if(order === 0){
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

function drawTriangle(ctx, p1, p2, p3) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(p1[0],p1[1]);
    ctx.lineTo(p2[0],p2[1]);
    ctx.lineTo(p3[0],p3[1]);
    ctx.closePath();
    ctx.fill();
}

function drawFractal() {
    const order = parseInt(orderInput.value) || 5;
    const size = parseInt(sizeInput.value) || 600;

    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const p1 = [0, canvas.height];
    const p2 = [canvas.width/2, 0];
    const p3 = [canvas.width, canvas.height];

    const triangles = sierpinskiPoints(order,p1,p2,p3);
    triangles.forEach(t => drawTriangle(ctx,t[0],t[1],t[2]));

    if(trianglesEl) trianglesEl.textContent = triangles.length;
    if(statusMessage) statusMessage.textContent = `✓ Fractal dibujado (${triangles.length} triángulos)`;
}

drawFractal();
