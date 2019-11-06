/**
 * 声音加载一次。。
 */
window.onload = function () {
    "use strict";
    /*************初始化 整个游戏入口*****/
    var g = new GFrame('canvas');
    /**********自适应************* */
    g.adapt();
    /*********加载********** */
    g.initGame(Base);
    /***********fps********** */
    FPS.startFPS(stage);

    /***************************选择菜单************************************************************************ */
    var select = document.getElementById("select1");
    select.onchange = function () {
        if (g.game.titleScreen.hasEventListener(GFrame.event.OK_BUTTON)) {
            g.game.titleScreen.removeEventListener(GFrame.event.OK_BUTTON, g.okButton);
        } else if (g.game.instructionScreen.hasEventListener(GFrame.event.OK_BUTTON)) {
            g.game.instructionScreen.removeEventListener(GFrame.event.OK_BUTTON, g.okButton);
        } else if (g.game.gameOverScreen.hasEventListener(GFrame.event.OK_BUTTON)) {
            g.game.gameOverScreen.removeEventListener(GFrame.event.OK_BUTTON, g.okButton);
        }
        //  else if (g._currentSystemState == GFrame.state.STATE_WAIT) {
        //     g._switchSystemState(GFrame.state.STATE_WAIT_FOR_CLOSE);
        //     g.waitTime = 0;
        // }

        g._switchSystemState(GFrame.state.STATE_WAIT_FOR_CLOSE)
        g.game.clear();
        stage.removeAllEventListeners();

        let index = select.selectedIndex;
        switch (select.options[index].text) {
            case "base":
                g.initGame(Base);
                break;
            case "move":
                if (!Move.l) {
                    g.preload(Move);
                    Move.loaded = true;
                } else {
                    g.initGame(Move);
                }
                break;
            case "sound":
                if (!PlaySound.loaded) {
                    g.preload(PlaySound);
                    PlaySound.loaded = true;
                } else {
                    g.initGame(PlaySound);
                }
                break;
            case "sprite":
                if (!Sprite.loaded) {
                    g.preload(Sprite);
                    Sprite.loaded = true
                } else {
                    g.initGame(Sprite);
                }
                break;
            case "withdom":
                if (!PlaySound.loaded) {
                    g.preload(DomTest);
                    PlaySound.loaded = true
                } else {
                    g.initGame(DomTest);
                }
                break;
            case "bmText":
                if (!BitmapText.loaded) {
                    g.preload(BitmapText);
                    BitmapText.loaded = true
                } else {
                    g.initGame(BitmapText);
                }
                break;
            case "bounce":
                g.initGame(Bounce);
                break;
            case "colorDrop":
                g.initGame(Colordrop);
                break;
            case "match":
                if (!Match.loaded) {
                    g.preload(Match);
                    Match.loaded = true
                } else {
                    g.initGame(Match);
                }
                break;
            case "pazzle":
                if (!Puzzle.loaded) {
                    g.preload(Puzzle);
                    Puzzle.loaded = true
                } else {
                    g.initGame(Puzzle);
                }
                break;
            case "spclick":
                g.initGame(SuperClick);
                break;

            default:
                break;
        }
    }

};
/******************************************************************************* */

(function () {
    "use strict";
    //游戏变量;
    var score, level; //定义。。构造内初始化，new game初始化
    class Base extends Game {
        constructor() {
            super();
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
    Base.loaded = false;
    Base.loadItem = null;
    window.Base = Base;
})();