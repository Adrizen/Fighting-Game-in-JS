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
    }

    // Draw the sprite in the canvas.
    draw() {
        c.fillStyle = this.color;   // Fill the sprite with his color.
        c.fillRect(this.position.x, this.position.y, this.width, this.height);  // Actually put the sprite in the canvas.
    }

    // Update the sprite every frame.
    update(){
        this.draw();
        this.position.y += this.velocity.y; // Move the sprite in 'y' direction his 'y' velocity.

        // If sprite is in the air, then it gets affected by gravity.
        if (this.position.y + this.height + this.velocity.y >= canvas.height ){ // Sprite reach the bottom of the canvas.
            this.velocity.y = 0;
        } else {    // Sprite is in the air, gets affected by gravity.
            this.velocity.y += gravity;
        }
    }
}

// Create plater sprite.
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

// Animate the sprites every frame.
function animate() {
    window.requestAnimationFrame(animate);  // Set this as a recursive function.
    c.fillStyle = 'black'   // Set the canvas background to black.
    c.fillRect(0, 0, canvas.width, canvas.height);  // Fill the canvas.
    player.update();
    enemy.update();
}

animate();