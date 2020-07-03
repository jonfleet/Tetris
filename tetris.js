document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const easyBtn = document.querySelector('#difficulty-button-easy')
    const medBtn = document.querySelector('#difficulty-button-medium')
    const hardBtn = document.querySelector('#difficulty-button-hard')

    const width = 10
    let nextRandom = 0;
    let timerId;
    let score = 0;
    let speed = 1000
    

    const lTetromino =[
        [0, width, width*2, 1],
        [0, width, width+1, width+2],
        [1, width+1, width*2+1, width*2],
        [0, 1, 2, width+2]
    ]
    const tTetromino = [
        [width, width+1, 1, width+2],
        [width*2+1, width+1, 1, width+2],
        [width, width+1, width*2+1, width+2],
        [width*2+1, width+1, 1, width]

    ]
    const zTetromino = [
        [0,1,width+1, width+2],
        [1, width+1, width, width*2],
        [0,1,width+1, width+2],
        [1, width+1, width, width*2]
    ]
    
    const oTetromino = [
        [0 , 1, width, width+1],
        [0 , 1, width, width+1],
        [0 , 1, width, width+1],
        [0 , 1, width, width+1]
    ]
    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const colors = [
        "red",
        "blue",
        "brown",
        "green",
        "purple"
    ]
    const theTetrominoes = [lTetromino, tTetromino, zTetromino, oTetromino, iTetromino]


    // Generate a Random Starting Position Between 1 and 7
    let currentPosition = 6
    

    // Generate the Tetrominoes randomly
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let rotateIndex = 0;
    let current = theTetrominoes[random][rotateIndex]
    let next =  theTetrominoes[random][rotateIndex]
    
    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }
    
    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''

        })
    }

    // User Controls

    function control (e){
        if(e.keyCode === 37){
            moveLeft()
        }
        if(e.keyCode === 39){
            moveRight()
        }
        if(e.keyCode === 38){
            rotate()
        }
        if(e.keyCode === 40){
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    // make the tetromino move down every second

    function moveDown(){
        undraw()
        currentPosition += width
        // gameOver()
        draw()
        freeze()
    }

    function freeze(){
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][0]
            displaySquares()
            currentPosition = 4
            draw()
            addScore()
            gameOver()
        }
    }

    // Tetrimino movement rules
    function moveLeft(){
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge) {
            currentPosition = currentPosition - 1
        }
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1
        }
        draw()
    }
    function moveRight(){
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1)
        if(!isAtRightEdge){
            currentPosition += 1
        } 
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1
        }
        draw()
    }

    function rotate(){
        undraw()
        rotateIndex++
        if(rotateIndex === current.length){
            rotateIndex = 0;
        }
        current = theTetrominoes[random][rotateIndex]
        draw()
    }

    const miniGrid = document.querySelectorAll('.miniGrid div')
    const displayWidth = 5
    let displayIndex = 6

    const upNextTetrominoes =[
        [displayWidth*2+1, displayWidth*2+2,displayWidth*2, displayWidth +2], // l
        [displayWidth*2+1, displayWidth*2+2, displayWidth+1, displayWidth*2],// t
        [displayWidth, displayWidth+ 1, displayWidth*2+1, displayWidth*2+2],// z
        [displayWidth,displayWidth+ 1, displayWidth*2, displayWidth*2+1],// o
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]// i
    ]
    function displaySquares(){
        miniGrid.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach( index  => {
            miniGrid[displayIndex + index].classList.add('tetromino')
            miniGrid[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }
    // displaySquares()
    // Add functionality to the Button 

    startBtn.addEventListener('click', () =>{
        if(timerId){
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displaySquares()
            timerId = setInterval(moveDown, speed)
        }
    })
    easyBtn.addEventListener('click', () => {
        clearInterval(timerId)
        speed = 1500;
        console.log(speed)
        timerId = setInterval(moveDown, speed)
    })

    medBtn.addEventListener('click', () => {
        clearInterval(timerId)
        speed = 1000;
        console.log(speed)
        timerId = setInterval(moveDown, speed)
    })

    hardBtn.addEventListener('click', () => {
        clearInterval(timerId)
        speed = 200
        console.log(speed)
        timerId = setInterval(moveDown, speed)
    })
    
    
    // Add Score 
    function addScore(){
        for(let i = 0; i < 199; i+= width){
            let row = [i,i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10;
                ScoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i,width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
                
            }
        }
    }

    function gameOver(){
        // let row = [0,1,2,3,4,5,6,7,8,9]
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            ScoreDisplay.innerHTML = "Game Over"
            clearInterval(timerId)
        }
    }

})

