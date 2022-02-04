class Grass {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 3;
        this.width = width;
        this.height = height;
        this.img = loadImage("graphics/grass.png");
    }

    update() {
        this.x += this.velX;
        this.y += this.velY;
    }

    show() {
        image(this.img, this.x, this.y, this.width, this.height);
    }
}