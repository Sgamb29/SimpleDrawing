const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let CW = document.documentElement.clientWidth - 40;
let CH = document.documentElement.clientHeight;

canvas.width = CW;
canvas.height = CH;

updateCanvasSizeIndicator();

let pencilStyle = "black";
let pencilSize = 1;
let onEraser = false;

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
    if (e.touches.length > 1) {
        mouseY = e.touches[0].clientY;
        return;
    }
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    mouseX = e.touches[0].clientX - rect.left;
    mouseY = e.touches[0].clientY - rect.top;
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

    if (e.touches.length > 1) {
        const delta = mouseY - e.touches[0].clientY;
        mouseY = e.touches[0].clientY;
        window.scrollBy(0, delta);
        return;
    }
    if (isDrawing) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const currentX = e.touches[0].clientX - rect.left;
        const currentY = e.touches[0].clientY - rect.top;
        
        drawLine(ctx, mouseX, mouseY, currentX, currentY);
        mouseX = currentX;
        mouseY = currentY;
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
    const imagesContainer = document.getElementById("images");
    // Removes old links
    imagesContainer.innerHTML = "";
    // Creates download link
    const dataUrl = canvas.toDataURL();
    const newA = document.createElement("a");
    newA.href = dataUrl;
    newA.download = getDateString();
    newA.innerText = "Save Image: " + newA.download + ".png";
    imagesContainer.appendChild(newA);
    // Creates cancel button
    const xButton = document.createElement("button");
    xButton.innerText = "Cancel";
    xButton.addEventListener("click", () => {
        imagesContainer.innerHTML = "";
    })
    imagesContainer.appendChild(xButton);
}

function toggleEraser() {
    const toggle = document.getElementById("eraserToggle");
    if (toggle.innerText === "Eraser") {
        pencilStyle = "white";
        toggle.innerText = "Pencil";
        onEraser = true;
    } else {
        pencilStyle = "black";
        toggle.innerText = "Eraser";
        onEraser = false;
    }
    displayPencilSize();
}

let currentCanvasData = null;

function adjustHeight(amount) {
    currentCanvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.height += amount;
    updateCanvasSizeIndicator();
    ctx.putImageData(currentCanvasData, 0, 0);
}

function adjustWidth(amount) {
    currentCanvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width += amount;
    updateCanvasSizeIndicator();
    ctx.putImageData(currentCanvasData, 0, 0);
}

function updateCanvasSizeIndicator() {
    document.getElementById("canvasSizeIndicator").innerText = `Current Canvas: ${canvas.width}x${canvas.height}`;
}

function increasePencil(num=1,toDefault=false) {
    pencilSize += num;
    if (num > 1 || toDefault) {
        pencilSize = num;
    }
    displayPencilSize();
}

function decreasePencil() {
    if (pencilSize > 1) {
        pencilSize -= 1;
    }  
    displayPencilSize();

}

function displayPencilSize() {
    pencilOrEraser = onEraser ? "eraser" : "pencil";
    document.getElementById("sizeIndicator").innerText = `Current ${pencilOrEraser}: ${pencilSize}px`;
}

// Logic for quick pencil size adjustments and toggling eraser.
let numsPressed = ""; 
document.addEventListener("keypress", (e) => {
    if (e.key === "e") {
        toggleEraser();
        return;
    }
    const valid = "0123456789";
    if (e.key === "Enter" && numsPressed.length) {
        pencilSize = parseInt(numsPressed);
        numsPressed = "";
        displayPencilSize();
        return;
    }
    for (let i = 0; i < valid.length; i++) {
        if (e.key === valid[i]) {
            numsPressed = numsPressed + valid[i];
            if (numsPressed.length > 3) {
                numsPressed = "";
            }
            break;
        }
    }
})

const slider = document.getElementById("shadeSlider");
const indicator = document.getElementById("shadeIndicator");
function changeShade() {
    const shade = slider.value;
    const shadeStr = `rgb(${shade},${shade},${shade})`;
    pencilStyle = shadeStr;
    indicator.style.backgroundColor = shadeStr;
}
changeShade();

// Traffic count logic
const now = new Date();
const dotw = now.getDay();
const lastFetch = localStorage.getItem("lastFetch");
if (lastFetch !== dotw.toString()) {
    makeTrafficCall();
}
function makeTrafficCall() {
    const request = new Request("https://server.sgambapps.com/?site=simpleDrawing", {
        method: "POST",
    });
    fetch(request)
    .then(res => {
        if (res.ok) {
            console.log("visit counted");
        }
    })
    .catch(err => console.log(err));
    localStorage.setItem("lastFetch", dotw.toString());
}