import Fighter from './Fighter.js'

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

class Sprite {
    constructor({ position, imageSrc, scale = 1, maxFrames = 1, holdFrames = 30, offsetFrame = { x: 0, y: 0 } }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.maxFrames = maxFrames;     // Maximum image's frames.
        this.currentFrame = 0;          // Start of the animation.
        this.elapsedFrames = 0;         // How many frames have passed. Used for a smoother animation.
        this.holdFrames = holdFrames;   // How many frames to wait until update the image with another frame. Used for a smoother animation.
        this.offsetFrame = offsetFrame;
    }

    // Draw the sprites in the canvas.
    draw() {
        // Draw the image in the canvas with his crop properties
        c.drawImage(this.image, this.currentFrame * (this.image.width / this.maxFrames), 0, this.image.width / this.maxFrames,
            this.image.height, this.position.x - this.offsetFrame.x, this.position.y - this.offsetFrame.y,
            (this.image.width / this.maxFrames) * this.scale, this.image.height * this.scale);
    }

    animateFrames() {
        this.elapsedFrames++;
        // Update the current frame only if we waited holdFrames.
        if (this.elapsedFrames % this.holdFrames === 0) {
            if (this.currentFrame < this.maxFrames - 1) {
                this.currentFrame++;    // Jump to the next frame.
            } else {
                if (this instanceof Fighter) { 
                    if (this.health > 0) {  // This avoids resetting death animation.
                        this.currentFrame = 0;  // Reset the current fighter frame to the beginning of the animation.
                    }
                } else {
                    this.currentFrame = 0;  // Reset the current sprite frame to the beginning of the animation.
                }
            }
        }
    }

    // Update the sprite every frame.
    update() {
        this.draw();
        this.animateFrames();
    }
}

export const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: '/assets/img/background.png'
})

export const shop = new Sprite({
    position: {
        x: 620,
        y: 128
    },
    imageSrc: '/assets/img/shop.png',
    scale: 2.75,
    maxFrames: 6,
    holdFrames: 9
})

export default Sprite;