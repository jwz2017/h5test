// window.onload = function () {
//     "use strict";
//     /*************初始化 整个游戏入口*****/
//     var g = new GFrame('canvas');
//     /**********自适应************* */
//     g.adapt();
//     /*********预加载********** */
//     // g.preload(SuperClick);
//     /*********不加载********** */
//     g.initGame(SuperClick);
//     /***********fps********** */
//     FPS.startFPS(stage);
// };

(function () {
    "use strict";
    //游戏变量;定义。。构造内初始化，new game初始化
    var score, level;
    const LIVES = "lives",
        CLICKS = "clicks",
        NEEDED = "needed",
        ACHIEVE = "achieve";
    const GOOD = "#2969ab",
        BAD = "#ff0000";
    let radius = 8,
        maxScore = 50,
        maxscale,
        growSpeed,
        maxOnScreen,
        numCircles,
        percentBadCircle,
        numCreated,
        clicks = 0,
        needed = 0,
        achieve = 0,
        balls = [];

    class SuperClick extends Game {
        constructor() {
            super();
        }
        /**建立游戏元素游戏初始化
         * 在构造函数内建立
         */
        initScreen() {
            let width = stage.canvas.width,
                height = stage.canvas.height;

            mc.style.fontSize = 40; //按钮label字体大小

            this.titleScreen = new BasicScreen();
            this.titleScreen.createDisplayText('超级点击', width / 2, 300);
            this.titleScreen.createOkButton((width - 300) / 2, height / 2 + 100, 'start', 300, 60);
            // this.titleScreen=new lib.Title();//协作animate使用-------------------1

            this.instructionScreen = new BasicScreen();
            this.instructionScreen.createDisplayText('介绍界面', width / 2, 300);
            this.instructionScreen.createOkButton((width - 300) / 2, height / 2 + 100, 'ok', 300, 60);

            this.levelInScreen = new BasicScreen();
            this.levelInScreen.createDisplayText('level:0', (width) / 2, height / 2, LEVEL);

            this.gameOverScreen = new BasicScreen();
            this.gameOverScreen.createDisplayText('结束界面', width / 2, 300);
            this.gameOverScreen.createOkButton((width - 300) / 2, height / 2 + 100, 'gameover', 300, 60);

            this.scoreBoard = new ScoreBoard();
            // this.scoreBoard.y = height - GFrame.style.SCOREBOARD_HEIGHT;
            this.scoreBoard.creatTextElement(SCORE, '0');
            this.scoreBoard.creatTextElement(LEVEL, '0');
            this.scoreBoard.creatTextElement(CLICKS, '0');
            this.scoreBoard.creatTextElement(NEEDED, '0', 20, 60);
            this.scoreBoard.creatTextElement(ACHIEVE, '0', 300, 60);
            this.scoreBoard.createBG(width, 100, '#333');
            // this.scoreBoard.flicker([PAUSE]);//闪烁分数版元素
        }
        buildElement() {
            // this.onkey()
        }
        newGame() {
            score = 0;
            this.updateScoreBoard(SCORE, score);
            level = 0;
            stage.addEventListener('mousedown', (e) => {
                if (createjs.Ticker.paused) {
                    return;
                } else if (e.target.type === BAD) {
                    this.gameOver = true;
                } else if (e.target.type === GOOD && e.target.first === true) {
                    e.target.clicked = true;
                    e.target.first = false;
                }
            })
        }
        newLevel() {
            level++;
            this.updateScoreBoard(LEVEL, level);
            this.updateLevelInScreen(level);
            clicks = 0;
            achieve = 0;
            needed = 14 + level * 2;
            if (needed > 90) {
                needed = 90;
            }
            maxscale = (level < 4) ? 5 - level : 1.4;
            growSpeed = 0.0001 * level + 0.005;
            maxOnScreen = 6 * level;
            numCircles = level * 25;
            percentBadCircle = (level < 25) ? level + 9 : 40;
            numCreated = 0;
            this.updateScoreBoard(CLICKS,clicks+"/"+numCircles);
            this.updateScoreBoard(ACHIEVE,achieve);
            this.updateScoreBoard(NEEDED,needed);
        }
        waitComplete() {

        }
        runGame() {
            this._creatElement();
            this._update();
            this._checkBall();
            this._checkOver();
            this._checkLevelUp();
        }
        _creatElement() {
            if (balls.length < maxOnScreen && numCreated < numCircles) {
                let circle;
                if (Math.random() * 100 < percentBadCircle) {
                    circle = new Ball(BAD, radius);
                    circle.type = BAD;
                } else {
                    circle = new Ball(GOOD, radius);
                    circle.type = GOOD;
                    numCreated++;
                }
                circle.x = Math.random() * (stage.canvas.width-radius*2+radius);
                circle.y = Math.random()* (stage.canvas.height-100-radius*2)+100+radius;
                circle.scaleX = circle.scaleY = 0.5;
                circle.clicked = false;
                circle.first = true;
                stage.addChild(circle);
                balls.push(circle);
            }
        }
        _update() {
            balls.forEach(function (item) {
                if (item.scaleX < maxscale) {
                    item.scaleX += growSpeed;
                    item.scaleY += growSpeed;
                } else {
                    createjs.Tween.get(item).to({
                        alpha: 0
                    }, 2000);
                }
            }, this)
        }
        _checkBall() {
            for (let i = balls.length - 1; i >= 0; i--) {
                const ball = balls[i];
                if (ball.alpha <= 0.1) {
                    stage.removeChild(ball);
                    balls.splice(i, 1);
                } else if (ball.clicked) {
                    let addScore = Math.round(maxScore / ball.scaleX);
                    score += addScore;
                    clicks++;
                    achieve = Math.round(clicks / numCircles * 100);
                    this.updateScoreBoard(ACHIEVE,achieve + "%");
                    this.updateScoreBoard(SCORE,score);
                    this.updateScoreBoard(CLICKS,clicks + "/" + numCircles);
                    var txt = new createjs.Text(addScore, 'bold 12px arial', '#ff0000');
                    txt.textAlign = 'center';
                    txt.textBaseline = 'middle';
                    txt.x = ball.x;
                    txt.y = ball.y;
                    stage.addChild(txt);
                    createjs.Tween.get(txt).to({
                        scaleX: 3,
                        scaleY: 3,
                        alpha: 0
                    }, 1000).call(this.remove);
                    balls.splice(i, 1);
                    createjs.Tween.get(ball).to({
                        alpha: 0
                    }, 2000).call(this.remove);
                }
            }
        }
        _checkOver() {
            if (balls.length == 0) {
                this.gameOver = true;
            }
            if (this.gameOver) {
                this.gameOver = false;
                stage.dispatchEvent(GFrame.event.GAME_OVER);
            }
        }
        _checkLevelUp() {
            if (achieve >= needed) {
                stage.dispatchEvent(GFrame.event.NEW_LEVEL);
            }
        }
        remove() {
            stage.removeChild(this);
            
        }
        clear() {
            super.clear();
            balls.splice(0,balls.length);
        }

    }
    SuperClick.loaded = false;
    SuperClick.loadItem = null;
    window.SuperClick = SuperClick;
})();