// window.onload = function () {
//     "use strict";
//     /*************初始化 整个游戏入口*****/
//     var g = new GFrame('canvas');
//     /**********自适应************* */
//     g.adapt();
//     /*********预加载********** */
//     // g.preload(Colordrop);
//     /*********不加载********** */
//     g.initGame(Colordrop);
//     /***********fps********** */
//     FPS.startFPS(stage);
// };

(function () {
    "use strict";
    //游戏变量;
    var score, level;
    var colors=["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ewe0ee"],
    slots = [],
    shapes = [];
    class Colordrop extends Game {
        constructor() {
            super();
            this.titleScreen.setText("Colordrop");
        }
        /**建立游戏元素游戏初始化
         * 在构造函数内建立
         */
        buildElement() {
            // this.onkey()
            slots=[];
            shapes=[];
            for (let i = 0; i < colors.length; i++) {
                //slot
                const slot = new createjs.Shape();
                slot.graphics.beginStroke(colors[i]).beginFill("#fff").drawRect(0, 0, 100, 100);
                slot.regX = slot.regY = 50;
                slot.key = i;
                slot.y = 150;
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
            score = 0;
            this.updateScoreBoard(SCORE, score);
            level = 0;

        }
        newLevel() {
            level++;
            this.updateScoreBoard(LEVEL, level);
        }
        waitComplete() {
            //Array随机排序
            utils.randomArray(shapes);

            for (let i = 0; i < shapes.length; i++) {
                const shape = shapes[i];
                const slot = slots[i];
                stage.addChild(slot);
                shape.y = shape.homeY = 390;
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
                        score += 1;
                        this.updateScoreBoard(SCORE,score);

                        // stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, SCORE, score));
                        createjs.Tween.get(shape).to({
                            x: slot.x,
                            y: slot.y
                        }, 200, createjs.Ease.QuadOut).call(function () {
                            if (score == 5) {
                                this.clear();
                                stage.dispatchEvent(GFrame.event.GAME_OVER);
                            }
                        },null,this);
                    } else {
                        createjs.Tween.get(shape).to({
                            x: shape.homeX,
                            y: shape.homeY
                        }, 200, createjs.Ease.QuadOut);
                    }

                });

            }
        }
        runGame() {

        }
        clear() {
            super.clear();
            shapes.forEach((element,item) => {
                
                if(shapes[item].hasEventListener("pressmove")){
                 shapes[item].removeAllEventListeners();
                 console.log("remove");
                }
            });
        }

    }
    Colordrop.loaded=false;
    Colordrop.loadItem=null;
    window.Colordrop = Colordrop;
})();