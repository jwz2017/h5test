(function () {
    "use strict";
    //游戏变量;定义。。构造内初始化，new game初始化
    var score=0;
    const SCORE="score";
    class LoadBitmap extends Game {
        constructor() {
            super();
            let dom=document.getElementById("close");
            dom.style.visibility="visible";
            this.titleScreen.setPosition(width/2,height/10);
            this.instructionScreen.setPosition(width/2,height/10);
            this.titleScreen.fontSize = 24;
            this.instructionScreen.fontSize = 24;
            this.titleScreen.setText(
                "1:直接加载地址，image没有width,要等加载完成后才有width。\r" +
                "2:queue设置为false可以直接用地址\rqueue=new createjs.LoadQueue(false)\r" +
                "3:bitmap宽度获取:butterfly.image.width\rbutterfly.getBounds().width\r" +
                "4:lib库加载 this.button = new lib.Button()\r" +
                "5:位图九宫格 new createjs.ScaleBitmap（）\r");
            this.instructionScreen.setText(
                "// 直接使用地址  设置false后和getResult等同\r" +
                "// this.butterfly=new createjs.Bitmap(assets/move/butterfly.png);\r" +

                "//B:使用预加载获得地址\r" +
                "this.butterfly = new createjs.Bitmap(queue.getResult(butterfly));\r" +

                "//C:animate库加载        fly和index要在同一目录\r" +
                "// this.button = new lib.Button;\r" +

                "//九宫格使用\r" +
                "this.button = new createjs.ScaleBitmap\r(new lib.Button().image, new createjs.Rectangle(80, 25, 6, 6));\r" +
                "// this.button = new createjs.ScaleBitmap\r(queue.getResult(button), new createjs.Rectangle(80, 25, 6, 6));\r" +
                "this.button.setDrawSize(180, 56);");
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {
            // 使用queue,不能clone   使用地址不能用image.width.
            // 加阴影。。。位图直接加阴影在手机上很卡。。可用矢量加阴影
            // 直接使用地址  设置false后和getResult等同
            // this.butterfly=new createjs.Bitmap("assets/move/butterfly.png");

            //B:使用预加载获得地址
            this.butterfly = new createjs.Bitmap(queue.getResult("butterfly"));
            this.butterfly.x = 200;
            this.butterfly.scaleX = this.butterfly.scaleY = 0.5;

            //C:animate库加载        fly和index要在同一目录
            // this.button = new lib.Button;

            //九宫格使用
            this.button = new createjs.ScaleBitmap(new lib.Button().image, new createjs.Rectangle(80, 25, 6, 6));
            // this.button = new createjs.ScaleBitmap(queue.getResult("button"), new createjs.Rectangle(80, 25, 6, 6));
            this.button.setDrawSize(180, 56);
            this.button.cursor = "pointer";
            /**
             * **********************10声音测试*************************
             * 加载声音后不需要注册，未加载需要 createjs.Sound.registerSound("sound.mp3", "soundId", 4);
             * 加载lib里设置data:"1"：一个声音只能再一个通道里播放。
             * interrupt   点击重新播放
             * sound是AbstractSoundInstance类，是具体的声音控制
             */
            this.button.on("click", () => {
                createjs.Sound.play("woosh");
            });
            this.button1 = new PushButton(null, "ok", () => {
                createjs.Sound.play("p", {
                    interrupt: createjs.Sound.INTERRUPT_ANY
                });

            }, 50, 300);
        }
        newGame() {

        }
        newLevel() {

        }
        waitComplete() {
            // A:dom加入到舞台
            var textTxt = document.getElementById("testTxt");
            this.domElement = new createjs.DOMElement(textTxt);
            this.domElement.x = 280;
            this.domElement.y = 500;
            this.domElement.regX = 100;
            this.domElement.regY = 100;
            textTxt.style.display = "block";
            // B:dom加入到animate
            var nameInput = document.getElementById("inputText");
            nameInput.style.display = "block";
            this.nameInpuElement = new createjs.DOMElement(nameInput);
            this.pop = new lib.Pop();
            this.pop.win.con.addChild(this.nameInpuElement);
            this.pop.y = 100;
            this.pop.x = 53;
            this.nameInpuElement.x = 140;
            this.nameInpuElement.y = 80;
            this.pop.win.btn.cursor = "pointer";
            this.pop.win.btn.on("click", () => {
                this.pop.gotoAndStop(0);
            })
            new PushButton(stage, "dom", () => {
                this.pop.gotoAndPlay(1);
                console.log(this.pop);
            }, 500, 600);
            stage.addChild(this.butterfly, this.button, this.button1, this.domElement, this.pop);
        }
        runGame() {
            this.domElement.rotation+=1;
            score++;
            this.updateScoreBoard(SCORE,score);


        }
        clear() {
            super.clear();
        }
        createScoreBoard(){
            let loaderbarSheet = new createjs.SpriteSheet(queue.getResult('loaderbarData'));
            // GFrame.style.SCOREBOARD_COLOR = "#555"
            this.scoreBoard = new ScoreBoard(0, height - GFrame.style.SCOREBOARD_HEIGHT);
            // this.scoreBoard.createTextElement(SCORE,'0',10,14,{valsheet:spriteSheetLetter,scale:0.7});
            // this.scoreBoard.createTextElement(SCORE, '0', 10, 14, {
            //     valsheet: spriteSheetLetter,
            //     labid: "scoreLabel"
            // },0.7);
            this.scoreBoard.createTextElement(SCORE, '0%', 10, 14, {
                valsheet: loaderbarSheet
            });
        }

    }
    LoadBitmap.loadItem = [{
        id: "butterfly",
        src: "assets/loadBitmap/butterfly.png"
    }];
    LoadBitmap.loaderbar = [{
        id: "loaderbarData",
        src: "assets/loaderbar/loaderbar.json"
    }, {
        id: "loaderbarpic",
        src: "assets/loaderbar/loaderbar.png"
    }];
    LoadBitmap.id = 'A81D833FE7C7754FB5395FF7A6EFA6E1';
    window.LoadBitmap = LoadBitmap;
})();