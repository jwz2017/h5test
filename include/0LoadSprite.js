(function () {
    "use strict";
    //游戏变量;定义。。构造内初始化，new game初始化
    class LoadSprite extends Game {
        constructor() {
            super();
            this.titleScreen.fontSize = 24;
            this.titleScreen.setText(
                "1:animation随机播放速度\r"+
                "die.framerate=Math.floor(Math.random() * 20) + 20;\r"+ 
                "die.advance(3000);\r");
            this.instructionScreen.setText("游戏介绍");
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {
            this.ma=new ma();
            this.ma.x=180;
            this.ma.y=400;
        }
        newGame() {

        }
        newLevel() {

        }
        waitComplete() {
            stage.addChild(this.ma);
            
            let xpos = 200,
                ypos = 137,
                hgap = 60,
                spriteSheet = new createjs.SpriteSheet(queue.getResult('loadspritedata'));
            for (let i = 0; i < 6; i++) {
                const die = new createjs.Sprite(spriteSheet, 'die');
                die.paused = true;
                die.name = "die" + i;
                die.regX = die.getBounds().width / 2;
                die.regY = die.getBounds().height / 2;
                die.x = xpos;
                die.y = ypos;
                xpos += hgap;
                stage.addChild(die);
            }
            this.button = new PushButton(stage, "点击", this.click, 300, 200, );
        }
        click() {
            this.mouseEnabled=false;
            this.alpha=0.5;
            for (let i = 0; i < 6; i++) {
                const die = stage.getChildByName('die' + i);
                die.framerate = Math.floor(Math.random() * 20) + 20; 
                die.advance(3000); //随机数字
                die.play();
            }
            setTimeout(() => { //1000ms后执行
                for (let i = 0; i < 6; i++) {
                    const die = stage.getChildByName('die' + i);
                    die.stop();
                    console.log(Math.floor(die.currentAnimationFrame)); //获取当前帧
                    //currentFrame     currentAnimation
                }
                this.alpha = 1;//this指向pushputtonshape ()=>指向loadsprite
                this.mouseEnabled = true;
            }, 1000);
        }
        runGame() {

        }
        clear() {
            super.clear();
        }

    }
    LoadSprite.loadItem = [{
        id: "loadspritedata",
        src: "assets/loadsprite/fakezee.json"
    }, {
        id: "loadspritepic",
        src: "assets/loadsprite/fakezee.png"
    },{
        id:"mapic",
        src:"assets/loadsprite/ma.png"
    }];
    window.LoadSprite = LoadSprite;
})();