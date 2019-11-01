var lib;
const SCORE = "score",
    LEVEL = "level",
    LIVES = "lives",
    PAUSE = "pause";
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
        this.adapt();

        /*********预加载手动********** */
        this.preload([{
            id: "butterfly",
            src: "assets/butterfly.png"
        }]);

        /*********animate加载******* ---------------------------------------1*/
        // let comp = AdobeAn.getComposition("A81D833FE7C7754FB5395FF7A6EFA6E1");
        // lib = comp.getLibrary();
        // this.preload(lib.properties.manifest, comp);

        /*********不加载，直接初始化*************** */
        // this.init();

        FPS.startFPS(stage);
    }
    

    initScreen() {
        let width = stage.canvas.width,
            height = stage.canvas.height;

        mc.style.fontSize = 30; //按钮label字体大小

        this.titleScreen = new BasicScreen();
        this.titleScreen.createDisplayText('开始界面w', width / 2, 200);
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
    let level = 0,
        lives = 5,
        score = 0;
    //游戏变量;
    var butterfly,
    btn;
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
            
            for (let i = 0; i < 6; i++) {
                const butterfly=new createjs.Bitmap("assets/butterfly.png");
                var bb=new createjs.Container();
                bb.regX=bb.regY=50;
                butterfly.x=i*100;
                butterfly.y=i*100;
                createjs.Tween.get(butterfly).wait(i*100).to({
                    rotation:720
                },1000);
                butterfly.t=0;
                bb.addChild(butterfly);
                stage.addChild(bb);
            }
            // this.onkey();
            // butterfly=new lib.Butterfly();
            // butterfly=new createjs.Bitmap(queue.getResult("butterfly"));//
            butterfly=new createjs.Bitmap("assets/butterfly.png");//直接加载地址，image没有width
            console.log(butterfly.image);
            butterfly.regX=butterfly.regY=50;
            createjs.Tween.get(butterfly).to({
                rotation:720
            },1000);
            butterfly.t=0;
            stage.addChild(butterfly);

            mc.style.fontSize=14;
            btn=new PushButton(stage,"button",()=>{

            },50,35);

            /**
             * 交换元素图层
             */
            stage.swapChildren(butterfly,btn);

            /**
             * 鼠标事件以及e.current和currentTarget
             */
            stage.addEventListener('stagemousedown', (e) => {
                butterfly.t=0;
                butterfly.x = stage.mouseX;
                butterfly.y = stage.mouseY;
                console.log(e.target === stage); //stagemousedown的e.target===e.currentTarget===target.
                //mousedown事件才有e.currentTarget==建立侦听的容器（stage）,e.target==butterfly;
            });

            /**
             * 缓动
             */
            /* createjs.Tween.get(butterfly).wait(2000).to({
                y: butterfly.y + 200,
                alpha: 0.5
            }, 1000, createjs.Ease.quadOut).call(bufferflyGone, [butterfly], this); //this默认指向get()里的对象
            function bufferflyGone(img) {
                stage.removeChild(img);
                console.log(this);
            } */
        }
        runGame() {
            /**
             * 运用缓动公式
             */
            butterfly.t++;
            /**第一个参数：t  计时器，
             * 第二个参数：b 原始位置，
             * 第三个参数：c 运动距离，一般为stage的宽高。
             * 第四个参数：d 影响速度快慢.所用时间
             * 第五个参数：s 返回量，0：没返回，defult:1.70
             * back.easeIn:一开始就往回拉。类似加速运动，（s为0时,没拉回动作）
             * back.easeOut:减速运动到 c 停止,再继续往前
             * back.easeInOut:先加速再减速到 c ，s不为零时有回拉。
             * back.easeOutIn:先减速到 c/2，再加速。（无s参数）有回拉
             */
            // butterfly.y=easing.back.easeOutIn(butterfly.t,0,400,200,3);//加减速度带返回拉力。。。。。

            /**此系列没s参数
             * bounce.easeIn:向上弹。最后往上走
             * bounce.easeOut:自由落体，到 c 处弹动。最后往下走
             * bounce.easeInOut:先向上弹动，再到 c处弹动。最后往下走
             * bounce.easeOutIn:先到 c/2处弹动，再 c/2处弹动。最后到达 c 处往上走
             */
            // butterfly.y=easing.bounce.easeIn(butterfly.t,0,800,200);//加减速度带弹跳。。。。。。

            /**
             * circ.easeIn:加速运动到 c后，，再加速回源点  返回值为NaN.
             * circ.easeOut:减速运动到c 后，再加速运动到原点，返回值为NaN.
             * circ.easeInOut:加速到  c/2.再减速到 c，再加速回源点  返回值为NaN.
             * circ.easeOutIn:减速到 c/2.再加速到c 再加速回源点  返回值为NaN.
             */
            // butterfly.y=easing.circ.easeIn(butterfly.t,0,800,200);//单纯的加减速度,到目标返回原地后值为 NaN。。。。。。。

            /**
             * cubic.easeIn:加速到 c后继续
             * cubic.easeOut:减速到c后加速继续
             * cubic.easeInOut:先加速到 c/2，再减速到c。再继续向前
             * cubic.easeOutIn:先减速到 c/2，再加速到c。再继续向前
             */
            // butterfly.y=easing.cubic.easeIn(butterfly.t,0,800,200);//单纯的加减速度。。。*********
            
            //后面待续。。。。。。。
            
            
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