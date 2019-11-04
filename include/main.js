window.onload = function () {
    "use strict";
    /*************初始化 整个游戏入口*****/
    var g = new GFrame('canvas');
    /**********自适应************* */
    g.adapt();
    /*********预加载手动********** */
    // g.preload(new Base,[{
    //     id: "butterfly",
    //     src: "assets/butterfly.png"
    // }]);

    /*********animate加载*******/
    // g.preload(new Move, "A81D833FE7C7754FB5395FF7A6EFA6E1");
    /*********不加载********** */
    g.initGame(new Base);
    /***********fps********** */
    FPS.startFPS(stage);

    /*************************************************************************************************** */
    var select = this.document.getElementById("select1");
    select.onchange = function () {
        
        if (g.game.titleScreen.hasEventListener(GFrame.event.OK_BUTTON)) {
            g.game.titleScreen.removeEventListener(GFrame.event.OK_BUTTON, g.okButton);
        } else if (g.game.instructionScreen.hasEventListener(GFrame.event.OK_BUTTON)) {
            g.game.instructionScreen.removeEventListener(GFrame.event.OK_BUTTON, g.okButton);
        } else if (g.game.gameOverScreen.hasEventListener(GFrame.event.OK_BUTTON)) {
            g.game.gameOverScreen.removeEventListener(GFrame.event.OK_BUTTON, g.okButton);
        } else if (g._currentSystemState == GFrame.state.STATE_WAIT) {
            g._switchSystemState(GFrame.state.STATE_WAIT_FOR_CLOSE);
            g.waitTime = 0;
        }

        g.game.clear();
        stage.removeAllEventListeners();

        let index = select.selectedIndex;
        switch (select.options[index].text) {
            case "base":
                g.initGame(new Base);
                break;
            case "move":
                if (!g.a1) {
                    g.preload(new Move, [{
                        id: "butterfly",
                        src: "assets/butterfly.png"
                    }]);
                    g.a1 = true
                } else {
                    g.initGame(new Move);
                }
                break;
            case "sound":
                if (!g.a2) {
                    g.preload(new PlaySound,"A81D833FE7C7754FB5395FF7A6EFA6E1");
                    g.a2 = true
                } else {
                    g.initGame(new PlaySound);
                }
                break;
            case "sprite":
                if (!g.a3) {
                    g.preload(new Sprite,[{
                        id: "woody_0",
                        src: "images/woody_0.png"
                    },{
                        id: "woody_1",
                        src: "images/woody_1.png"
                    },{
                        id: "woody_2",
                        src: "images/woody_2.png"
                    },{
                        id: "guiqizhan",
                        src: "images/guiqizhan.png"
                    },{
                        id:"ma",
                        src:"assets/ma.png"
                    }]);
                    g.a3 = true
                } else {
                    g.initGame(new Sprite);
                }
                break;
            case "withdom":
                if (!g.a2) {
                    g.preload(new DomTest,"A81D833FE7C7754FB5395FF7A6EFA6E1");
                    g.a2 = true
                } else {
                    g.initGame(new DomTest);
                }
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

    class Base extends Game {
        constructor() {
            super();
            //不能使用未加载元素
        }
        /**建立游戏元素游戏初始化
         * 在构造函数外建立
         */
        buildElement() {
            // this.onkey()
        }
        newGame() {
            this.score = 0;
            this.lives = 5;
            this._level = 0;
        }
        newLevel() {
            this.level++;
        }
        waitComplete() {


        }

        runGame() {

        }

    }
    window.Base = Base;
})();