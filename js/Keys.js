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

export function loadKeyDownEvents(player, enemy) {
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
}

export function loadkeyUpEvents() {
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
}

export function playerMovement(player, canvas) {
    // This determinates if the player moves to the left or to the right. It wont let the player leave the canvas at the sides.
    if (keys.a.pressed && player.lastKey === 'a' && player.position.x >= 0) {
        player.velocity.x = -player.moveFactor; // 'a' is pressed and it's the last pressed key, then move to the left.
    } else if (keys.d.pressed && player.lastKey === 'd' && player.position.x <= (canvas.width - player.width)) {
        player.velocity.x = player.moveFactor;  // 'd' is pressed and it's the last pressed key, then move to the right.
    }
}
// TODO: Refactor this two methods to only one.
export function enemyMovement(enemy, canvas) {
    // This determinates if the enemy moves to the left or to the right. It wont let the enemy leave the canvas at the sides.
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x >= 0) {
        enemy.velocity.x = -enemy.moveFactor; // 'ArrowLeft' is pressed and it's the last pressed key, then move to the left.
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x <= (canvas.width - enemy.width)) {
        enemy.velocity.x = enemy.moveFactor;  // 'ArrowRight' is pressed and it's the last pressed key, then move to the right.
    }
}

