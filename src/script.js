//#region WindowControls
function handleWindowControls() {
    document.getElementById("min-button").addEventListener("click", (event) => {
        win.minimize()
    })

    document.getElementById("close-button").addEventListener("click", async (event) => {
        win.close()
    })
}

const remote = require("electron").remote
const win = remote.getCurrentWindow()

document.onreadystatechange = (event) => {
    if (document.readyState == "complete") {
        handleWindowControls()
    }
}

const isPackaged = require("electron-is-packaged").isPackaged

if (!isPackaged) {
    document.addEventListener("keydown", function (e) {
        if (e.which === 123) {
            remote.getCurrentWindow().toggleDevTools()
        } else if (e.which === 116) {
            location.reload()
        }
    })
}
//#endregion

class Board {
    constructor() {
        this.pos = new Array(9)
    }

    set(index, sign) {
        this.pos[index] = sign
    }

    get(index) {
        return this.pos[index]
    }

    isAvailable(index) {
        return this.pos[index] == null
    }

    open() {
        let output = new Array()
        let len = this.pos.length
        for (let i = 0; i < len; i++) {
            if (this.pos[i] == null) output.push(i)
        }
        return output
    }
}

class Game {
    constructor(el) {
        this.board = new Board()
        this.turn = 0
        this.human = 0 // X
        this.ai = 1 // O
        this.el = el

        //#region
        this.X = `<svg width="150" height="150" viewBox="0 0 150 150" fill="#00FF57" xmlns="http://www.w3.org/2000/svg">
                <style>.Rectangle_2_413 {
                    animation: 0.3s linear 0s 1 normal forwards running Rectangle_2_413;
                }
                @keyframes Rectangle_2_413 {
                    0% {
                        opacity: 0;
                    }
                    33.33% {
                        width: 0.01px;
                        opacity: 1;
                    }
                    100% {
                        width: 100px;
                    }
                }.Rectangle_1_563 {
                    animation: 0.3s linear 0s 1 normal forwards running Rectangle_1_563;
                }
                @keyframes Rectangle_1_563 {
                    0% {
                        width: 1px;
                    }
                    66.67% {
                        width: 100px;
                    }
                    100% {
                        width: 100px;
                    }
                }
                </style><g clip-path="url(#clip_0_844)"><g transform="translate(4.29 75.5)">
                <rect width="100" height="15" class="Rectangle_2_413" transform="translate(100.76 40.66) rotate(-135)"/>
                <rect width="100" height="15" class="Rectangle_1_563" transform="translate(30.05 30.05) rotate(-45)"/></g></g>
                <defs><clipPath id="clip_0_844"><rect width="150" height="150"/></clipPath>
                </defs>
                </svg>`
        this.O = `<svg width="150" height="150" id="circle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    viewBox="0 0 100 100" xml:space="preserve" fill="none" stroke="#D23D3D">
                        <circle stroke-width="10" stroke-mitterlimit="0" cx="50" cy="50" r="25" stroke-dasharray="360" transform="rotate(-90 ) translate(-100 0)" >
                            <animate attributeName="stroke-dashoffset" values="360;0" dur="0.8s" repeatCount="1"></animate>
                        </circle>
                    </svg>`
        //#endregion
    }

    start() {
        document.getElementById("ai").classList.remove("active")
        document.getElementById("you").classList.add("active")
        this.turn = 0
        this.board = new Board()
        this.el.innerHTML = `<div class="game-cell"></div>
                            <div class="game-cell"></div>
                            <div class="game-cell"></div>
                            <div class="game-cell"></div>
                            <div class="game-cell"></div>
                            <div class="game-cell"></div>
                            <div class="game-cell"></div>
                            <div class="game-cell"></div>
                            <div class="game-cell"></div>`
        for (let i in this.el.children) {
            this.el.children[i].onclick = () => {
                game.handleInput(i)
            }
        }
    }

    handleInput(index) {
        if (this.turn != this.human) return false
        if (this.board.get(index) == null) {
            this.set(index, this.human)
        }
    }

    set(index, type) {
        if (this.board.get(index) != null) return false
        this.turn = 1 - this.turn
        let scores = ["You won!", "Tie", "AI won!"]
        if (type == 0) {
            document.getElementById("you").classList.remove("active")
            document.getElementById("ai").classList.add("active")
            this.board.set(index, this.human)
            this.el.children[index].innerHTML = this.X
            if (this.check() != null) {
                setTimeout(() => {
                    alert(scores[this.check() / 10 + 1])
                    this.start()
                }, 500)
                return
            }
            if (this.board.open().length > 0) {
                setTimeout(() => {
                    this.set(this.search(), this.ai)
                }, 300)
            }
        } else {
            document.getElementById("ai").classList.remove("active")
            document.getElementById("you").classList.add("active")
            this.board.set(index, this.ai)
            this.el.children[index].innerHTML = this.O
            if (this.check() != null) {
                setTimeout(() => {
                    alert(scores[this.check() / 10 + 1])
                    this.start()
                }, 500)
                return
            }
        }
    }

    check() {
        function equals3(a, b, c) {
            return a == b && b == c && a != null
        }
        let board = [this.board.pos.slice(0, 3), this.board.pos.slice(3, 6), this.board.pos.slice(6, 9)]

        for (let i = 0; i < 3; i++) {
            if (equals3(board[i][0], board[i][1], board[i][2])) {
                return board[i][0] == this.ai ? 10 : -10
            }
        }

        for (let i = 0; i < 3; i++) {
            if (equals3(board[0][i], board[1][i], board[2][i])) {
                return board[0][i] == this.ai ? 10 : -10
            }
        }

        if (equals3(board[0][0], board[1][1], board[2][2])) {
            return board[0][0] == this.ai ? 10 : -10
        }
        if (equals3(board[2][0], board[1][1], board[0][2])) {
            return board[2][0] == this.ai ? 10 : -10
        }

        return this.board.open().length > 0 ? null : 0
    }

    search() {
        let moves = this.board.open()
        let bestVal = -Infinity
        let bestMove
        for (let pos of moves) {
            this.board.pos[pos] = this.ai
            let score = this.minimax(0, false)
            this.board.pos[pos] = null
            if (score >= bestVal) {
                bestVal = score
                bestMove = pos
            }
        }
        return bestMove
    }

    minimax(depth, isMaximizing) {
        let result = this.check()
        // if (depth >= 10) {
        //     return result - depth
        // }
        if (result !== null) {
            return result - depth
        }

        if (isMaximizing) {
            let bestScore = -Infinity
            for (let i = 0; i < 9; i++) {
                if (this.board.pos[i] == null) {
                    this.board.pos[i] = this.ai
                    let score = this.minimax(depth + 1, false)
                    this.board.pos[i] = null
                    bestScore = Math.max(score, bestScore)
                }
            }
            return bestScore
        } else {
            let bestScore = Infinity
            for (let i = 0; i < 9; i++) {
                if (this.board.pos[i] == null) {
                    this.board.pos[i] = this.human
                    let score = this.minimax(depth + 1, true)
                    this.board.pos[i] = null
                    bestScore = Math.min(score, bestScore)
                }
            }
            return bestScore
        }
    }
}

const game = new Game(document.getElementById("board"))
game.start()
