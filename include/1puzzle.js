var lib;
const SCORE = "score",
    LEVEL = "level",
    LIVES = "lives";
window.onload = function () {
    "use strict";
    /*************初始化 整个游戏入口*****/
    new Main('canvas');
    //添加代码

}
class Main extends GFrame {
    constructor(canvasId) {
        super(canvasId);

        /*********自适应*********** */
        stage.canvas.height=document.documentElement.clientHeight;
        // this.adapt();

        /*********预加载手动********** */
        this.preload([{
            id: "puzzle",
            src: "assets/mam.png"
        }]);

        /*********animate加载******* ---------------------------------------1*/
        // let comp = AdobeAn.getComposition("A81D833FE7C7754FB5395FF7A6EFA6E1");
        // lib = comp.getLibrary();
        // this.preload(lib.properties.manifest, comp);

        /*********不加载，直接初始化*************** */
        // this.init();

        FPS.startFPS(stage);
    }


    initScreen() {
        let width = stage.canvas.width,
            height = stage.canvas.height;

        mc.style.fontSize = 30; //按钮label字体大小

        this.titleScreen = new BasicScreen();
        this.titleScreen.createDisplayText('开始界面', width / 2, 200);
        this.titleScreen.createOkButton((width - 200) / 2, height / 2 + 100, 'start', 200, 40);
        // this.titleScreen=new lib.Title();//协作animate使用-------------------1

        this.instructionScreen = new BasicScreen();
        this.instructionScreen.createDisplayText('介绍界面', width / 2, 200);
        this.instructionScreen.createOkButton((width - 200) / 2, height / 2 + 100, 'ok', 200, 40);

        this.levelInScreen = new BasicScreen();
        this.levelInScreen.createDisplayText('level:0', (width) / 2, height / 2, LEVEL);

        this.gameOverScreen = new BasicScreen();
        this.gameOverScreen.createDisplayText('结束界面', width / 2, 200);
        this.gameOverScreen.createOkButton((width - 200) / 2, height / 2 + 100, 'gameover', 200, 40);

        GFrame.style.SCORE_BUFF = 200; //分数版元素间隔大小

        this.scoreBoard = new ScoreBoard();
        this.scoreBoard.y = height - GFrame.style.SCOREBOARD_HEIGHT;
        this.scoreBoard.creatTextElement(SCORE, '0');
        this.scoreBoard.creatTextElement(LEVEL, '0');
        this.scoreBoard.creatTextElement(LIVES, '0');
        this.scoreBoard.createBG(width, GFrame.style.SCOREBOARD_HEIGHT, '#333');
        // this.scoreBoard.flicker([PAUSE]);//闪烁分数版元素
        this.game = new MyGame();
    }
}
(function () {
    "use strict";
    //程序变量
    let _level = 0,
        _lives = 5,
        _score = 0;
    //游戏变量;
    var puzzle;

    class MyGame extends Game {
        constructor() {
            super();
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {

        }
        newGame() {
            this.score = 0;
            this.lives = 5;
            _level = 0;
        }
        newLevel() {
            this.level++;
        }
        /**levelinscreen等待结束时执行
         * 
         */
        waitComplete() {
            // this.onkey();
            puzzle = new Puzzle(stage, "assets/mam.png");




        }
        runGame() {


        }



        onkey() {
            document.onkeyup = (e) => {
                switch (e.keyCode) {
                    case 65:
                        this.leftKeyDown = false;
                        break;
                    case 68:
                        this.rightKeyDown = false;
                        break;
                    case 87:
                        this.upKeyDown = false;
                        break;
                    case 83:
                        this.downKeyDown = false;
                        break;
                    case 32:
                        createjs.Ticker.paused = !createjs.Ticker.paused;
                        break;
                    default:
                }
            };
            document.onkeydown = (e) => {
                switch (e.keyCode) {
                    case 65:
                        if (!this.leftKeyDown) {
                            this.leftKeyDown = true;

                        }
                        break;
                    case 68:
                        if (!this.rightKeyDown) {
                            this.rightKeyDown = true;

                        }
                        break;
                    case 87:
                        if (!this.upKeyDown) {
                            this.upKeyDown = true;

                        }
                        break;
                    case 83:
                        if (!this.downKeyDown) {
                            this.downKeyDown = true;

                        }
                        break;
                    default:
                }
            };
        }
        get score() {
            return _score;
        }
        set score(val) {
            _score = val;
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, SCORE, _score));
        }
        get level() {
            return _level;
        }
        set level(val) {
            _level = val;
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.LEVELIN_UPDATE, LEVEL, LEVEL + ' : ' + _level));
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, LEVEL, _level));
        }
        get lives() {
            return _lives;
        }
        set lives(val) {
            _lives = val;
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, LIVES, _lives));
        }
    }
    window.MyGame = MyGame;
})();
(function () {
    "use strict";
    const PUZZLE_COLUMNS = 5,
        PUZZLE_ROWS = 4,
        PUZZLE_SIZE = 150;
    var selectedPieces = [];


    class Puzzle {
        constructor(stage, src) {
            this.pieces = [];
            this.stage = stage;
            this.src = src;
            this._init();

        }
        _init() {
            this._buildPuzzle();
            setTimeout(() => {
                let p = [],
                    _this = this,
                    l, randomIndex;
                p = p.concat(this.pieces);
                l = p.length;
                for (let i = 0, col = 0, row = 0; i < l; i++) {
                    randomIndex = Math.floor(Math.random() * p.length);
                    const piece = p[randomIndex];
                    p.splice(randomIndex, 1);
                    createjs.Tween.get(piece).to({
                        x: col * PUZZLE_SIZE,
                        y: row * PUZZLE_SIZE
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

        _buildPuzzle() {
            let l = PUZZLE_COLUMNS * PUZZLE_ROWS;
            for (let i = 0, col = 0, row = 0; i < l; i++) {
                const piece = new createjs.Bitmap(this.src);
                piece.sourceRect = new createjs.Rectangle(col * PUZZLE_SIZE, row * PUZZLE_SIZE, PUZZLE_SIZE, PUZZLE_SIZE);
                piece.homePoint = {
                    x: col * PUZZLE_SIZE,
                    y: row * PUZZLE_SIZE
                };
                piece.x = piece.homePoint.x;
                piece.y = piece.homePoint.y;
                this.stage.addChild(piece);
                this.pieces[i] = piece;
                col++;
                if (col === PUZZLE_COLUMNS) {
                    col = 0;
                    row++;
                }

            }
        }
        _onPieceClick(e) {
            if (selectedPieces.length === 2) {
                return;
            }
            var piece = e.target,
                matrix = new createjs.ColorMatrix().adjustColor(15, 10, 100, 180);
            piece.filters = [new createjs.ColorMatrixFilter(matrix)];
            piece.cache(0, 0, PUZZLE_SIZE, PUZZLE_SIZE);
            this.stage.setChildIndex(piece, this.stage.numChildren - 1);
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
            for (let i = 0; i < this.pieces.length; i++) {
                const piece = this.pieces[i];
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
        clear() {
            for (let i = 0; i < this.pieces.length; i++) {
                const piece = this.pieces[i];
                piece.removeEventListener('click', this.onPieceClick);
            }
        }
    }
    window.Puzzle = Puzzle;
})();