/**目录
 * 1:位图加载。
 *      a:直接地址加载                 68
 *      b:预加载                      71
 *      c:animate库加载               74
 *      d:TP制作sprite                77
 *      e:animate制作sprite           80
 * 2:GrphicsUtils绘制工具测试          
 *      a:画虚线                      90
 *      b:画扇形                      99
 *      c:同心圆                      102
 * 3:mc组件测试                       106
 * 4:utils工具类                   
 *      a:parseColor颜色转换          114
 *      b:randomColor随机颜色         117
 *      c:drawPoints绘制图形          120
 *      d:Array随机排序               131
 * 5:ScaleBitmap九宫图                136
 * 6:交换元素图层                      165
 * 7:e.target和currentTarget          171
 * 8:createjs缓动                     204
 * 9:运用缓动公式                      221
 * 10声音测试                           374
 * 11与dom协作                         160
 *      a:dom加入到舞台                400
 *      b:dom加入到animate              409
 * 12图片字体bitmapText                 436
 * 
 * 
 * /使用queue,不能clone   使用地址不能用image.width.
 * 加阴影。。。位图直接加阴影在手机上很卡。。可用矢量加阴影
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
(function () {
    "use strict";
    //游戏变量;
    var score = 0;
    const SCORE = "score";
    var butterfly, shape, pushbuttonShap, arrowbuttonShap, checkboxShap,
        sliderShap, checkbox, radiobutton1, radiobutton2, radiobutton3,
        slider, scorecontainer, button, spriteSheet, ball, spriteSheetLetter;
    const NUM_DICE = 6;
    class Base extends Game {
        constructor() {
            super();
            this.titleScreen.setText("基础类测试");
        }
        initSprite() { //sprite:spriteSheet初始
            spriteSheet = new createjs.SpriteSheet(queue.getResult('spriteData'));
            spriteSheetLetter = new createjs.SpriteSheet(queue.getResult('lettersData'));
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {
            /**
             * *******************1:位图加载************************************
             * 一:直接加载地址，image没有width,要等加载完成后才有width.
             * 二:bitmap的宽度获取:butterfly.image.width,butterfly.getBounds().width
             */

            // A:直接加载地址:
            // butterfly = new createjs.Bitmap("assets/butterfly.png"); 

            //B:预加载
            butterfly = new createjs.Bitmap(queue.getResult("butterfly1"));

            //C:animate库加载        fly和index要在同一目录
            button = new createjs.ScaleBitmap(new lib.Button().image, new createjs.Rectangle(80, 25, 6, 6));

            //D:TP制作sprite    
            this.spriteLoad();

            //E:animate制作sprite       在末帧停止："run"改为 ""
            this.ma1 = new ma();
            this.ma1.gotoAndPlay("run");

            /**
             * ******************2:GrphicsUtils绘制工具测试*******************************
             */
            shape = new createjs.Shape();
            shape.graphics.setStrokeStyle(3).beginStroke('#000000');

            //A:画虚线
            GraphicsUtils.drawLine(shape.graphics, {
                x: 700,
                y: 50
            }, {
                x: 0,
                y: 50
            }, 20, 1);

            //B:画扇形
            GraphicsUtils.drawSector(shape.graphics, 100, 200, 100, 100, 0, 90);

            //C:同心圆
            GraphicsUtils.drawRing(shape.graphics, 300, 200, 100, 100, 0, 180, 0.5);

            /**
             * *****************3:mc组件测试******************************************
             */
            // mc.style.setStyle("dark");
            this.mc();

            /**
             * **********************4:utils工具类**************************************
             */
            //A:parseColor颜色转换
            console.log(utils.parseColor(0xffffff));

            //B:randomColor随机颜色
            console.log(utils.randomColor());

            //C:drawPoints绘制图形
            shape.graphics.beginFill("#333");
            var mat = new createjs.Matrix2D().translate(200, 200).rotate(180);
            var points = [
                [0, -25],
                [25, 25],
                [-25, 25],
                [0, -25]
            ];
            utils.drawPoints(shape.graphics, mat, points);

            //D:Array随机排序
            utils.randomArray(points);
            console.log(points);

            /**
             * ***********************5:ScaleBitmap九宫图*******************************166.56
             */
            // button = new createjs.ScaleBitmap(queue.getResult("button"), new createjs.Rectangle(80, 25, 6, 6));
            button.setDrawSize(200, 56);
            console.log(button.drawWidth);
            this.ma1.x = 200;
            this.ma1.y = 500;
            button.x = 250;
            button.y = 250;
            this.titleScreen.addChild(shape);
            this.instructionScreen.addChild(button, this.ma1);
        }
        waitComplete() {
            butterfly.x = 200;
            butterfly.t = 0;
            butterfly.scaleX = butterfly.scaleY = 0.5;
            ball = new Ball("#ff0000", 40);
            ball.x = 160;
            ball.y = 20;
            var text = new createjs.Text("声音测试", "30px Calibri", "#00ff00");
            text.x = 160;
            text.y = 150;
            scorecontainer.addChild(text);

            /**
             * *****************11与dom协作*************************************
             */
            this.withDom();

            /**
             * *****************6:交换元素图层************************************
             */
            stage.addChild(ball, butterfly, scorecontainer);
            stage.swapChildren(butterfly, ball); //交换图层

            /**
             * ******************7:e.target和currentTarget*************************
             * stagemousedown的e.target===e.currentTarget===stage.
             * mousedown事件才有e.currentTarget==建立侦听的容器（stage）,e.target==butterfly;
             */
            stage.addEventListener('stagemousedown', (e) => {
                butterfly.t = 0;
                butterfly.x = stage.mouseX;
                butterfly.y = stage.mouseY;
            });




















            /**
             * ********************8:createjs缓动********************************************
             * this默认指向get()里的对象     
             * alpha不能为0
             */
            /*  createjs.Tween.get(butterfly).wait(2000).to({
                 y: butterfly.y + 400,
                 alpha: 0.5
             }, 2000, createjs.Ease.quadOut).call(bufferflyGone, [butterfly], this); //this默认指向get()里的对象
             function bufferflyGone(img) {
                 stage.removeChild(img);
                 console.log(this);
             } */
        }
        runGame() {
            this.domElement.rotation += 1;
            score++;
            this.updateScoreBoard(SCORE, score);
            /**
             * *******************9:运用缓动公式***********************************************
             */
            butterfly.t++;
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
            butterfly.y = easing.back.easeOutIn(butterfly.t, 200, 400, 150, 5); //加减速度带返回拉力。。。。。

            /**此系列没s参数
             * bounce.easeIn:向上弹。最后往上走
             * bounce.easeOut:自由落体，到 c 处弹动。最后往下走
             * bounce.easeInOut:先向上弹动，再到 c处弹动。最后往下走
             * bounce.easeOutIn:先到 c/2处弹动，再 c/2处弹动。最后到达 c 处往上走
             */
            // butterfly.y=easing.bounce.easeIn(butterfly.t,0,800,200);//加减速度带弹跳。。。。。。

            /**
             * circ.easeIn:加速运动到 c后，，返回值为NaN.
             * circ.easeOut:减速运动到c 后，再加速运动到原点，返回值为NaN.
             * circ.easeInOut:加速到  c/2.再减速到 c，再加速回源点  返回值为NaN.
             * circ.easeOutIn:减速到 c/2.再加速到c 再加速回源点  返回值为NaN.
             */
            // butterfly.y=easing.circ.easeOutIn(butterfly.t,200,500,80);//单纯的加减速度,到目标返回原地后值为 NaN。。。。。。。

            /**
             * cubic.easeIn:加速到 c后继续
             * cubic.easeOut:减速到c后加速继续
             * cubic.easeInOut:先加速到 c/2，再减速到c。再继续向前
             * cubic.easeOutIn:先减速到 c/2，再加速到c。再继续向前
             */
            // butterfly.y = easing.cubic.easeIn(butterfly.t, 0, 800, 200); //单纯的加减速度。。。*********

            //后面待续。。。。。。。


        }
        spriteLoad() {
            let xpos = 200,
                ypos = 137,
                hgap = 60;
            for (let i = 0; i < NUM_DICE; i++) {
                const die = new createjs.Sprite(spriteSheet, 'die');
                die.paused = true;
                die.name = "die" + i;
                die.regX = die.getBounds().width / 2;
                die.regY = die.getBounds().height / 2;
                die.x = xpos;
                die.y = ypos;
                xpos += hgap;
                this.instructionScreen.addChild(die);
            }
            button.cursor = "pointer";
            button.on("click", onclick, this);

            function onclick(e) {
                let button = e.currentTarget;
                button.mouseEnabled = false;
                button.alpha = 0.7;
                for (let i = 0; i < NUM_DICE; i++) {
                    const die = this.instructionScreen.getChildByName('die' + i);
                    die.framerate = Math.floor(Math.random() * 20) + 20; //
                    die.advance(3000); //随机数字
                    die.play();
                }
                setTimeout(() => { //1000ms后执行
                    for (let i = 0; i < NUM_DICE; i++) {
                        const die = this.instructionScreen.getChildByName('die' + i);
                        die.stop();
                        console.log(Math.floor(die.currentAnimationFrame)); //获取当前帧
                        //currentFrame     currentAnimation
                    }
                    button.alpha = 1;
                    button.mouseEnabled = true;
                }, 1000);
            }
        }
        mc() {
            //ScrollContainer 窗口容器
            scorecontainer = new ScrollContainer(stage.canvas, null, 0, 0, 600, 800, 1500, 1200);

            //按钮图形 Rect Circle Arrow RoundRect Star
            pushbuttonShap = new PushButtonShape(scorecontainer, () => {
                this.testSound1();
            }, 100, 40, new Rect());
            pushbuttonShap.x = 100;
            pushbuttonShap.y = 100;
            // pushbuttonShap.toggle=true;

            //带三角的按钮图形  Rect Circle RoundRect
            arrowbuttonShap = new ArrowButtonShape(scorecontainer, () => {
                this.testSound2()
            }, 70, 70, 90, new RoundRect(20));
            arrowbuttonShap.x = 300;
            arrowbuttonShap.y = 100;

            //checkBoxShape图形 Rect Circle RoundRect star
            checkboxShap = new CheckBoxShape(scorecontainer, () => {
                console.log(checkboxShap.selected);
            }, false, 40, 40, new Star);
            checkboxShap.x = 450;
            checkboxShap.y = 100;

            //sliderShape图形 Rect RoundRect
            sliderShap = new SliderShape(scorecontainer, () => {
                console.log(sliderShap.value);
            }, 210, 30, new RoundRect(15), false);
            sliderShap.x = 100;
            sliderShap.y = 200;
            sliderShap.continuous = false;

            //checkbox Rect RoundRect Circle Star
            mc.style.fontSize = 24;
            checkbox = new CheckBox(scorecontainer, "黑色", () => {
                console.log(checkbox.selected);
            }, false, 450, 700, 24, 24, new Circle);

            //RadioButton单选框  Rect RoundRect Circle Star
            radiobutton1 = new RadioButton(scorecontainer, "白色", handle, false, 450, 500, 24, 24, new Rect);
            radiobutton2 = new RadioButton(scorecontainer, "蓝色", handle, false, 450, 530, 24, 24, new Rect);
            radiobutton3 = new RadioButton(scorecontainer, "红色", handle, false, 450, 560, 24, 24, new Rect);

            function handle() {
                switch (RadioButton.selectedButton) {
                    case radiobutton1:
                        console.log("白色");

                        break;
                    case radiobutton2:
                        console.log("蓝色");
                        break;
                    case radiobutton3:
                        console.log("红色");
                        break;

                    default:
                        break;
                }
            }

            //slider  Rect RoundRect
            slider = new Slider(scorecontainer, "分数", () => {
                console.log(slider.value);
            }, 120, 500, 230, 24, new Rect, true);
        }

        /**
         * **********************10声音测试*************************
         * 加载声音后不需要注册，未加载需要 createjs.Sound.registerSound("sound.mp3", "soundId", 4);
         * 加载lib里设置data:"1"：一个声音只能再一个通道里播放。
         * interrupt   点击重新播放
         * sound是AbstractSoundInstance类，是具体的声音控制
         */
        testSound1() {
            var sound = createjs.Sound.play('p', {
                interrupt: createjs.Sound.INTERRUPT_ANY
            });
            sound.volume = 0.5;
            sound.on("complete", () => {

            });
        }
        testSound2() {
            createjs.Sound.play('woosh');
            // createjs.Sound.on("fileload", this.loadHandler, this);
            // createjs.Sound.registerSound("path/to/mySound.ogg", "sound");
            // function loadHandler(event) {
            //     // 这会引发针对每个已注册的声音。
            //     var instance = createjs.Sound.play("sound");  // 使用id。也可以使用完整路径或event.src来源。
            //     instance.on("complete", this.handleComplete, this);
            //     instance.volume = 0.5;
            // }
        }
        withDom() {
            // A:dom加入到舞台
            var textTxt = document.getElementById("testTxt");
            this.domElement = new createjs.DOMElement(textTxt);
            this.domElement.x = 280;
            this.domElement.y = 950;
            this.domElement.regX = 100;
            this.domElement.regY = 100;
            textTxt.style.display = "block";
            stage.addChild(this.domElement);
            // B:dom加入到animate
            var openBtn = document.getElementById("openBtn");
            openBtn.style.display = "block";
            this.openBtnElement = new createjs.DOMElement(openBtn);
            this.openBtnElement.x = 601;
            this.openBtnElement.y = 900;
            openBtn.onclick = () => {
                this.pop.gotoAndPlay(1);
            }

            var nameInput = document.getElementById("inputText");
            nameInput.style.display = "block";
            this.nameInpuElement = new createjs.DOMElement(nameInput);
            this.pop = new lib.Pop();
            this.pop.win.con.addChild(this.nameInpuElement);
            this.pop.y = 300;
            this.pop.x = 53;
            this.nameInpuElement.x = 140;
            this.nameInpuElement.y = 80;
            this.pop.win.btn.cursor = "pointer";
            this.pop.win.btn.on("click", () => {
                this.pop.gotoAndStop(0);
            })
            stage.addChild(this.domElement, this.openBtnElement, this.pop);
        }

        /**
         * ********************12图片字体bitmapText***************************** 
         */
        createScoreBoard() {
            GFrame.style.SCOREBOARD_COLOR = "#555"
            this.scoreBoard = new ScoreBoard(0, stage.canvas.height - GFrame.style.SCOREBOARD_HEIGHT);
            // this.scoreBoard.createTextElement(SCORE,'0',10,14,{valsheet:spriteSheetLetter,scale:0.7});
            this.scoreBoard.createTextElement(SCORE, '0', 10, 14, {
                valsheet: spriteSheetLetter,
                labid: "scoreLabel",
                scale: 0.7
            });
        }

    }
    Base.loadItem = [{
        id: "butterfly1",
        src: "assets/move/butterfly.png"
    }, {
        id: "spriteData",
        src: "assets/fakezee/fakezee.json"
    }, {
        id: "spritePic",
        src: "assets/fakezee/fakezee.png"
    }, {
        id: "ma",
        src: "assets/move/ma.png"
    }, {
        id: "letters",
        src: "assets/move/letters.png"
    }, {
        id: "lettersData",
        src: "assets/move/letter.json"
    }, {
        id: "scoreLabel",
        src: "assets/move/score.png"
    }];

    Base.id = 'A81D833FE7C7754FB5395FF7A6EFA6E1';
    window.Base = Base;
})();