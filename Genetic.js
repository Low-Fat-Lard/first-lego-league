var generation = 1;
let tempPlayers = [];
var bestPlayerSoFar = null;

function getBestPlayer() {
    let bestPlayer;

    // get the best player from this generation    
    for (let i = 0; i < population; i++) {
        if (!bestPlayer || players[i].score > bestPlayer.score) {
            bestPlayer = players[i];  // find the player with the highest score
        }
    }

    return bestPlayer;
}

function nextGeneration() {
    let bestPlayer = getBestPlayer();
    
    if (!bestPlayerSoFar || bestPlayer.score > bestPlayerSoFar.score)   // we store the best player across all generations
        bestPlayerSoFar = bestPlayer;
    
    generation++;       // increment the generation number

    console.log("new generation: " + generation + " (best score: " + bestScore + ")");
    
    tempPlayers = [];
    for (let i = 0; i < population; i++) {
        tempPlayers.push(players[i]);
    }
    calculateFitness();

    for (let i = 0; i < population; i++) {
        players[i] = pickOne();
    } 
}

function pickOne() {
    var index = 0;
    var r = random(1);

    while (r > 0) {
        r = r - tempPlayers[index].fitness;
        index++;
    }
    index--;

    let player = tempPlayers[index];
    let child = new Player(generatePlayerX(), height - 64, player.brain);
    child.mutate(0.1);
    return child;
}

function calculateFitness() {
    let sum = 0;
    for (let player of tempPlayers) {
        sum += (player.score * player.score);
    }

    for (let player of tempPlayers) {
        player.fitness = (player.score * player.score) / sum;        
    }
}