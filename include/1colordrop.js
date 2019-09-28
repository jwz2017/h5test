var canvas;
const SCORE = "score",
    LEVEL = "level",
    PAUSE = "pause";
window.onload = function () {
    "use strict";
    // canvas = document.getElementById('canvas');
    //初始化 整个游戏入口
    new GMain('canvas');
};
class GMain extends GFrame {
    constructor(canvasId) {
        super(canvasId);
        // this.preload([{id:"butterfly",src:"assets/butterfly.png"}]);
        this.init();
    }
    initScreen() {
        this.titleScreen = new BasicScreen();
        this.titleScreen.createDisplayText('开始界面', 300, 200);
        this.titleScreen.createOkButton(250, 300, 'start');
        this.instructionScreen = new BasicScreen();
        this.instructionScreen.createDisplayText('介绍界面', 300, 200);
        this.instructionScreen.createOkButton(250, 300, '确定', );
        this.levelInScreen = new BasicScreen();
        this.levelInScreen.createDisplayText('level:0', 300, 200, LEVEL);
        this.gameOverScreen = new BasicScreen();
        this.gameOverScreen.createDisplayText('结束界面', 300, 200);
        this.gameOverScreen.createOkButton(250, 300, 'gameover');
        this.scoreBoard = new ScoreBoard();
        this.scoreBoard.y = stage.canvas.height - 50;
        this.scoreBoard.creatTextElement(SCORE, new SideBysideScore(SCORE, '0'));
        this.scoreBoard.creatTextElement(LEVEL, new SideBysideScore(LEVEL, '0'));
        this.scoreBoard.creatTextElement(PAUSE, new SideBysideScore(PAUSE, 'press space to pause'), 200, 25);
        this.scoreBoard.createBG(stage.canvas.width, 50, '#333');
        this.game = new MyGame();
    }
}
(function () {
    "use strict";
    //程序变量
    let level = 0,
        score = 0;
    //游戏变量
    let colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"],
        slots = [],
        shapes = [];
    class MyGame extends Game {
        constructor() {
            super();
        }
        buildElement() {
            let slot, shape;
            for (let i = 0; i < colors.length; i++) {
                //slot
                slot = new createjs.Shape();
                slot.graphics.beginStroke(colors[i]).beginFill("#fff").drawRect(0, 0, 100, 100);
                slot.regX = slot.regY = 50;
                slot.key = i;
                slot.y = 80;
                slot.x = (i * 130) + 100;
                slots.push(slot);
                //shape
                shape = new createjs.Shape();
                shape.graphics.beginFill(colors[i]).drawRect(0, 0, 100, 100);
                shape.regX = shape.regY = 50;
                shape.key = i;
                shapes.push(shape);
            }

        }
        newGame() {
            score = 0;
            level = 0;
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, SCORE, score));
        }
        newLevel() {
            level++;
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, LEVEL, level));
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.LEVELIN_UPDATE, LEVEL, LEVEL + level));
            this.setShapes();
        }
        /**levelinscreen等待结束时执行
         * 
         */
        waitComplete() {
            //加入显示元素
        }
        runGame() {
            this._creatElement();
            this._update();
            this._checkElement();
            this._checkOver();
            this._checkLevelUp();
        }
        
        setShapes() {
            for (let i = 0; i < shapes.length; i++) {
                const shape = shapes[i];
                const slot = slots[shape.key];
                stage.addChild(slot);
                shape.homeY = 320;
                shape.homeX = (i * 130) + 100;
                shape.y = shape.homeY;
                shape.x = shape.homeX;
                shape.addEventListener("mousedown", function (e) {
                    stage.setChildIndex(shape, stage.numChildren - 1);
                    stage.addEventListener("stagemousemove", (e) => {
                        shape.x = e.stageX;
                        shape.y = e.stageY;
                    });
                    stage.addEventListener("stagemouseup", () => {
                        stage.removeAllEventListeners("stagemouseup");
                        stage.removeAllEventListeners("stagemousemove");
                        const pt = slot.globalToLocal(stage.mouseX, stage.mouseY);
                        if (slot.hitTest(pt.x, pt.y)) {
                            shape.removeAllEventListeners("mousedown");
                            score++;
                            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, SCORE, score));
                            createjs.Tween.get(shape).to({
                                x: slot.x,
                                y: slot.y
                            }, 200, createjs.Ease.QuadOut).call(function () {
                                if (score == 4) {
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

                });
                stage.addChild(shape);
            }
        }
        _creatElement() {

        }
        _update() {

        }
        _checkElement() {

        }
        _checkOver() {

        }
        _checkLevelUp() {

        }
    }
    window.MyGame = MyGame;
})();