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
        // stage.canvas.height=document.documentElement.clientHeight;
        this.adapt();

        /*********预加载手动********** */
        // this.preload([{
        //     id: "butterfly",
        //     src: "assets/butterfly.png"
        // }]);

        /*********animate加载******* ---------------------------------------1*/
        let comp = AdobeAn.getComposition("A81D833FE7C7754FB5395FF7A6EFA6E1");
        lib = comp.getLibrary();
        this.preload(lib.properties.manifest, comp);

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
    let wall,
        paddleHits = 0,
        combo = 0,
        puck,
        paddle;
    const WALL_THICKNESS = 20,
        PUCK_RADIUS = 5,
        PUCK_SPEED = 5,
        PADDLE_WIDTH = 100,
        PADDLE_HEIGHT = 10,
        PADDLE_SPEED = 15,
        PADDLE_HITS_MAX = 7;

    class MyGame extends Game {
        constructor() {
            super();
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {
            wall = new Wall(WALL_THICKNESS);
            paddle = new createjs.Shape();
            paddle.graphics.beginFill('#006600').drawRect(0, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
            puck = new createjs.Shape();
            puck.graphics.beginFill('#ffffff').drawCircle(0, 0, PUCK_RADIUS);
            this.brick = new Brick();
        }
        newGame() {
            this.score = 0;
            this.lives = 5;
            _level = 0;
            paddleHits = 0;
        }
        newLevel() {
            this.level++;
        }
        /**levelinscreen等待结束时执行
         * 
         */
        waitComplete() {
            this.onkey();
             //加入显示元素
             let w = stage.canvas.width;
             stage.addChild(puck, wall, paddle);
             paddle.x = w / 2 - WALL_THICKNESS - PADDLE_WIDTH / 2 + WALL_THICKNESS;
             paddle.y = stage.canvas.height - PADDLE_HEIGHT - GFrame.style.SCOREBOARD_HEIGHT;
             this.brick.createBrick(WALL_THICKNESS, WALL_THICKNESS, stage.canvas.width - WALL_THICKNESS, _level);
             this.brick.createBrick(WALL_THICKNESS, WALL_THICKNESS, stage.canvas.width - WALL_THICKNESS, _level);
             puck.x = w / 2;
             puck.y = this.brick.bricks[0].y + this.brick.brickHeight * 2 + PUCK_RADIUS * 2;
 
             puck.vx = puck.vy = PUCK_SPEED;
             puck.isAlive = true;

        }
        runGame() {
            this._updatePaddle();
            this._updatePuck();
            this._checkPaddle();
            this._checkPuck();
            this._checkBrick();
            this._checkOver();
            this._checkLevelUp();
            
        }
        _updatePaddle() {
            if (this.leftKeyDown) paddle.x -= PADDLE_SPEED;
            if (this.rightKeyDown) paddle.x += PADDLE_SPEED;
            let d = stage.canvas.width - PADDLE_WIDTH - WALL_THICKNESS;
            if (paddle.x < WALL_THICKNESS) paddle.x = WALL_THICKNESS;
            else if (paddle.x > d) paddle.x = d;
        }
        _updatePuck() {
            puck.x += puck.vx;
            puck.y += puck.vy;
            let d = stage.canvas.width - WALL_THICKNESS - PUCK_RADIUS;
            if (puck.x > d) {
                puck.x = d;
                puck.vx *= -1;
            } else if (puck.x < WALL_THICKNESS + PUCK_RADIUS) {
                puck.x = WALL_THICKNESS + PUCK_RADIUS;
                puck.vx *= -1;
            }
            if (puck.y < WALL_THICKNESS + PUCK_RADIUS) {
                puck.y = WALL_THICKNESS + PUCK_RADIUS;
                puck.vy *= -1;
            }
        }
        _checkPaddle() {
            if (puck.vy > 0 && puck.x >= paddle.x && puck.x <= paddle.x + PADDLE_WIDTH && puck.y >= paddle.y - PUCK_RADIUS && puck.isAlive) {
                puck.y = paddle.y - PUCK_RADIUS;
                puck.vy *= -1;
                let x1 = puck.x - paddle.x - PADDLE_WIDTH / 2;
                puck.vx += x1 / PADDLE_WIDTH * 15;
                paddleHits++;
                combo = 0;
                if (paddleHits == PADDLE_HITS_MAX) {
                    this.brick.createBrick(WALL_THICKNESS, WALL_THICKNESS, stage.canvas.width - WALL_THICKNESS, _level);
                    paddleHits = 0;
                }
            }
        }
        _checkPuck() {
            if (puck.y > paddle.y) {
                puck.isAlive = false;
            }
            if (puck.y > stage.canvas.height + 200) {
                puck.y = this.brick.bricks[0].y + this.brick.brickHeight * 2 + PUCK_RADIUS * 2;
                puck.x = stage.canvas.width / 2;
                puck.isAlive = true;
                puck.vx = PUCK_SPEED;
                combo = 0;
                this.lives--;
            }
        }
        _checkBrick() {
            if (!puck.isAlive || this.brick.bricks.length == 0) {
                return;
            }
            let brick, l = this.brick.bricks.length;
            for (let i = l - 1; i >= 0; i--) {
                brick = this.brick.bricks[i];
                if (puck.y <= brick.y + brick.height + PUCK_RADIUS && puck.y >= brick.y - PUCK_RADIUS && puck.x >= brick.x - PUCK_RADIUS && puck.x <= brick.x + brick.width + PUCK_RADIUS) {

                    this.score++;
                    combo++;
                    if (brick.freeLife) {
                        this.lives++;
                        createjs.Tween.get(brick.freeLife).to({
                            alpha: 0,
                            y: brick.freeLife.y - 100
                        }, 1000).call(this._remove);
                    }
                    if (combo > 4) {
                        this.score += (combo * 10);
                        let combotex = new createjs.Text('combo x' + (combo * 10), '14px Times', '#ff0000');
                        combotex.x = brick.x;
                        combotex.y = brick.y;
                        combotex.regX = brick.width / 2;
                        combotex.regY = brick.height / 2;
                        combotex.alpha = 0;
                        stage.addChild(combotex);
                        createjs.Tween.get(combotex).to({
                            alpha: 1,
                            scaleY: 2,
                            scaleX: 2,
                            y: combotex.y - 60
                        }, 1000).call(this._remove);
                    }
                    stage.removeChild(brick);
                    this.brick.bricks.splice(i, 1);
                    puck.vy *= -1;
                    return;
                }
            }
        }
        _checkOver() {
            if (this.brick.bricks.length == 0) {
                return;
            }
            if (_lives < 0 || this.brick.bricks[0].y > paddle.y) {
                this.gameover = true;
            }
            if (this.gameover) {
                this.gameover = false;
                this.brick.clear();
                stage.dispatchEvent(GFrame.event.GAME_OVER);
            }
        }
        _checkLevelUp() {

        }
        //移除缓动元素
        _remove() {
            stage.removeChild(this);

        }


        
        onkey(){
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

//Brick类--------------------------------------------------
class Brick {
    constructor() {
        this.bricks = [];
        this.brickHeight = 20;
    }
    createBrick(xpos1, ypos1, xpos2, level) {
        this.shiftBricksDown();
        let width = xpos2 - xpos1,
            num = level * 2 + 18,
            brickWidth = Math.floor(width / num * 2);
        xpos1 = Math.floor(width / 2 - brickWidth * num / 4 + xpos1);
        let xpos = xpos1,
            ypos = ypos1,
            freeLife = Math.floor(Math.random() * num),
            color = utils.randomColor();
        for (let i = 0; i < num; i++) {
            let brick = new createjs.Shape();
            let freeLifeTxt;
            brick.graphics.beginFill(i == freeLife ? '#009900' : color);
            brick.graphics.drawRect(0, 0, brickWidth, this.brickHeight).endFill();
            brick.x = xpos;
            brick.y = ypos;
            brick.width = brickWidth;
            brick.height = this.brickHeight;
            brick.freeLife = false;
            this.bricks.push(brick);
            stage.addChild(brick);
            if (i == freeLife) {
                freeLifeTxt = new createjs.Text('1UP', '12px Times', '#fff');
                freeLifeTxt.x = brick.x + (brickWidth / 2);
                freeLifeTxt.y = brick.y + 4;
                freeLifeTxt.textAlign = 'center';
                brick.freeLife = freeLifeTxt;
                stage.addChild(freeLifeTxt);
            }
            xpos += brickWidth;
            if (xpos + brickWidth > xpos2) {
                xpos = xpos1;
                ypos += this.brickHeight;
            }

        }
    }
    shiftBricksDown() {
        let l = this.bricks.length,
            h = this.brickHeight * 4;
        for (let i = 0; i < l; i++) {
            const brick = this.bricks[i];
            brick.y += h;
            if (brick.freeLife) {
                brick.freeLife.y += h;
            }
        }
    }
    clear() {
        this.bricks.splice(0, this.bricks.length);
    }
}