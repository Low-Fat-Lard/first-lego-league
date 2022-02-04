class Player {
    constructor(x, y, brain) {
        this.x = x;
        this.y = y;
        this.minX = obstaclePositions[0];
        this.maxX = obstaclePositions[obstaclePositions.length - 1];
        this.velX = 0;
        this.velY = 0;   
        this.width = playerWidth;
        this.height = playerHeight;
        this.col = color(255);
        this.alive = true;
        this.score = 0;
        this.fitness = 0;
        this.img = loadImage("graphics/playercar.png");
        
        if (brain) {
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetwork(maxNumberOfObstacles * 2 + 1, [20,20,10], 2);
        }
    }
    
    goLeft() {
        if (this.x > this.minX)
            this.x -= 8;
    }

    goRight() {
        if (this.x < this.maxX)
            this.x += 8;
    }

    getClosestObstacle() {
        let closestIndex = 0;
        for (let i = 0; i < obstacles.length; i++) {
            if (Math.abs(obstacles[i].y - this.y) < Math.abs(obstacles[closestIndex].y - this.y) && obstacles[i].y < this.y)
                closestIndex = i;
        }
    
        return obstacles[closestIndex];
    }

    think() {
        // inputs:
        // 0 -> (number of obstacles * 2) - 1: obstacles' X and Y position
        // after that: player's X position
        // after that: player's Y position
        let closestObstacle = this.getClosestObstacle();        
        let inputs = [];
        let t;
        for (t = 0; t < obstacles.length; t += 2) {
            inputs[t] = (obstacles[Math.floor(t/2)].x - this.minX) / (this.maxX - this.minX);
            inputs[t+1] = Math.abs(this.y - obstacles[Math.floor(t/2)].y) / height;
        }
        
        for (let m = t; m < maxNumberOfObstacles * 2; m++) {
            inputs[m] = 0;
        }

        inputs[maxNumberOfObstacles * 2] = (this.x - this.minX) / (this.maxX - this.minX);

        // outputs:
        // 1, 0 - go left
        // 0, 1 - go right
        let output = this.brain.predict(inputs);
        let highestIndex = 0;
        for (let i = 0; i < output.length; i++) {
            if (output[i] > output[highestIndex])
                highestIndex = i;
        }            

        if (highestIndex == 0)
            this.goLeft();
        else if (highestIndex == 1)
            this.goRight();
    }
    
    mutate(mutationRate) {
        this.brain.mutate(mutationRate);
    }

    update() {
        if (this.alive) {
            this.score++;
            this.x += this.velX;
            this.y += this.velY;

            // collision detection with obstacles
            for (let i = 0; i < obstacles.length; i++) {
                if (obstacles[i].collision(this)) {
                    if (!activePlayer)
                        this.alive = false;
                }
            }

            this.think();
        }
    }

    show() {
        if (this.alive) {    
            if (simpleGraphics) {        
                stroke(0);
                fill(this.col);
                rect(this.x, this.y, this.width, this.height);
            } else {
                image(this.img, this.x, this.y, this.width, this.height);
            }
        }
    }
}