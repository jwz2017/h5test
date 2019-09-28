var stageScale = 1,
    lib,model;
const SCORE = "score",
    LEVEL = "level",
    LIVES = "lives",
    PAUSE = "pause";
window.onload = function () {
    "use strict";
    /*************初始化 整个游戏入口,开启fps需要加第二个参数 'fps' fps是与dom*****/
    new Main('canvas', 'fps');
    //添加代码

}
class Main extends GFrame {
    constructor(canvasId, fpsid) {
        super(canvasId, fpsid);
        /*********接收animate影片剪辑播放过程发出的事件。***/
        model = new createjs.EventDispatcher();

        /*********自适应*********** */
        this.adapt();

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
    }
    adapt() {
        let stageWidth = document.documentElement.clientWidth,
            stageHeight = document.documentElement.clientHeight,
            width = stage.canvas.width,
            height = stage.canvas.height;
        //高度自适应
        let gameDiv = document.getElementById("game");
        stageScale = stageHeight / height;
        gameDiv.style.left = (stageWidth - width * stageScale) / 2 + 'px';

        //宽带自适应
        // stage.canvas.style.zoom=stageScale;
        stage.canvas.style.width = width * stageScale + 'px';
        
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
        this.scoreBoard.creatTextElement(SCORE, new SideBysideScore(SCORE, '0'));
        this.scoreBoard.creatTextElement(LEVEL, new SideBysideScore(LEVEL, '0'));
        this.scoreBoard.creatTextElement(LIVES, new SideBysideScore(LIVES, '0'));
        this.scoreBoard.creatTextElement(PAUSE, new SideBysideScore(PAUSE, 'press space to pause'), 200, 30);
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
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, LIVES, lives));

        }
        newLevel() {
            level++;
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, LEVEL, level));
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.LEVELIN_UPDATE, LEVEL, LEVEL + ' : ' + level));

        }
        /**levelinscreen等待结束时执行
         * 
         */
        waitComplete() {
            /**以下所有情况都是在canvas自适应的情况下。如果canvas不自适应,哪dom和canvas元素一样操作*********
             * 
             * dom加入stage.
             * 1.当自适应后dom元素不会跟随变化,想要跟随变化，必须1.fps.x,fps.y乘以stagescale   2.fps.scalex,fps.scaleY=stagescale
             * 2.它只支持原生的点击，并且不支持层级，遮罩等功能
             */
            // var fpsdom=document.getElementById("fps"),
            // fps=new createjs.DOMElement(fpsdom);
            // fps.scaleX=fps.scaleY=stageScale;
            // fps.x=fps.y=200*stageScale;
            // stage.addChild(fps);

            /**
             * dom加入容器
             * 1.它只支持原生的点击，并且不支持层级，遮罩等功能
             * 2.当自适应后dom元素不会跟随变化    同上     或者  container.x,container.y乘以stagescale  container.scalex,scaleY=stagescale
             * 但container的其他元素也会变，
             * 所以当container里有dom元素和canvas元素时，不能移动container的x,y.否则dom元素和canvas元素会错位。
             * 要分别操作container里的元素，dom元素同上，canvas元素只需要移动x,y.
             */
            var fpsdom=document.getElementById("fps"),
            ball=new Ball(),
            fps=new createjs.DOMElement(fpsdom);
            this.container=new createjs.Container();
            // this.container.scaleX=this.container.scaleY=stageScale;
            fps.scaleX=fps.scaleY=stageScale;
            fps.x=fps.y=100;
            fps.x=fps.y=100*stageScale;
            this.container.addChild(fps,ball);
            ball.x=ball.y=100;
            stage.addChild(this.container);

            

            
        }
        runGame() {
            // this.container.rotation+=1;
        }
    }
    window.MyGame = MyGame;
})();
   