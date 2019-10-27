var lib;
const SCORE = "score",
    LEVEL = "level",
    LIVES = "lives",
    CLICKS = "clicks",
    NEEDED = "needed",
    ACHIEVE = "achieve";
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
        // this.adapt();

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
            height = stage.canvas.height=document.documentElement.clientHeight;
            console.log(document.documentElement.clientHeight);
            

        mc.style.fontSize = 30; //按钮label字体大小

        this.titleScreen = new BasicScreen();
        this.titleScreen.createDisplayText('开始界面', width / 2, 200);
        this.titleScreen.createOkButton((width - 200) / 2, height / 2 +100, 'start', 200, 40);
        // this.titleScreen=new lib.Title();//协作animate使用-------------------1

        this.instructionScreen = new BasicScreen();
        this.instructionScreen.createDisplayText('介绍界面', width / 2, 200);
        this.instructionScreen.createOkButton((width - 200) / 2, height / 2 + 100, 'ok', 200, 40);

        this.levelInScreen = new BasicScreen();
        this.levelInScreen.createDisplayText('level:0', (width) / 2, height / 2, LEVEL);

        this.gameOverScreen = new BasicScreen();
        this.gameOverScreen.createDisplayText('结束界面', width / 2, 200);
        this.gameOverScreen.createOkButton((width - 200) / 2, height / 2 + 100, 'gameover', 200, 40);

        GFrame.style.SCORE_BUFF = 74; //分数版元素间隔大小
        GFrame.style.SCORE_TEXT_SIZE=18;

        this.scoreBoard = new ScoreBoard();
        this.scoreBoard.y = height - GFrame.style.SCOREBOARD_HEIGHT;
        this.scoreBoard.creatTextElement(SCORE, '0');
        this.scoreBoard.creatTextElement(LEVEL, '0');
        this.scoreBoard.creatTextElement(CLICKS, '0');
        this.scoreBoard.creatTextElement(NEEDED, '0');
        this.scoreBoard.creatTextElement(ACHIEVE, '0');
        this.scoreBoard.createBG(width, GFrame.style.SCOREBOARD_HEIGHT, '#333');
        // this.scoreBoard.flicker([PAUSE]);//闪烁分数版元素
        this.game = new MyGame();
    }
}
(function () {
    "use strict";
    //程序变量
    let level = 0,
        lives = 5,
        score = 0;
    //游戏变量;
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
    const GOOD = "#2969ab",
        BAD = "#ff0000";

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
            score = 0;
            level = 0;
            lives = 5;
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, SCORE, score));
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
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, LEVEL, level));
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.LEVELIN_UPDATE, LEVEL, LEVEL + ' : ' + level));
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
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, CLICKS, clicks));
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, ACHIEVE, achieve));
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, NEEDED, needed));
        }
        /**levelinscreen等待结束时执行
         * 
         */
        waitComplete() {
            // this.onkey();

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
                circle.x = Math.random() * stage.canvas.width;
                circle.y = Math.random() * stage.canvas.height - GFrame.style.SCOREBOARD_HEIGHT;
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
                    stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, ACHIEVE, achieve + "%"));
                    stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, SCORE, score));
                    stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, CLICKS, clicks + "/" + numCircles));
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
                balls.splice(0, balls.length);
                stage.dispatchEvent(GFrame.event.GAME_OVER);
            }
        }
        _checkLevelUp() {
            if (achieve > needed) {
                balls.splice(0, balls.length);
                stage.dispatchEvent(GFrame.event.NEW_LEVEL);
            }
        }
        remove() {
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
    }
    window.MyGame = MyGame;
})();