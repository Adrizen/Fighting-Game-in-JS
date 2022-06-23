import Sprite from './Sprite.js'
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Canvas' dimension.
canvas.width = 1024;    // TODO: Quizás mejorar esto para no repetir code.
canvas.height = 576;

const gravity = 0.9;

class Fighter extends Sprite{
    constructor({ position, offset, imageSrc, scale, maxFrames, holdFrames, offsetFrame = {x: 0, y: 0} }) {
        super({position, imageSrc, scale, maxFrames, holdFrames, offsetFrame});
        this.height = 150;
        this.width = 50;
        this.velocity = {x: 0, y:0} // Initial velocity is 0 in both axis.
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

    attack() {
        this.isAttacking = true;
        setTimeout(() => { this.isAttacking = false }, 100)
    }

    // Update the sprite every frame.
    update() {
        super.update();
        this.attackBox.position.x = this.position.x + this.attackBox.offSet.x;    // Update attack box position to follow the sprite.
        this.attackBox.position.y = this.position.y;    // Update attack box position to follow the sprite.
        this.position.y += this.velocity.y;     // Move the sprite in 'y' direction his 'y' velocity.
        this.position.x += this.velocity.x;    // Move the sprite in 'x' direction his 'x' velocity.
        
        // If the sprite is in the air, then it gets affected by gravity.
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 95) { // Sprite reach the bottom of the canvas.
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
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: '/assets/img/samuraiMack/Idle.png',
    scale: 2.5,
    maxFrames: 8,
    holdFrames: 7,
    offsetFrame: {x: 215, y: 154}
});

// Create enemy sprite.
export const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: '/assets/img/kenji/Idle.png',
    scale: 2.5,
    maxFrames: 4,
    holdFrames: 10,
    offsetFrame: {x: 215, y: 172}
});

