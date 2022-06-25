import { player, enemy } from './Fighter.js'
import { background, shop } from './Sprite.js';
import { loadKeyDownEvents, loadkeyUpEvents, isHitting } from './Keys.js'

let timer = 10; // Game timer.
let timerID;    // Used to clearTimeout.
let gameEnded = false;  // Flag to determinate whenever game's has ended or not.
// TODO: hacer clase game.js? Y meter la lógica del juego en general.

loadKeyDownEvents(player, enemy);   // Load player and enemy KeyDown events.
loadkeyUpEvents(player, enemy);     // Load player and enemy KeyUp events.

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
    background.update();
    shop.update();

    if (player.health > 0){ // Allow movement and attacks only if player is alive.
        player.update();
    } else {    // If is not alive, then only draw the player on the screen.
        player.animateFrames()
        player.draw();
    }

    if (enemy.health > 0){
        enemy.update();
    } else {
        enemy.animateFrames()
        enemy.draw();
    }
    
    player.velocity.x = 0;  // Reset the "x" velocity of the player each frame. So it doesn't "slide" every frame.
    enemy.velocity.x = 0;   // Same for the enemy.

    if (!player.movement()) {  // If player is not running, set his sprite to idle.
        player.switchSprite('idle');
    }

    if (!enemy.movement()) {    // Enemy movement in the canvas.
        enemy.switchSprite('idle')
    }

    // Player is attacking and tries to hit his enemy.
    if (isHitting({ rectangle1: player, rectangle2: enemy }) && player.isAttacking && player.health > 0) {
        player.isAttacking = false; // Reset the attack.
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    // Enemy is attacking and tries to hit the player.
    if (isHitting({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking && enemy.health > 0) {
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
        enemy.health = 0;
        enemy.switchSprite('death');
    } else {
        document.querySelector('#result').innerHTML = 'Enemy won!'; // Enemy's health is greater.
        player.health = 0;
        player.switchSprite('death');
    }
}