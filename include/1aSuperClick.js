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
           super.initScreen();
            GFrame.style.SCOREBOARD_HEIGHT=100;
            this.scoreBoard = new ScoreBoard();
            this.scoreBoard.createTextElement(SCORE, '0',20,14);
            this.scoreBoard.createTextElement(LEVEL, '0',320,14);
            this.scoreBoard.createTextElement(CLICKS, '0',560,14);
            this.scoreBoard.createTextElement(NEEDED, '0', 20, 60);
            this.scoreBoard.createTextElement(ACHIEVE, '0', 320, 60);
        }
        buildElement() {
            this.onkey()
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
            stage.removeAllChildren();
            balls.splice(0,balls.length);
        }

    }
    SuperClick.loaded = false;
    SuperClick.loadItem = null;
    window.SuperClick = SuperClick;
})();