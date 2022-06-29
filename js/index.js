import { player, enemy } from './Fighter.js'
import { background, shop } from './Sprite.js';
import { loadKeyDownEvents, loadkeyUpEvents, isHitting } from './Keys.js'

let timer = 30; // Game timer.
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
    update(player);
    update(enemy);
    player.velocity.x = 0;  // Reset the "x" velocity of the player each frame. So it doesn't "slide" every frame.
    enemy.velocity.x = 0;   // Same for the enemy.

    if (!player.movement() && !player.isAttacking && !player.isTakingHit ) {  // If player is not running, set his sprite to idle.
        player.switchSprite('idle');
    }

    if (!enemy.movement() && !enemy.isAttacking && !enemy.isTakingHit ) {    // Enemy movement in the canvas.
        enemy.switchSprite('idle')
    }

    // Player is attacking and tries to hit the enemy.
    // Make the attack animation. If hit is successful then subtract HP.
    if (player.isAttacking && player.health > 0 && player.attackCooldown) {
        player.attackCooldown = false;
        setTimeout(() => { player.attackCooldown = true }, 1000)
        player.switchSprite('attack')
        if (isHitting({ rectangle1: player, rectangle2: enemy })) {
            //player.attack(enemy); // TODO: Make below a function?
            enemy.health -= 20;
            document.querySelector('#enemyHealth').style.width = enemy.health + '%';
            enemy.switchSprite('takehit');
            enemy.isTakingHit = true;
        }
    }

    // TODO: Merge this shit.
    // Enemy is attacking and tries to hit the player.
    // Make the attack animation. If hit is successful then subtract HP.
    if (enemy.isAttacking && enemy.health > 0 && enemy.attackCooldown) {
        enemy.attackCooldown = false;
        setTimeout(() => { enemy.attackCooldown = true }, 1000)
        enemy.switchSprite('attack')
        if (isHitting({ rectangle1: enemy, rectangle2: player })) {
            //enemy.attack(player);
            player.health -= 20;
            document.querySelector('#playerHealth').style.width = player.health + '%';
            player.switchSprite('takehit');
            player.isTakingHit = true;
        }
    }

    if (!gameEnded) {
        if (enemy.health <= 0 || player.health <= 0) {
            determineWinner({ player, enemy, timerID });
        }
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