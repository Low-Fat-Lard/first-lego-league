class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 5;   
        this.width = playerWidth;
        this.height = playerHeight;
        this.col = color(255, 0, 0); 
    }

    collision(thing) {
        if (thing.x + thing.width > this.x && thing.x < this.x + this.width &&
            thing.y + thing.height > this.y && thing.y < this.y + this.height)
            return true;        
        else
            return false;            
    }

    update() {
        this.x += this.velX;
        this.y += this.velY;
    }

    show() {   
        if (simpleGraphics) {     
            stroke(0);
            fill(this.col);
            rect(this.x, this.y, this.width, this.height);
        } else {
            textSize(this.width);
            text('🚓', this.x, this.y);
        }
    }
}
