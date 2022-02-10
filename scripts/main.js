let canvas = document.getElementById("screen");
let ctx = canvas.getContext("2d");
let infoBar = document.getElementById("lifeCounter");
let scoreBar = document.getElementById("score");
let title = document.getElementById("page-title");

let titleColor = 1;

let playerHitboxRadial = 10;
let x = canvas.width / 2;
let y = canvas.height - playerHitboxRadial;
let speedX = 2;
let speedY = 2;
const fireRate = 450;

let score = 0;
const scoreIncrement = 100;
let level = 1;

let upPressed = false;
let downPressed = false;
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let spacePressable = true;

let lives = 3;

function checkLives() {
    infoBar.innerText = "Lives: " + lives;
    if (lives == 0) {
        gameOver();
    }
}

let bulletTracker = [];
let bulletCount = 0;
let bulletSpeed = 2;
let bulletRadius = 5;
let bulletFirable = true;

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
let enemyDiveChance = 0.001;
const enemyAttackIncrement = 0.005;
const enemyDiveIncrement = 0.001;
let enemyAttackChance = 0.005;
let enemyCount = Math.round((canvas.width / (2 * enemyWidth + enemyPaddingX)) - 0.5);
let enemyRowCount = Math.round(((canvas.height / 4) * 2) / (2 * enemyHeight + enemyPaddingY) - 0.5);
let enemyTracker = [];
const enemyRogueSpeed = 2;
let enemyMoveTiming = 600;


class Enemy {
    constructor(xPos, yPos, width, height, color, diveChance, attackChance, alive, rogue, rogueX, rogueY, rogueDY, rogueDX) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.width = width;
        this.height = height;
        this.color = color;
        this.diveChance = diveChance;
        this.attackChance = attackChance;
        this.alive = alive;
        this.rogue = rogue;
        this.rogueX = rogueX;
        this.rogueY = rogueY;
        this.rogueDY = rogueDY;
        this.rogueDX = rogueDX;
    }
}
function populateEnemies() {
    for (let c = 0; c < enemyCount; c++) {
        for (let r = 0; r < enemyRowCount; r++) {
            let tempX = enemyWidth + c * (2 * enemyWidth + enemyPaddingX);
            let tempY = enemyHeight + r * (2 * enemyHeight + enemyPaddingY);
            let tempEnemy = new Enemy(tempX, tempY, enemyWidth, enemyHeight, enemyColor, enemyDiveChance, enemyAttackChance, true, false, tempX, tempY, enemyRogueSpeed, 0);
            enemyTracker.push(tempEnemy);
        }
    }
}
populateEnemies();

function drawEnemies() {
    for (let i = 0; i < enemyTracker.length; i++) {
        let tempEnemy = enemyTracker[i];
        if (tempEnemy.rogueY == tempEnemy.yPos && tempEnemy.rogue == true) {
            tempEnemy.rogueDY = 0;
            if (tempEnemy.rogueX == tempEnemy.xPos) {
                tempEnemy.rogue = false;
            }
        }
        if (tempEnemy.alive == true && tempEnemy.rogue == false) {
            ctx.beginPath();
            ctx.rect(tempEnemy.xPos - tempEnemy.width, tempEnemy.yPos - tempEnemy.height, tempEnemy.width * 2, tempEnemy.height * 2);
            ctx.fillStyle = enemyColor;
            ctx.fill();
            ctx.closePath();
        }
        else if (tempEnemy.alive == true && tempEnemy.rogue == true) {
            if (tempEnemy.rogueY + enemyWidth > canvas.height) {
                tempEnemy.rogueDY = -1 * tempEnemy.rogueDY;
            }
            if (tempEnemy.rogueDY < 0) {
                if (Math.abs(tempEnemy.rogueX - tempEnemy.xPos) <= enemyRogueSpeed) {
                    tempEnemy.rogueX = tempEnemy.xPos;
                }
                else if ((tempEnemy.rogueX - tempEnemy.xPos) < 0) {
                    tempEnemy.rogueDX = enemyRogueSpeed;
                }
                else if ((tempEnemy.rogueX - tempEnemy.xPos) > 0) {
                    tempEnemy.rogueDX = -1 * enemyRogueSpeed;
                }
            }
            tempEnemy.rogueX = tempEnemy.rogueX + tempEnemy.rogueDX;
            tempEnemy.rogueY = tempEnemy.rogueY + tempEnemy.rogueDY;
            ctx.beginPath();
            ctx.rect(tempEnemy.rogueX - tempEnemy.width, tempEnemy.rogueY - tempEnemy.height, tempEnemy.width * 2, tempEnemy.height * 2);
            ctx.fillStyle = enemyColor;
            ctx.fill();
            ctx.closePath();
            tempEnemy.rogueDX = 0;
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
        if (k.rogue == false) {
            let didFire = Math.random();
            if (didFire <= enemyAttackChance && k.alive == true) {
                let tempFire = new EnemyFire(k.xPos, k.yPos + enemyHeight, true);
                fireTracker.push(tempFire);
            }
            if (k.yPos + enemyHeight > canvas.height && k.alive == true) {
                gameOver();
            }
        }
        let didGoStupid = Math.random();
        if (didGoStupid <= enemyDiveChance && k.alive == true) {
            k.rogue = true;
            k.rogueX = k.xPos;
            k.rogueY = k.yPos + enemyRogueSpeed;
            k.rogueDY = enemyRogueSpeed;
            k.rogueDX = 0;
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
let fireHeight = 7; //half height
let fireWidth = 2; //half width
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

function checkFire() {
    for (const i of fireTracker) {
        let xSep = Math.abs(i.xPos - x);
        let ySep = Math.abs(i.yPos - y);
        if ((xSep < fireWidth + playerHitboxRadial && ySep < fireHeight + playerHitboxRadial) && i.alive == true) {
            i.alive = false;
            lives--;
        }
    }
}

function checkBullets() {
    let minReq = bulletRadius + Math.SQRT2 * enemyWidth;
    for (const i of enemyTracker) {
        for (const j of bulletTracker) {
            if (i.alive == true && j.alive == true && i.rogue == false) {
                let dist = Math.sqrt(Math.pow((j.xPos - i.xPos), 2) + Math.pow((j.yPos - i.yPos), 2));
                if (dist <= minReq) {
                    i.alive = false;
                    j.alive = false;
                    score += scoreIncrement + 15 * (level - 1);
                }
            }
            else if (i.alive == true && j.alive == true && i.rogue == true) {
                let dist = Math.sqrt(Math.pow((j.xPos - i.rogueX), 2) + Math.pow((j.yPos - i.rogueY), 2));
                if (dist <= minReq) {
                    i.alive = false;
                    i.rogue = false;
                    j.alive = false;
                    score += scoreIncrement + 15 * (level - 1);
                }
            }
        }
    }
}

function checkTouching() { //!!!!!!this is where lives need some adding
    for (const i of enemyTracker) {
        if (i.rogue == false) {
            let xSep = Math.abs(i.xPos - x);
            let ySep = Math.abs(i.yPos - y);
            if ((xSep < i.width + playerHitboxRadial && ySep < i.height + playerHitboxRadial) && i.alive == true) {
                i.alive = false;
                lives--;
                score -= scoreIncrement * (level + 1);
            }
        }
        else if (i.rogue == true) {
            let xSep = Math.abs(i.rogueX - x);
            let ySep = Math.abs(i.rogueY - y);
            if ((xSep < i.width + playerHitboxRadial && ySep < i.height + playerHitboxRadial) && i.alive == true) {
                i.alive = false;
                i.rogue = false
                lives--;
                score -= scoreIncrement * (level + 1);
            }
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
    if (leftPressed == true && !(x - playerHitboxRadial < 0)) {
        x = x - speedX;
    }
    if (upPressed == true && !(y - playerHitboxRadial < 0)) {
        y = y - speedY;
    }
    if (downPressed == true && !(y + playerHitboxRadial > canvas.height)) {
        y = y + speedY;
    }
}

function gameOver() {
    alert("Game Over. Final Score: " + score);
    document.location.reload();
    clearInterval(interval);
    clearInterval(enemyMoveInterval);
    clearInterval(titleInterval);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    checkBullets();
    checkTouching();
    checkFire();
    drawFire();
    drawEnemies();
    drawBullets();
    movePlayer();
    drawPlayer();
    checkLives();
    checkScore();
}

let canFireInterval = setInterval(nowShoot, fireRate);
clearInterval(canFireInterval);
let canReallyFireInterval = setInterval(canFire, fireRate);
clearInterval(canReallyFireInterval);
function nowShoot() {
    createBullet();
}
function canFire() {
    bulletFirable = true;
}

function keyPress(e) {
    if (e.keyCode == "39") { //check if right is pressed
        rightPressed = true;
    }
    if (e.keyCode == "37") { //check if left is pressed
        leftPressed = true;
    }
    if (e.keyCode == "38") { //check if up is pressed
        upPressed = true;
    }
    if (e.keyCode == "40") { //check if down is pressed
        downPressed = true;
    }
    if (e.keyCode == "32") {
        if(spacePressable == true) {
            spacePressed = true;
            spacePressable = false;
            if (bulletFirable == true) {
                createBullet();
                bulletFirable = false;
                clearInterval(canReallyFireInterval);
                canReallyFireInterval = setInterval(canFire, fireRate);
            }
            canFireInterval = setInterval(nowShoot, fireRate);
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
    if (e.keyCode == "38") { //check if up is pressed
        upPressed = false;
    }
    if (e.keyCode == "40") { //check if down is pressed
        downPressed = false;
    }
    if (e.keyCode == "32") {
        spacePressed = false;
        spacePressable = true;
        clearInterval(canFireInterval);
    }
}

document.addEventListener("keydown", keyPress, false);
document.addEventListener("keyup", keyRelease, false);

let incrementability = 1;
function checkScore() {
    scoreBar.innerText = "Score: " + score;
    let aliveTrackArray = enemyTracker.filter(aliveTrackThing);
    if (aliveTrackArray.length == 0) {
        newRound();
    }
    else if (aliveTrackArray.length <= enemyTracker.length / 4 && incrementability == 2) {
        enemyAttackChance *= 3;
        enemyDiveChance *= 3;
        incrementability++;
    }
    else if (aliveTrackArray.length <= enemyTracker.length / 2 && incrementability == 1) {
        enemyAttackChance *= 2;
        enemyAttackChance *= 2;
        incrementability++;
    }
}
function aliveTrackThing(inpt) {
    return inpt.alive == true;
}

function changeTitleColor() {
    if (titleColor == 1) {
        titleColor++;
        title.style.color = "red";
    }
    else if (titleColor == 2) {
        titleColor++;
        title.style.color = "green";
    }
    else if (titleColor == 3) {
        titleColor = 1;
        title.style.color = "blue";
    }
}

let interval = setInterval(render, 10);
let enemyMoveInterval = setInterval(moveEnemies, enemyMoveTiming);
let titleInterval = setInterval(changeTitleColor, 800);

function newRound() {
    level++;
    lives++;
    incrementability = 1;
    enemySpeed = Math.abs(enemySpeed);
    clearInterval(enemyMoveInterval);
    if (enemyMoveTiming > 30) {
        enemyMoveTiming = enemyMoveTiming - 30;
    }
    enemyMoveInterval = setInterval(moveEnemies, enemyMoveTiming);
    enemyAttackChance = level * enemyAttackIncrement;
    enemyDiveChance = level * enemyDiveIncrement;
    x = canvas.width / 2;
    y = canvas.height - playerHitboxRadial;
    enemyTracker.length = 0;
    fireTracker.length = 0;
    populateEnemies();
}
