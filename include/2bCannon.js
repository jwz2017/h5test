(function () {
    "use strict";
    //游戏变量;定义。。构造内初始化，new game初始化
    var score, level;
    const SCORE = "score",
       LEVEL = "level",
       LIVES = "lives";
    class Cannon extends Game {
        constructor() {
            super();
            this.titleScreen.setText("加农炮");
        }
        createScoreBoard() {
        this.scoreBoard = new ScoreBoard(0,0,null);
        this.scoreBoard.createTextElement(SCORE, '0', 20, 14);
        this.scoreBoard.createTextElement(LEVEL, '0', 320, 14);
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
    Cannon.loadItem=null;
    window.Cannon = Cannon;
})();