(function () {
    "use strict";
    //游戏变量;定义。。构造内初始化，new game初始化
    var level;
    const 
      LEVEL = "level",
    PUZZLE_COLUMNS = 5,
        PUZZLE_ROWS = 4,
        PUZZLE_SIZE = 150;
    var selectedPieces = [],
        pieces=[];

    class Puzzle extends Game {
        constructor() {
            super();
            this.titleScreen.setText("拼图游戏");
        }
        createScoreBoard(){
            this.scoreBoard = new ScoreBoard(0,0,null);
            this.scoreBoard.createTextElement(LEVEL, '0', 320, 14);
        }
        /**建立游戏元素游戏初始化
         * 在构造函数内建立
         */
        buildElement() {
            // this.onkey()
            selectedPieces=[];
            pieces=[];

        }
        _onPieceClick(e) {
            if (selectedPieces.length === 2) {
                return;
            }
            var piece = e.target,
                matrix = new createjs.ColorMatrix().adjustColor(15, 10, 100, 180);
            piece.filters = [new createjs.ColorMatrixFilter(matrix)];
            piece.cache(0, 0, PUZZLE_SIZE, PUZZLE_SIZE);
            stage.setChildIndex(piece, stage.numChildren - 1);
            selectedPieces.push(piece);
            if (selectedPieces.length === 2) {
                this._swapPieces();
            }

        }
        _swapPieces() {
            var piece1 = selectedPieces[0],
                piece2 = selectedPieces[1];
            createjs.Tween.get(piece1).wait(300).to({
                x: piece2.x,
                y: piece2.y
            }, 200);
            createjs.Tween.get(piece2).wait(300).to({
                x: piece1.x,
                y: piece1.y
            }, 200).call(() => {
                setTimeout(() => {
                    this._evalPuzzle();
                }, 200);
            });
        }
        _evalPuzzle() {
            var win = true;
            selectedPieces[0].uncache();
            selectedPieces[1].uncache();
            for (let i = 0; i <pieces.length; i++) {
                const piece = pieces[i];
                if (piece.x != piece.homePoint.x || piece.y != piece.homePoint.y) {
                    win = false;
                    break;
                }
            }
            if (win) {
                setTimeout(() => {
                    this.clear();
                    this.stage.dispatchEvent(GFrame.event.GAME_OVER);
                }, 200);
            }
            selectedPieces = [];
        }
        newGame() {
            level = 0;
            selectedPieces=[];
            pieces=[];
        }
        newLevel() {
            level++;
            this.updateScoreBoard(LEVEL, level);
            this.updateLevelInScreen(level);
        }
        waitComplete() {
            //分割图片
            let l = PUZZLE_COLUMNS * PUZZLE_ROWS;
            for (let i = 0, col = 0, row = 0; i < l; i++) {
                const piece = new createjs.Bitmap(queue.getResult("puzzle"));
                piece.sourceRect = new createjs.Rectangle(col * PUZZLE_SIZE, row * PUZZLE_SIZE, PUZZLE_SIZE, PUZZLE_SIZE);
                piece.homePoint = {
                    x: col * PUZZLE_SIZE,
                    y: row * PUZZLE_SIZE+70
                };
                piece.x = piece.homePoint.x;
                piece.y = piece.homePoint.y;
                stage.addChild(piece);
                pieces[i]=piece;
                col++;
                if (col === PUZZLE_COLUMNS) {
                    col = 0;
                    row++;
                }
            }
            //随机排列图片
            setTimeout(() => {
                let p = [],
                    _this = this,
                    l, randomIndex;
                p = p.concat(pieces);
                l = p.length;
                for (let i = 0, col = 0, row = 0; i < l; i++) {
                    randomIndex = Math.floor(Math.random() * p.length);
                    const piece = p[randomIndex];
                    p.splice(randomIndex, 1);
                    createjs.Tween.get(piece).to({
                        x: col * PUZZLE_SIZE,
                        y: row * PUZZLE_SIZE+70
                    }, 200);
                    piece.addEventListener('click', this.onPieceClick = function (e) {
                        _this._onPieceClick(e);
                    });
                    col++;
                    if (col === PUZZLE_COLUMNS) {
                        col = 0;
                        row++;
                    }
                }
            }, 3000);
        }
        runGame() {

        }
        clear() {
            super.clear();
            pieces.forEach(element => {
                if (element) {
                    element.removeEventListener('click', this.onPieceClick);
                }
            });
        }

    }
    Puzzle.loaded = false;
    Puzzle.loadItem = [{
        id: "puzzle",
        src: "assets/mam.png"
    }];
    window.Puzzle = Puzzle;


})();