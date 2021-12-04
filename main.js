var gameProperties = {
    started: false,
    width: 20,
    height: 20,
    score: 0,
    highScore: 0,
    gameOver: false,
    closedPositions: []
}

var snake = {
    element: document.getElementById('snake'),
    length: 1,
    direction: 'right',
    row: 10,
    col: 10,
    prevMoves: [[5,5]]
}

var clones = Array.from(document.getElementsByClassName('clone'));

var food = {
    element: document.getElementById('food'),
    row: 10,
    col: 15,
}

var highScoreElem = document.getElementById('highScore');
var scoreElem = document.getElementById('currScore');

var moved = false;

var start = Date.now();
var delta;
setInterval(function() { //timer
    delta = Date.now() - start; // milliseconds elapsed since start

    //code to update with each tick if game is started


    //food eaten
    if ((snake.row == food.row) && (snake.col == food.col)) {
        snake.length++;
        gameProperties.score++;
        newClone(snake.length - 1);

        scoreElem.innerHTML = "Current: " + (gameProperties.score);

        var col = Math.floor(Math.random() * 9) + 1;
        var row = Math.floor(Math.random() * 9) + 1;

        snake.prevMoves.forEach(position => {
            while (row == position[0] && 0<row<=gameProperties.width) {
                row++;
                if (row <= 0 || row > gameProperties.width) {
                    row = 1;
                }
            }
            while (col == position[1] && 0<row<=gameProperties.height) {
                col++;
                if (col <= 0 || col > gameProperties.width) {
                    col = 1;
                }
            }
        });
        food.row = row;
        food.col = col;
    }

    //next move
    if (gameProperties.started == true) {

        if (snake.direction == 'right') {
            snake.col++;
        } else if (snake.direction == 'left') {
            snake.col--;
        } else if (snake.direction == 'up') {
            snake.row--;
        } else if (snake.direction == 'down') {
            snake.row++;
        }

        snake.prevMoves.unshift([snake.row, snake.col]);

        if (snake.prevMoves.length > snake.length) {
            snake.prevMoves.pop();
        }
    }

    //set snake and food pos

    clones.forEach(element => {
        var i = element.getAttribute('data-value');

        element.style.gridArea = `${snake.prevMoves[i][0]} / ${snake.prevMoves[i][1]}`;
    });

    snake.element.style.gridArea = `${snake.row} / ${snake.col}`;

    food.element.style.gridArea = `${food.row} / ${food.col}`;

    moved = false;


    //lose conditions
    if (snake.row > gameProperties.width || snake.col > gameProperties.height || snake.row < 0 || snake.col < 0) {
        gameProperties.gameOver = true;
        reset();
    }

    for (var i = 3; i < snake.prevMoves.length; i++) {
        if (snake.prevMoves.length > 3 && snake.prevMoves[i][0] == snake.row && snake.prevMoves[i][1] == snake.col) {
            gameProperties.gameOver = true;
            reset();
        }
    }


    //console.log(Math.floor(delta / 1000));//in seconds
}, 1000/5); // currently 15 fps

function newClone(num) {
    var parent = document.getElementById("gameBoard");

    var clone = document.createElement("DIV");
    var cloneClass = document.createAttribute("class");
    cloneClass.value = "clone";
    clone.setAttributeNode(cloneClass);
    var cloneVal = document.createAttribute("data-value");
    cloneVal.value = `${num}`;
    clone.setAttributeNode(cloneVal);

    parent.appendChild(clone.cloneNode(true));
    
    clones = Array.from(document.getElementsByClassName('clone'));
}

//reset game
function reset() {
    gameProperties.started = false;

    if (gameProperties.score > gameProperties.highScore) {
        highScoreElem.innerHTML = "High: " + (gameProperties.score);
    }
    scoreElem.innerHTML = "Current: 0";

    snake.col = 10, snake.row = 10;
    snake.length = 1;
    snake.direction = 'right';

    clones.forEach(clone => {
        clone.remove();
    });

    food.col = 15, food.row = 10;

    gameProperties.gameOver = false;
}


document.addEventListener('keydown', function(e) {
    var keyPressed = e.code; 

    if (keyPressed == "Space" && gameProperties.started == false) {
        gameProperties.started = true;
    } else if (keyPressed == "Space" && gameProperties.started == true) {
        reset();
    }

    if (moved == false) {
        if ((keyPressed == "ArrowUp" || keyPressed == "KeyW") && snake.direction != 'down') {
            snake.direction = 'up';
        } else if ((keyPressed == "ArrowDown" || keyPressed == "KeyS") && snake.direction != 'up') {
            snake.direction = 'down';
        } else if ((keyPressed == "ArrowLeft" || keyPressed == "KeyA") && snake.direction != 'right') {
            snake.direction = 'left';
        } else if ((keyPressed == "ArrowRight" || keyPressed == "KeyD") && snake.direction != 'left') {
            snake.direction = 'right';
        }
    
        moved = true;
    }

});
