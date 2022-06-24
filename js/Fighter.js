import Sprite from './Sprite.js'
const canvas = document.querySelector('canvas');

// Canvas' dimension.
canvas.width = 1024;    // TODO: Hacer más grande el canvas?
canvas.height = 576;
const gravity = 1;

class Fighter extends Sprite {
    constructor({ position, offset, imageSrc, scale, maxFrames, holdFrames, offsetFrame = { x: 0, y: 0 }, sprites, keys }) {
        super({ position, imageSrc, scale, maxFrames, holdFrames, offsetFrame });
        this.height = 150;
        this.width = 50;
        this.velocity = { x: 0, y: 0 } // Initial velocity is 0 in both axis.
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
        };  // End attack box.
        this.sprites = sprites;
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
        this.keys = keys;
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => { this.isAttacking = false }, 100)
    }

    movement() {
        // This determinates if the player moves to the left or to the right. It wont let the player leave the canvas at the sides.
        let running = false;    // Determinate if player is running or not.
        if (Object.values(this.keys)[0].pressed && (this.lastKey === 'a' || this.lastKey === 'ArrowLeft') && this.position.x >= 0) {
            this.velocity.x = -this.moveFactor; // 'a' is pressed and it's the last pressed key, then move to the left.
            this.switchSprite('run')
            running = true;
        } else if (Object.values(this.keys)[1].pressed && (this.lastKey === 'd' || this.lastKey === 'ArrowRight') && this.position.x <= (canvas.width - this.width)) {
            this.velocity.x = this.moveFactor;  // 'd' is pressed and it's the last pressed key, then move to the right.
            this.switchSprite('run')
            running = true;
        }
        return running;
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
            this.velocity.y += gravity; // Add gravity speed to the sprite every frame to slow it down.
            if (this.velocity.y > 0) {  // Sprite's y velocity is positive, it's falling.
                this.switchSprite('fall');
            } else {    // Sprite is still going up.
                this.inTheAir = true;   // Sprite is in the air and can't jump againg.
                this.switchSprite('jump');
            }
        }
    }

    switchSprite(sprite) {
        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image && !this.inTheAir) {
                    console.log("idle")
                    this.image = this.sprites.idle.image;
                    this.maxFrames = this.sprites.idle.maxFrames;
                    this.currentFrame = 0;  // To avoid flickering when changing between different sprites.
                }
                break;
            case 'run':
                console.log("correr")
                this.image = this.sprites.run.image;
                this.maxFrames = this.sprites.run.maxFrames;

                break;
            case 'jump':
                console.log("saltar")
                this.image = this.sprites.jump.image;
                this.maxFrames = this.sprites.jump.maxFrames;
                this.currentFrame = 0;
                break;
            case 'fall':
                console.log("caer")
                this.image = this.sprites.fall.image;
                this.maxFrames = this.sprites.fall.maxFrames;
                this.currentFrame = 0;
                break;
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
    holdFrames: 4,
    offsetFrame: { x: 215, y: 154 },
    sprites: {  // Sprites for different animations.
        idle: {
            imageSrc: '/assets/img/samuraiMack/Idle.png',
            maxFrames: 8,
        },
        run: {
            imageSrc: '/assets/img/samuraiMack/Run.png',
            maxFrames: 8,
        },
        jump: {
            imageSrc: '/assets/img/samuraiMack/Jump.png',
            maxFrames: 2,
        },
        fall: {
            imageSrc: '/assets/img/samuraiMack/Fall.png',
            maxFrames: 2,
        },
        death: {
            imageSrc: '/assets/img/samuraiMack/Death.png',
            maxFrames: 6,
        },
        attack1: {
            imageSrc: '/assets/img/samuraiMack/Attack1.png',
            maxFrames: 6,
        },
        takeHit: {
            imageSrc: '/assets/img/samuraiMack/Take hit.png',
            maxFrames: 4,
        }

    },
    keys: {
        'a': {
            pressed: false
        },
        'd': {
            pressed: false
        },
        'w': {
            pressed: false
        },
        ' ': {
            pressed: false
        }

    }
})

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
    holdFrames: 6,
    offsetFrame: { x: 215, y: 172 },
    sprites: {   // Sprites for different animations.
        idle: {
            imageSrc: '/assets/img/kenji/Idle.png',
            maxFrames: 4,
        },
        run: {
            imageSrc: '/assets/img/kenji/Run.png',
            maxFrames: 8,
        },
        jump: {
            imageSrc: '/assets/img/kenji/Jump.png',
            maxFrames: 2,
        },
        fall: {
            imageSrc: '/assets/img/kenji/Fall.png',
            maxFrames: 2,
        },
        death: {
            imageSrc: '/assets/img/kenji/Death.png',
            maxFrames: 7,
        },
        attack1: {
            imageSrc: '/assets/img/kenji/Attack1.png',
            maxFrames: 4,
        },
        takeHit: {
            imageSrc: '/assets/img/kenji/Take hit.png',
            maxFrames: 3,
        }
    },
    keys: {
        'ArrowLeft': {
            pressed: false
        },
        'ArrowRight': {
            pressed: false
        },
        'ArrowUp': {
            pressed: false
        },
        'Control': {
            pressed: false
        }
    }
});

