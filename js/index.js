import { player, enemy } from './Sprite.js'
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let timer = parseInt(document.querySelector('#timer').innerHTML, 10);   // Get the string in the timer element and parse it to Int.
let timerID;    // Used to clearTimeout.
let gameEnded = false;  // Flag to determinate whenever game's has ended or not.

// Canvas' dimension.
canvas.width = 1024;
canvas.height = 576;


const keys = {
    // Player.
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {    // Since there is gravity, when the player jumps it will slowly start to fall.
        pressed: false,
    },
    // Enemy.
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {    // Since there is gravity, when the enemy jumps it will slowly start to fall.
        pressed: false,
    }
}

// Detect whenever the attackBox of a sprite hits another sprite while attacking.
function isHitting({ rectangle1, rectangle2 }) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}

// Decrease the timer. If it reaches 0 announce the winner based on remaining health.
function decreaseTimer() {
    if (timer > 0) {
        timerID = setTimeout(decreaseTimer, 1000);  // Call this function againg in 1 second.
        timer--;
        document.querySelector('#timer').innerHTML = timer; // Write the html with the new timer.
    } else {    // Timer runs out, announce the winner.
        determineWinner({ player, enemy, timerID });
    }
}

decreaseTimer();

function determineWinner({ player, enemy, timerID }) {
    clearTimeout(timerID);  // Stop the timer, the game ended.
    gameEnded = true;
    document.querySelector('#result').style.display = 'flex'    // Change from 'none' to 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#result').innerHTML = 'Tie!';   // Player's and enemy's health are the same.
    } else if (player.health > enemy.health) {
        document.querySelector('#result').innerHTML = 'Player won!'; // Player's health is greater.
    } else {
        document.querySelector('#result').innerHTML = 'Enemy won!'; // Enemy's health is greater.
    }
}

// Animate the sprites every frame.
function animate() {
    window.requestAnimationFrame(animate);  // Set this as a recursive function.
    c.fillStyle = 'black'   // Set the canvas background to black.
    c.fillRect(0, 0, canvas.width, canvas.height);  // Fill the canvas.
    player.update();
    enemy.update();

    player.velocity.x = 0;  // Reset the "x" velocity of the player each frame. So it doesn't "slide" every frame.
    enemy.velocity.x = 0;   // Same for the enemy.

    // This determinates if the player moves to the left or to the right. It wont let the player leave the canvas at the sides.
    if (keys.a.pressed && player.lastKey === 'a' && player.position.x >= 0) {
        player.velocity.x = -player.moveFactor; // 'a' is pressed and it's the last pressed key, then move to the left.
    } else if (keys.d.pressed && player.lastKey === 'd' && player.position.x <= (canvas.width - player.width)) {
        player.velocity.x = player.moveFactor;  // 'd' is pressed and it's the last pressed key, then move to the right.
    }

    // This determinates if the enemy moves to the left or to the right. It wont let the enemy leave the canvas at the sides.
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x >= 0) {
        enemy.velocity.x = -enemy.moveFactor; // 'ArrowLeft' is pressed and it's the last pressed key, then move to the left.
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x <= (canvas.width - enemy.width)) {
        enemy.velocity.x = enemy.moveFactor;  // 'ArrowRight' is pressed and it's the last pressed key, then move to the right.
    }

    // Player is attacking and tries to hit his enemy.
    if (isHitting({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
        player.isAttacking = false; // Reset the attack.
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    // Enemy is attacking and tries to hit the player.
    if (isHitting({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    if (!gameEnded) {
        if (enemy.health <= 0 || player.health <= 0) {
            determineWinner({ player, enemy, timerID });
        }
    }

}

animate();

// Whenever a key is pressed.
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        // Player keys.
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            if (!player.inTheAir) {  // Can only jump if it's not in the air.
                player.velocity.y = -player.moveFactor * 4;
            }
            break;
        case ' ':   // Player attack with space bar.
            player.attack();
            break;


        // Enemy keys.
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            if (!enemy.inTheAir) {   // Only can jump if it's not in the air.
                enemy.velocity.y = -enemy.moveFactor * 4;
            }
            break;
        case 'Control': // Enemy attack with Right control key.
            enemy.attack();
            break;
    }
});

// Whenever a key is lifted.
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        // Player.
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        // Enemy
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
});