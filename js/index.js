const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Canvas' dimension.
canvas.width = 1024;
canvas.height = 576;


const gravity = 0.2;

class Sprite {
    constructor({ position, velocity, color }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.velocity = velocity;
        this.color = color;
        this.moveFactor = 3;    // Determinates how fast this sprite can move due to user input.
        this.lastKey;   // Last key pressed by this sprite.
        this.inTheAir = false;  // Avoid the sprite jump if it's already in the air.
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 50
        }
    }

    // Draw the sprite in the canvas.
    draw() {
        c.fillStyle = this.color;   // Fill the sprite with his color.
        c.fillRect(this.position.x, this.position.y, this.width, this.height);  // Actually put the sprite in the canvas.
    }

    // Update the sprite every frame.
    update() {
        this.draw();
        this.position.y += this.velocity.y;     // Move the sprite in 'y' direction his 'y' velocity.
        this.position.x += this.velocity.x;    // Move the sprite in 'x' direction his 'x' velocity.

        // If the sprite is in the air, then it gets affected by gravity.
        if (this.position.y + this.height + this.velocity.y >= canvas.height) { // Sprite reach the bottom of the canvas.
            this.velocity.y = 0;
            this.inTheAir = false;  // Sprite touch the bottom of the canvas, is not in the air and can jump again.
        } else {    // Sprite is in the air, gets affected by gravity.
            this.velocity.y += gravity;
            this.inTheAir = true;   // Sprite is in the air and can't jump againg.
        }
    }
}

// Create player sprite.
const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue'
});

// Create enemy sprite.
const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red'
});

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

// Animate the sprites every frame.
function animate() {
    window.requestAnimationFrame(animate);  // Set this as a recursive function.
    c.fillStyle = 'black'   // Set the canvas background to black.
    c.fillRect(0, 0, canvas.width, canvas.height);  // Fill the canvas.
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

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
            if (!player.inTheAir) {  // Only can jump if it's not in the air.
                player.velocity.y = -10;
            }
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
                enemy.velocity.y = -10;
            }
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