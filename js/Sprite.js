const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

class Sprite {
    constructor({ position, imageSrc, scale = 1, maxFrames = 1 }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.maxFrames = maxFrames; // Maximum image's frames.
        this.currentFrame = 0;
        this.elapsedFrames = 0; // How many frames have passed. Used for a smoother animation.
        this.holdFrames = 10;   // How many frames to wait until update the image with another frame. Used for a smoother animation.
    }

    // Draw the sprites in the canvas.
    draw() {
        // Draw the image in the canvas with his crop properties
        c.drawImage(this.image, this.currentFrame * (this.image.width / this.maxFrames), 0, this.image.width / this.maxFrames,
            this.image.height, this.position.x, this.position.y,
            (this.image.width / this.maxFrames) * this.scale, this.image.height * this.scale);
    }

    // Update the sprite every frame.
    update() {
        this.draw();
        this.elapsedFrames++;
        // Update the current frame only if we waited holdFrames.
        if (this.elapsedFrames % this.holdFrames === 0) {
            if (this.currentFrame < this.maxFrames - 1) {
                this.currentFrame++;    // Jump to the next frame.
            } else {
                this.currentFrame = 0;  // Reset the current frame to the beginning of the animation.
            }
        }
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
    maxFrames: 6
})

export default Sprite;