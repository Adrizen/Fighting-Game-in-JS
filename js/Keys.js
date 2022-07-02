export const keys = {
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
        event.preventDefault(); // Prevent any keys' default behaviour i.e using the arrow keys to navigate the page.
        switch (event.key) {
            // Player keys.
            case 'd':
                player.keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                player.keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                if (!player.inTheAir) {  // Can only jump if it's not in the air.
                    player.velocity.y = -player.moveFactor * 4;
                }
                break;
            case ' ':   // Player attack with space bar.
                player.isAttacking = true;
                player.lastKey = ' ';
                break;


            // Enemy keys.
            case 'ArrowRight':
                enemy.keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                enemy.keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                if (!enemy.inTheAir) {   // Only can jump if it's not in the air.
                    enemy.velocity.y = -enemy.moveFactor * 4;
                }
                break;
            case 'Control': // Enemy attack with control key.
                enemy.isAttacking = true;
                enemy.lastKey = 'Control'
                break;
        }
    });
}

export function loadkeyUpEvents(player, enemy) {
    // Whenever a key is lifted.
    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            // Player.
            case 'd':
                player.keys.d.pressed = false;
                break;
            case 'a':
                player.keys.a.pressed = false;
                break;
            // Enemy
            case 'ArrowRight':
                enemy.keys.ArrowRight.pressed = false;
                break;
            case 'ArrowLeft':
                enemy.keys.ArrowLeft.pressed = false;
                break;
        }
    });
}
