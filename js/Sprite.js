const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

class Sprite {
    constructor({ position, imageSrc }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    // Draw the sprites in the canvas.
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
    }

    // Update the sprite every frame.
    update() {
        this.draw()
    }
}

export const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: '/assets/img/background.png'
})


export default Sprite;