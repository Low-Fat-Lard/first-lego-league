class Tree {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 3;   
        this.col = color(0, 255, 0); 
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
            rect(this.x, this.y, 32, 32);
        } else {
            textSize(50);
            text('🌳', this.x, this.y);}
        }
    }
}
