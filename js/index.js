import { player, enemy } from './Fighter.js'
import { background, shop } from './Sprite.js';
import { loadKeyDownEvents, loadkeyUpEvents, playerMovement, enemyMovement, isHitting } from './Keys.js'
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let timer = 10; // Game timer.
let timerID;    // Used to clearTimeout.
let gameEnded = false;  // Flag to determinate whenever game's has ended or not.
// TODO: hacer clase game.js? Y meter la lógica del juego en general.

// Canvas' dimension.
canvas.width = 1024;
canvas.height = 576;

loadKeyDownEvents(player, enemy);   // Load player and enemy movements.
loadkeyUpEvents();

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

// Animate the sprites every frame.
function animate() {
    window.requestAnimationFrame(animate);  // Set this as a recursive function.
    c.fillStyle = 'black'   // Set the canvas background to black.
    c.fillRect(0, 0, canvas.width, canvas.height);  // Fill the canvas.
    background.update();
    shop.update();
    player.update();
    enemy.update();
    
    player.velocity.x = 0;  // Reset the "x" velocity of the player each frame. So it doesn't "slide" every frame.
    enemy.velocity.x = 0;   // Same for the enemy.

    if (!playerMovement(player, canvas)) {  // If player is not running, set his spriteto idle.
        player.switchSprite('idle');
    }

    if (!enemyMovement(enemy, canvas)) {    // Enemy movement in the canvas.
        enemy.switchSprite('idle')
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