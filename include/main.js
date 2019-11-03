
window.onload = function () {
    "use strict";
    /*************初始化 整个游戏入口*****/
    var g=new GFrame('canvas');
    /**********自适应************* */
    g.adapt();
    /*********预加载手动********** */
    // g.preload(new MyGame,[{
    //     id: "butterfly",
    //     src: "assets/butterfly.png"
    // }]);

    /*********animate加载*******/
    g.preload(new MyGame,"A81D833FE7C7754FB5395FF7A6EFA6E1");
    /***********fps********** */
    FPS.startFPS(stage);

};
(function () {
    "use strict";
    //游戏变量;

    class MyGame extends Game {
        constructor() {
            super();
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {
            this.onkey()
        }
        newGame() {
            this.score = 0;
            this.lives = 5;
            this._level = 0;
        }
        newLevel() {
            this.level++;
        }
       
        runGame() {
            
        }
        


        
        
        
    }
    window.MyGame = MyGame;
})();