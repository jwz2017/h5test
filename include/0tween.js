(function () {
    "use strict";
    //游戏变量;定义。。构造内初始化，new game初始化
    class Tween extends Game {
        constructor() {
            super();
            let dom=document.getElementById("close");
            dom.style.visibility="visible";
            this.titleScreen.setPosition(width/2,height/10);
            this.titleScreen.fontSize = 24;
            this.titleScreen.setText(
                "// this默认指向get()里的对象\r"+     
                "// alpha不能为0\r"+
                "createjs.Tween.get(ball).wait(2000).to({\r"+
                    "y: ball.y + 400,\r"+
                    "alpha: 0.5\r"+
                "}, 2000, createjs.Ease.quadOut).call(bufferflyGone, [ball], this);\r"+

                "function bufferflyGone(ball) {\r"+
                    "stage.removeChild(ball);\r"+
                "}"
            );
            this.instructionScreen.setText("游戏介绍");
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {

        }
        newGame() {

        }
        newLevel() {

        }
        waitComplete() {
            var ball = new PushButtonShape(stage, null, 60, 60, new Circle);
            ball.regX = ball.regY = 30;
            ball.x = ball.y = 100;
            this.ball1 = new PushButtonShape(stage, null, 60, 60, new Circle);
            this.ball1.regX = this.ball1.regY = 30;
            this.ball1.x=300;
            this.ball1.y=100;
            this.ball1.t=0;
            // createjs缓动
            // this默认指向get()里的对象     
            // alpha不能为0
            createjs.Tween.get(ball).wait(2000).to({
                y: ball.y + 400,
                alpha: 0.5
            }, 2000, createjs.Ease.quadOut).call(bufferflyGone, [ball], this);

            function bufferflyGone(ball) {
                stage.removeChild(ball);
                console.log(this);
            }
            
        }
        runGame() {
            // 运用缓动公式
            this.ball1.t++;
            /**第一个参数：t  计时器，
             * 第二个参数：b 原始位置，
             * 第三个参数：c 运动距离，。
             * 第四个参数：d 影响速度快慢.所用时间
             * 第五个参数：s 返回量，0：没返回，defult:1.70
             * back.easeIn:一开始就往回拉。类似加速运动，（s为0时,没拉回动作）
             *              c=2*b,s=5时，返回到0
             * back.easeOut:减速运动到 c 停止,再进行 easeIn
             * back.easeInOut:先加速再减速到 c ，s不为零时有回拉。
             * back.easeOutIn:先减速到 c/2，再加速。（无s参数）有回拉
             */
            this.ball1.y=easing.back.easeOutIn(this.ball1.t,100,150,200);
            /**没s参数
             * bounce.easeIn:向上弹。最后往上走
             * bounce.easeOut:自由落体，到 c 处弹动。最后往下走
             * bounce.easeInOut:先向上弹动，再到 c处弹动。最后往下走
             * bounce.easeOutIn:先到 c/2处弹动，再 c/2处弹动。最后到达 c 处往上走
             */
            // this.ball1.y=easing.bounce.easeIn(this.ball1.t,0,800,200);//加减速度带弹跳。。。。。。

            /**
             * circ.easeIn:加速运动到 c后，，返回值为NaN.
             * circ.easeOut:减速运动到c 后，再加速运动到原点，返回值为NaN.
             * circ.easeInOut:加速到  c/2.再减速到 c，再加速回源点  返回值为NaN.
             * circ.easeOutIn:减速到 c/2.再加速到c 再加速回源点  返回值为NaN.
             */
            // this.ball1.y=easing.circ.easeOutIn(this.ball1.t,200,500,80);//单纯的加减速度,到目标返回原地后值为 NaN。。。。。。。

            /**
             * cubic.easeIn:加速到 c后继续
             * cubic.easeOut:减速到c后加速继续
             * cubic.easeInOut:先加速到 c/2，再减速到c。再继续向前
             * cubic.easeOutIn:先减速到 c/2，再加速到c。再继续向前
             */
            // this.ball1.y = easing.cubic.easeIn(this.ball1.t, 0, 800, 200); //单纯的加减速度。。。

        }
        clear() {
            super.clear();
        }

    }
    window.Tween = Tween;
})();