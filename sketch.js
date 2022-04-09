const playerWidth = 32;
const playerHeight = 32;

var population = 250;
var players = [];
var obstaclePositions = [544, 576, 608, 640, 672, 704, 736];
var obstacles = [];
const maxNumberOfObstacles = 8;
var lives = 1;
var displayLives = [];
var trees = [];
const maxNumberOfTrees = 25;

var alivePlayers = 0;
var bestScore = 0;
var inteligence = true;
var debugLives = 0;
var uiFont;
var uiFontSize = 32;
var simpleGraphics = false;
var counter = 0;
var runSpeed = 1;
var grass1, grass2;     // two grass objects are needed for the infinite grass effect
var leftPressed = false;
var rightPressed = false;
var activePlayer = null;

function preload() {
    uiFont = "monospace";
}

function generatePlayerX() {
    let playerX = obstaclePositions[Math.floor(random(0, obstaclePositions.length))];
    return playerX;
}
function saveBest() {       // saves the best player to file
    if (bestPlayerSoFar) {
        if (bestPlayerSoFar.score > getBestPlayer().score)
            saveJSON(bestPlayerSoFar.brain, filename);
        else
            saveJSON(getBestPlayer().brain, filename);
    }
}

function loadBest(x, y) {   // loads the best player from file
    let playerBrain = NeuralNetwork.deserialize(brainJSON);
    activePlayer = new Player(x, y, playerBrain);
}

function keyPressed() {
    
}
document.addEventListener('keydown', logKey);
document.addEventListener('keyup', logKey_up);

function logKey(e) {
    if(e.code == "ArrowLeft" && inteligence == false){
        leftPressed = true;
    }
    if(e.code == "ArrowRight" && inteligence == false){
        rightPressed = true
    }
}
function logKey_up(e) {
    if(e.code == "ArrowLeft"){
        leftPressed = false;
    }
    if(e.code == "ArrowRight"){
        rightPressed = false
    }
}
function setup() {
    createCanvas(1280, 720);
    for (let i = 0; i < population; i++) {
       players[i] = new Player(generatePlayerX(), height - 64);
    }

    grass1 = new Grass(0, -height);
    grass2 = new Grass(0, 0);
    // set text characteristics
    textFont(uiFont);
    textSize(uiFontSize);    
}

function showUI() {
    fill(255);    
    textAlign(LEFT);
    if (!activePlayer && inteligence == true) {
        text("generation: " + generation, 10, 38);
        text("score: " + bestScore, 10, 74);
    
        text("remaining: " + alivePlayers + "/" + population, 10, 110);
    } else if(!activePlayer && inteligence == false){
        text("lives: " + displayLives.join(""), 10, 38);
        text("score: " + bestScore, 10, 74);
        text("tick: " + debugLives, 10, 110);
    } else {
        text("score: " + activePlayer.score, 10, 38);
    }
}
function drawHearts(){
    displayLives = []
    for(var i = 0; i < debugLives;i++){
        displayLives[displayLives.length] = "❤️";
    }
}
function draw() { 
    
    for (let n = 0; n < runSpeed; n++) {
        
        if (counter % 25 == 0) {     // create new obstacles
            let randIndex = Math.floor(random(0, obstaclePositions.length));      
            
            obstacles.push(new Obstacle(obstaclePositions[randIndex], -75));
            trees.push(new Tree(400, -150));
            trees.push(new Tree(800, -150));
        }
        counter++;
        if(rightPressed == true){
            for (let i = 0; i < players.length; i++) {
                players[i].goRight();
            }
        }
        if(inteligence == false){
            
            population = 1;
        } else{
            population = con.population
        }
        if(leftPressed == true){
            for (let i = 0; i < players.length; i++) {
                players[i].goLeft();
            }
        }
        if (obstacles.length > maxNumberOfObstacles)
            obstacles.splice(0, 1);

        if (trees.length > maxNumberOfTrees)
            trees.splice(0, 1);

        for (let i = 0; i < obstacles.length; i++) {
            obstacles[i].update();
        }

        if (!activePlayer) {
            for (let i = 0; i < players.length; i++) {
                players[i].update();
            }
            
            alivePlayers = 0;
            bestScore = 0;
            for (let i = 0; i < players.length; i++) {
                if (players[i].alive)
                    alivePlayers++;

                if (players[i].score > bestScore)
                    bestScore = players[i].score;
            }

            if (alivePlayers == 0 && inteligence == true){
                nextGeneration();
            }if(alivePlayers == 0 && inteligence == false){
                nextmanualGeneration();
            }
        } else {
            activePlayer.update();
        }
    }

    // all the drawing
    background(51, 204, 51);
    if (!simpleGraphics) {
        grass1.update();
        grass1.show();
        grass2.update();
        grass2.show();
        if (grass1.y == 0) {
            grass2.y = -height;
        } else if (grass2.y == 0) {
            grass1.y = -height;
        }
    }

    stroke(0);
    fill(200);
    rect(obstaclePositions[0], 0, obstaclePositions[obstaclePositions.length - 1] - obstaclePositions[0] + playerWidth, height);
    
    for (let i = 0; i < obstacles.length; i++) {        
        obstacles[i].show();
    }
    
    for (let i = 0; i < trees.length; i++) {
        trees[i].update();                
        trees[i].show();
    }

    if (!activePlayer) {
        for (let i = 0; i < players.length; i++) {        
            players[i].show();    
        }
    } else {
        activePlayer.show();
    }

    showUI();
}
