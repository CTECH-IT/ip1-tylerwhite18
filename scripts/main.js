let canvas = document.getElementById("screen");
let ctx = canvas.getContext("2d");

let playerHitboxRadial = 10;
let x = canvas.width / 2;
let y = canvas.height - playerHitboxRadial;
let speedX = 2;
let speedY = 2;

let upPressed = false;
let downPressed = false;
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let spacePressable = true;

function drawPlayer() {
    ctx.beginPath();
    ctx.rect(x - playerHitboxRadial, y - playerHitboxRadial, playerHitboxRadial * 2, playerHitboxRadial * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}
function movePlayer() {
        if (rightPressed == true && !(x + playerHitboxRadial > canvas.width)) {
            x = x + speedX;
        }
        else if (leftPressed == true && !(x - playerHitboxRadial < 0)) {
            x = x - speedX;
        }
        if (upPressed == true && !(y - playerHitboxRadial < 0)) {
            y = y - speedY;
        }
        else if (downPressed == true && !(y + playerHitboxRadial > canvas.height)) {
            y = y + speedY;
        }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    movePlayer();
    drawPlayer();
}

function keyPress(e) {
    if (e.keyCode == "39") { //check if right is pressed
        rightPressed = true;
    }
    else if (e.keyCode == "37" && rightPressed == false) { //check if left is pressed
        leftPressed = true;
    }
    if (e.keyCode == "38") { //check if right is pressed
        upPressed = true;
    }
    else if (e.keyCode == "40" && upPressed == false) { //check if left is pressed
        downPressed = true;
    }
    if (e.keyCode == "32") {
        if(spacePressable == true) {
            spacePressed = true;
            spacePressable = false;
        }
    }
}
function keyRelease(e) {
    if (e.keyCode == "39") { //check if right is pressed
        rightPressed = false;
    }
    if (e.keyCode == "37") { //check if left is pressed
        leftPressed = false;
    }
    if (e.keyCode == "38") { //check if right is pressed
        upPressed = false;
    }
    if (e.keyCode == "40") { //check if left is pressed
        downPressed = false;
    }
    if (e.keyCode == "32") {
        spacePressable = true;
        spacePressed = false;
    }
}

document.addEventListener("keydown", keyPress, false);
document.addEventListener("keyup", keyRelease, false);

setInterval(render, 10);
