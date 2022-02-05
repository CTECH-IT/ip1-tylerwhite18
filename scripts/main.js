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

let lives = 3;

function checkLives() {
    if (lives == 0) {
        gameOver();
    }
}

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

let enemyWidth = 10; //half the width
let enemyHeight = 10; //half the height
let enemyColor = "green";
let enemyPaddingX = 35;
let enemyPaddingY = 20;
let enemySpeed = 2;
let enemyDiveChance = 0.025;
let enemyAttackChance = 0.05;
let enemyCount = Math.round((canvas.width / (2 * enemyWidth + enemyPaddingX)) - 0.5);
let enemyRowCount = Math.round(((canvas.height / 3) * 2) / (2 * enemyHeight + enemyPaddingY) - 0.5);
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
function populateEnemies() {
    for (let c = 0; c < enemyCount; c++) {
        for (let r = 0; r < enemyRowCount; r++) {
            let tempX = enemyWidth + c * (2 * enemyWidth + enemyPaddingX);
            let tempY = enemyHeight + r * (2 * enemyHeight + enemyPaddingY);
            let tempEnemy = new Enemy(tempX, tempY, enemyWidth, enemyHeight, enemyColor, enemyDiveChance, enemyAttackChance, true);
            enemyTracker.push(tempEnemy);
        }
    }
}
populateEnemies();

function drawEnemies() {
    for (let i = 0; i < enemyTracker.length; i++) {
        let tempEnemy = enemyTracker[i];
        if (tempEnemy.alive == true) {
            ctx.beginPath();
            ctx.rect(tempEnemy.xPos - tempEnemy.width, tempEnemy.yPos - tempEnemy.height, tempEnemy.width * 2, tempEnemy.height * 2);
            ctx.fillStyle = enemyColor;
            ctx.fill();
            ctx.closePath();
        }
    }
}

function moveEnemies() {
    let needMotion = false;
    for (const i of enemyTracker) {
        i.xPos = i.xPos + enemySpeed;
        if ((i.xPos + enemyWidth > canvas.width || i.xPos - enemyWidth < 0) && i.alive == true) {
            needMotion = true;
        }
    }
    if (needMotion == true) {
        enemySpeed = -1 * enemySpeed;
        for (const j of enemyTracker) {
            j.xPos = j.xPos + enemySpeed;
            j.yPos = j.yPos + enemyHeight * 2 + enemyPaddingY;
        }
    }
    for (const k of enemyTracker) {
        let didFire = Math.random();
        if (didFire <= enemyAttackChance && k.alive == true) {
            let tempFire = new EnemyFire(k.xPos, k.yPos + enemyHeight, true);
            fireTracker.push(tempFire);
        }
    }
}

class EnemyFire {
    constructor(xPos, yPos, alive) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.alive = alive;
    }
}
let fireTracker = [];
let fireHeight = 10; //half height
let fireWidth = 3; //half width
let fireSpeed = 2;
let fireColor = "purple";

function drawFire() {
    for (const i of fireTracker) {
        if (i.yPos + fireHeight > canvas.height) {
            i.alive = false;
        }
        else {
            i.yPos += fireSpeed;
            ctx.beginPath();
            ctx.rect(i.xPos - fireWidth, i.yPos - fireHeight, fireWidth * 2, fireHeight * 2);
            ctx.fillStyle = fireColor;
            ctx.fill();
            ctx.closePath();
        }
    }
    fireTracker = fireTracker.filter(isFireAlive);
}
function isFireAlive(inpt) {
    return inpt.alive == true;
}

function checkBullets() {
    let minReq = bulletRadius + Math.SQRT2 * enemyWidth;
    for (const i of enemyTracker) {
        for (const j of bulletTracker) {
            if (i.alive == true && j.alive == true) {
                let dist = Math.sqrt(Math.pow((j.xPos - i.xPos), 2) + Math.pow((j.yPos - i.yPos), 2));
                if (dist <= minReq) {
                    i.alive = false;
                    j.alive = false;
                }
            }
        }
    }
}

function checkTouching() { //!!!!!!this is where lives need some adding
    for (const i of enemyTracker) {
        let xSep = Math.abs(i.xPos - x);
        let ySep = Math.abs(i.yPos - y);
        if ((xSep < i.width + playerHitboxRadial && ySep < i.height + playerHitboxRadial) && i.alive == true) {
            i.alive = false;
            lives--;
        }
    }
}


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

function gameOver() {
    alert("GAME OVER");
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    checkBullets();
    checkTouching();
    drawFire();
    drawEnemies();
    drawBullets();
    movePlayer();
    drawPlayer();
    checkLives();
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

let interval = setInterval(render, 10);
let enemyMoveInterval = setInterval(moveEnemies, 600);