

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let CW = document.documentElement.clientWidth - 40;
let CH = document.documentElement.clientHeight;

// if (CW > 600 | CH > 600) {
//     CW = 600;
//     CH = 600;
// }

canvas.width = CW;
canvas.height = CH;


let pencilStyle = "black";
let pencilSize = 1;


ctx.fillStyle = "white";
ctx.fillRect(0, 0, CW, CH);
ctx.fillStyle = "black";

let mouseX = 0;
let mouseY = 0;
let isDrawing = false;
canvas.addEventListener("mousedown", (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    isDrawing = true;
    
});
// Mobile copy quick fix
canvas.addEventListener("touchstart", (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
    isDrawing = true;
});

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        drawLine(ctx, mouseX, mouseY, e.offsetX, e.offsetY);
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
});

// Mobile copy quick fix
canvas.addEventListener("touchmove", (e) => {
    if (isDrawing) {
        drawLine(ctx, mouseX, mouseY, e.offsetX, e.offsetY);
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
})

window.addEventListener("mouseup", (e) => {
    isDrawing = false;
    mouseX = 0;
    mouseY = 0;
});

// mobile copy quick fix
window.addEventListener("touchend", (e) => {
    isDrawing = false;
    mouseX = 0;
    mouseY = 0;
});


function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = pencilStyle;
    context.lineWidth = pencilSize;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}


function getDateString() {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}

function saveImage() {
    const dataUrl = canvas.toDataURL();
    const newA = document.createElement("a");
    newA.href = dataUrl;
    newA.download = getDateString();
    newA.innerText = "Download Image: " + newA.download;
    document.getElementById("images").appendChild(newA);
}

function toggleEraser() {
    const toggle = document.getElementById("eraserToggle");
    if (toggle.innerText === "Eraser") {
        pencilStyle = "white";
        toggle.innerText = "Pencil";
    } else {
        pencilStyle = "black";
        toggle.innerText = "Eraser";
    }
}

function increasePencil() {
    pencilSize += 1;
    document.getElementById("sizeIndicator").innerText = `Current Size: ${pencilSize}px`;
}

function decreasePencil() {
    if (pencilSize > 1) {
        pencilSize -= 1;
    }  
    document.getElementById("sizeIndicator").innerText = `Current Size: ${pencilSize}px`;

}