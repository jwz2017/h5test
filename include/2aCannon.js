(function () {
    "use strict";
    //游戏变量;定义。。构造内初始化，new game初始化
    var score, level;
    class Cannon extends Game {
        constructor() {
            super();
            this.titleScreen.setText('cannon');
        }
        /**建立游戏元素游戏初始化
         * 在构造函数内建立
         */
        buildElement() {
            // this.onkey()
        }
        newGame() {
            score = 0;
            this.updateScoreBoard(SCORE, score);
            level = 0;
        }
        newLevel() {
            level++;
            this.updateScoreBoard(LEVEL, level);
            this.updateLevelInScreen(level);
        }
        waitComplete() {

        }
        runGame() {

        }
        clear() {
            super.clear();

        }

    }
    Cannon.loaded=false;
    Cannon.loadItem=[{
        id:"cross",
        src:"images/cano/cross.png"
    }];
    window.Cannon = Cannon;
})();