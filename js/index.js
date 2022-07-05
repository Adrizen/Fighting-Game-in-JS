import { player, enemy } from './Fighter.js'
import { background, shop } from './Sprite.js';
import { loadKeyDownEvents, loadkeyUpEvents } from './Keys.js'

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
let timer = 30; // Game timer.
let timerID;    // Used to clearTimeout.
let gameEnded = false;  // Flag to determinate whenever game's has ended or not.
// TODO: Reset button.

loadKeyDownEvents(player, enemy);   // Load player and enemy KeyDown events.
loadkeyUpEvents(player, enemy);     // Load player and enemy KeyUp events.

const onePlayer = document.getElementById('1player');
const twoPlayers = document.getElementById('2players');
onePlayer.addEventListener("click", () => {
    intervalBot();
    startGame();
});
twoPlayers.addEventListener("click", () => {
    startGame();
});

// Main function to start the game after the menu is dismissed.
function startGame() {
    document.getElementById('menu').style.display = "none"; // Hide the menu.
    c.fillRect(0, 0, canvas.width, canvas.height);          // Simulate loading with black screen lol
    setTimeout(() => {
    animate();          // Start recursive animate function.
    decreaseTimer();    // Start the timer countdown.
    document.getElementById('hud').style.display = "flex";  // Show the hud.
    }, 1000)    // Wait 1 sec to start the game.
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

// Animate the sprites every frame.
function animate() {
    window.requestAnimationFrame(animate);  // Set this as a recursive function.
    background.update();
    shop.update();
    update(player);
    update(enemy);
    player.velocity.x = 0;  // Reset the "x" velocity of the player each frame. So it doesn't "slide" every frame.
    enemy.velocity.x = 0;   // Same for the enemy.

    if (!player.movement() && !player.isAttacking && !player.isTakingHit) {  // If player is not running, set his sprite to idle.
        player.switchSprite('idle');
    }

    if (!enemy.movement() && !enemy.isAttacking && !enemy.isTakingHit) {    // If enemy is not running, set his sprite to idle.
        enemy.switchSprite('idle')  // TODO: Disable enemy movement for arrow keys when playing VS IA.
    }

    // Check if a fighter is attacking.
    player.attack(enemy);
    enemy.attack(player);

    if (!gameEnded) {
        if (enemy.health <= 0 || player.health <= 0) {
            determineWinner({ player, enemy, timerID });
        }
    }
}

// Manages the behavior of the bot, his movement is completly random right now.
function intervalBot() {
    setInterval(botMoves, 1000);    // Evaluates if moving every 1 second.
    setInterval(botAttack, 1000);   // Evaluates if attacking every 1 second.
}

// Bot moves randomly: a 45% chances of going forward, another 45% of going backward and a 10% of not moving. This every 1 second.
// The period of time the bot is moving is random too: 'randomFloat * 4000'
function botMoves() {
    let randomFloat = Math.random();
    //console.log(randomFloat)
    if (randomFloat < 0.45) {   // Forwards.
        window.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowLeft' }))
        setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent('keyup', { 'key': 'ArrowLeft' }))
        }, randomFloat * 3000)
    } else if (randomFloat < 0.85) {    // Backwards.
        window.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowRight' }))
        setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent('keyup', { 'key': 'ArrowRight' }))
        }, randomFloat * 3000)
    }
}

// Bot attacks the player if in range and his cooldown is available.
function botAttack() {
    if (enemy.attackCooldown && enemy.isHitting(player)) {
        enemy.isAttacking = true;
        enemy.attack(player);
        setTimeout(() => { enemy.isAttacking = false; }, 1000)
    }
}

// Fighter is alive can perform any action, if it's not then only get drawn.
function update(fighter) {
    if (fighter.health > 0) {   // Allow movement and attacks only if player is alive.
        fighter.update();
    } else {    // If is not alive, then only draw the player on the screen.
        fighter.animateFrames()
        fighter.draw();
    }
}

function determineWinner({ player, enemy, timerID }) {
    clearTimeout(timerID);  // Stop the timer, the game ended.
    gameEnded = true;
    document.querySelector('#result').style.display = 'flex'    // Change from 'none' to 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#result').innerHTML = 'Tie!';   // Player's and enemy's health are the same.
    } else if (player.health > enemy.health) {
        document.querySelector('#result').innerHTML = 'Player 1 won!'; // Player's health is greater.
        enemy.health = 0;
        enemy.switchSprite('death');
    } else {
        document.querySelector('#result').innerHTML = 'Player 2 won!'; // Enemy's health is greater.
        player.health = 0;
        player.switchSprite('death');
    }
}