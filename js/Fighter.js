import Sprite from './Sprite.js'
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Canvas' dimension.
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.9;

class Fighter extends Sprite{
    constructor({ position, velocity, color, offset }) {
        super({position});
        this.height = 150;
        this.width = 50;
        this.velocity = velocity;
        this.color = color;
        this.moveFactor = 6;    // Determinates how fast this sprite can move due to user input.
        this.lastKey;           // Last key pressed by this sprite.
        this.inTheAir = false;  // Avoid the sprite jump if it's already in the air.
        this.isAttacking = false;
        this.health = 100;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offSet: offset, // AttackBox's offset.
            width: 100,
            height: 50
        }
    }

    // Draw the sprites in the canvas.
    draw() {
        c.fillStyle = this.color;   // Fill the sprite with his color.
        c.fillRect(this.position.x, this.position.y, this.width, this.height);  // Actually put the sprite in the canvas.

        if (this.isAttacking) {
        // Attack box.
        c.fillStyle = 'green'
        c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100)
    }

    // Update the sprite every frame.
    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offSet.x;    // Update attack box position to follow the sprite.
        this.attackBox.position.y = this.position.y;    // Update attack box position to follow the sprite.
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
export const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    color: 'blue'
});

// Create enemy sprite.
export const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -50,
        y: 0
    },
    color: 'red'
});

