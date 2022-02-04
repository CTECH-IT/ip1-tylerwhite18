let canvas = document.getElementById("screen");
let ctx = canvas.getContext("2d");

let playerHitboxRadial = 10;
let x = canvas.width / 2;
let y = canvas.height - playerHitboxRadial;
let speedX = 3;
let speedY = 2;

let upPressed = false;
let downPressed = false;
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let spacePressable = true;

let bulletTracker = [];
let bulletCount = 0;
let bulletSpeed = 2;
let bulletRadius = 5;

class Bullet {
    constructor(xPos, yPos, alive) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.alive = alive;
    }
}
function createBullet() {
    bulletCount++;
    let tempObj = new Bullet(x, y, true);
    bulletTracker.push(tempObj);
}
function drawBullets() {
    for (let i = bulletCount - 1; i >= 0; i--) {
        let tempBullet = bulletTracker[i];
        if (tempBullet.yPos - bulletRadius < 0) {
            tempBullet.alive = false;
        }
        else {
            tempBullet.yPos = tempBullet.yPos - bulletSpeed;
            ctx.beginPath();
            ctx.arc(tempBullet.xPos, tempBullet.yPos, bulletRadius, 0, 2 * Math.PI, true);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();
        }
    }
    bulletTracker = bulletTracker.filter(checkLife);
    bulletCount = bulletTracker.length;
}
function checkLife(inpt) {
    return inpt.alive == true;
}

let enemyWidth = 30;
let enemyHeight = 30;
let enemyColor = "green";
let enemyDiveChance = 0.025;
let enemyAttackChance = 0.05;
let enemyCount = Math.round((canvas.width / (enemyWidth + 10)) - 0.5);
let enemyRowCount = 5;
let enemyTracker = [];

class Enemy {
    constructor(xPos, yPos, width, height, color, diveChance, attackChance, alive) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.color = color;
        this.diveChance = diveChance;
        this.attackChance = attackChance;
        this.alive = alive;
    }
}
for (let c = enemyCount - 1; c >= 0; i--) { //needs fixing, also make it go top left to bottom right instead of vice versa
    for(let r = enemyRowCount - 1; r >=0; r--) {
        let tempEnemy = new Enemy(x, y, enemyWidth, enemyHeight, enemyColor, enemyDiveChance, enemyAttackChance, true);
        enemyTracker[c].push(tempEnemy);
    }
}

/*function drawEnemies() {
    for (let i = enemyCount; i > )
}*/


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
    
    drawBullets();
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
            createBullet();
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
