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
        // let comp = AdobeAn.getComposition("A81D833FE7C7754FB5395FF7A6EFA6E1");
        // lib = comp.getLibrary();
        // this.preload(lib.properties.manifest, comp);

        /*********不加载，直接初始化*************** */
        this.init();

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
    let colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ewe0ee"],
        slots = [],
        shapes = [];

    class MyGame extends Game {
        constructor() {
            super();
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {
            for (let i = 0; i < colors.length; i++) {
                //slot
                const slot = new createjs.Shape();
                slot.graphics.beginStroke(colors[i]).beginFill("#fff").drawRect(0, 0, 100, 100);
                slot.regX = slot.regY = 50;
                slot.key = i;
                slot.y = 80;
                slot.x = (i * 130) + 100;
                slots.push(slot);
                //shape
                const shape = new createjs.Shape();
                shape.graphics.beginFill(colors[i]).drawRect(0, 0, 100, 100);
                shape.regX = shape.regY = 50;
                shape.key = i;
                shapes.push(shape);
            }

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
            //shapes随机排序
            if (!Array.prototype.derangedArray) {
                Array.prototype.derangedArray = function () {
                    for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
                    return this;
                };
            }
            shapes = shapes.derangedArray();

            for (let i = 0; i < shapes.length; i++) {
                const shape = shapes[i];
                const slot = slots[i];
                stage.addChild(slot);
                shape.y = shape.homeY = 320;
                shape.x = shape.homeX = (i * 130) + 100;
                stage.addChild(shape);

                shape.addEventListener("pressmove", function (e) {
                    stage.setChildIndex(shape, stage.numChildren - 1);
                    shape.x = e.stageX;
                    shape.y = e.stageY;
                });
                shape.addEventListener("pressup", () => {
                    const slot = slots[shape.key];
                    const pt = slot.globalToLocal(stage.mouseX, stage.mouseY);
                    if (slot.hitTest(pt.x, pt.y)) {
                        shape.removeAllEventListeners("pressmove");
                        shape.removeAllEventListeners("pressup");
                        this.score += 1;

                        // stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, SCORE, score));
                        createjs.Tween.get(shape).to({
                            x: slot.x,
                            y: slot.y
                        }, 200, createjs.Ease.QuadOut).call(function () {
                            if (_score == 5) {
                                stage.dispatchEvent(GFrame.event.GAME_OVER);
                            }
                        });
                    } else {
                        createjs.Tween.get(shape).to({
                            x: shape.homeX,
                            y: shape.homeY
                        }, 200, createjs.Ease.QuadOut);
                    }

                });

                // shape.addEventListener("mousedown", function (e) {
                //     stage.setChildIndex(shape, stage.numChildren - 1);
                //     stage.addEventListener("stagemousemove", (e) => {
                //         shape.x = e.stageX;
                //         shape.y = e.stageY;
                //     });
                //     stage.addEventListener("stagemouseup", () => {
                //         stage.removeAllEventListeners("stagemouseup");
                //         stage.removeAllEventListeners("stagemousemove");
                //         const pt = slot.globalToLocal(stage.mouseX, stage.mouseY);
                //         if (slot.hitTest(pt.x, pt.y)) {
                //             shape.removeAllEventListeners("mousedown");
                //             score++;
                //             stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, SCORE, score));
                //             createjs.Tween.get(shape).to({
                //                 x: slot.x,
                //                 y: slot.y
                //             }, 200, createjs.Ease.QuadOut).call(function () {
                //                 if (score == 4) {
                //                     stage.dispatchEvent(GFrame.event.GAME_OVER);
                //                 }
                //             });
                //         } else {
                //             createjs.Tween.get(shape).to({
                //                 x: shape.homeX,
                //                 y: shape.homeY
                //             }, 200, createjs.Ease.QuadOut);
                //         }
                //     });

                // });
            }
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