// window.onload = function () {
//     "use strict";
//     /*************初始化 整个游戏入口*****/
//     var g = new GFrame('canvas');
//     /**********自适应************* */
//     g.adapt();
//     /*********预加载手动********** */
//     g.preload(new Move,[{
//         id: "butterfly",
//         src: "assets/butterfly.png"
//     }]);

//     /*********animate加载*******/
//     // g.preload(new Move, "A81D833FE7C7754FB5395FF7A6EFA6E1");
//     /*********不加载********** */
//     // g.initGame(new Base)
//     /***********fps********** */
//     FPS.startFPS(stage);

// };

(function () {
    "use strict";
    //游戏变量;
    var butterfly;
    class Move extends Game {
        constructor() {
            super();
            
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {
            this.onkey();
            this.titleScreen.setText("缓动测试");
            butterfly=new createjs.Bitmap("assets/butterfly.png");//直接加载地址，image没有width
        }
        newGame() {
            this.score = 0;
            this.lives = 5;
            this._level = 0;
        }
        newLevel() {
            this.level++;
        }
        waitComplete(){
            // butterfly.regX=butterfly.regY=50;
            butterfly.x=200;
            butterfly.y=GFrame.style.SCOREBOARD_HEIGHT;
            butterfly.t=0;
            stage.addChild(butterfly);
            /**
             * 交换元素图层
             */
            // stage.swapChildren(butterfly,btn);
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
            butterfly.y=easing.cubic.easeIn(butterfly.t,0,800,200);//单纯的加减速度。。。*********
            
            //后面待续。。。。。。。
            
            
        }
        clear(){
            super.clear();
            
            
        }
    }
    window.Move = Move;
})();