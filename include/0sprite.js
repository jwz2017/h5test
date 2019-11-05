// window.onload = function () {
//     "use strict";
//     /*************初始化 整个游戏入口*****/
//     var g = new GFrame('canvas');
//     /**********自适应************* */
//     g.adapt();
//     /*********预加载手动********** */
//     g.preload(Sprite,[{
//         id: "woody_0",
//         src: "images/woody_0.png"
//     },{
//         id: "woody_1",
//         src: "images/woody_1.png"
//     },{
//         id: "woody_2",
//         src: "images/woody_2.png"
//     },{
//         id: "guiqizhan",
//         src: "images/guiqizhan.png"
//     },{
//         id:"ma",
//         src:"assets/ma.png"
//     }]);

//     /*********animate加载*******/
//     // g.preload(Sprite, "A81D833FE7C7754FB5395FF7A6EFA6E1");
//     /*********不加载********** */
//     // g.initGame(Sprite)
//     /***********fps********** */
//     FPS.startFPS(stage);

// };
(function () {
    "use strict";
    //游戏变量;
    var score,level;
    class Sprite extends Game {
        constructor() {
            super();
            this.titleScreen.setText("sprite测试");
            this.instructionScreen.setText("w,a,s,d=上下左右，\n小键盘4756出拳");
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {
            this.spriteData = {
                images: ["images/woody_0.png", "images/woody_1.png", "images/woody_2.png"],
                frames: {
                    width: 80,
                    height: 80,
                    regX: 40,
                    regY: 40
                },
                animations: {
                    stand: [0, 3, "stand", 0.1], //[]表示从0到3帧
                    walk: { //{}表示逐帧
                        frames: [4, 5, 6, 7, 6, 5],
                        next: "walk", //没有next就停止在末帧
                        speed: 0.3
                    },
                    run: {
                        frames: [20, 21, 22, 21],
                        next: "run",
                        speed: 0.1
                    },
                    somersault: {
                        frames: [58, 59, 69, 58, 59, 69],
                        next: "stand",
                        speed: 0.2
                    },
                    attack1: [10, 13, "stand", 0.2],
                    attack2: [14, 17, "stand", 0.2],
                    attack3: {
                        frames: [8, 9, 19],
                        next: "stand",
                        speed: 0.2
                    },
                    jump: {
                        frames: [60, 61, 62],
                        next: "jumpSky",
                        speed: 0.3
                    },
                    jumpSky: {
                        frames: [62],
                        speed: 0.3
                    },
                    crouch: {
                        frames: [61],
                        next: "stand",
                        speed: 0.3
                    },
                    runJump: {
                        frames: [112],
                        speed: 0.3
                    },
                    guiqizhan:{
                        frames: [140,141,142,143,144,145,146,147,148,149,150,151],
                        next: "stand",
                        speed: 0.3
                    }
                }
            }
            
            /**
             * 简单使用sprite
             */
            var spriteSheet=new createjs.SpriteSheet(this.spriteData);
            this.sprite=new createjs.Sprite(spriteSheet,"walk");
            this.sprite.x=this.sprite.y=200;
            // sprite.paused=false;

            /**
             * 用animate制作sprite
             */
            
            this.ma=new ma();
            this.ma.x=300;
            this.ma.y=100;
            this.ma.gotoAndPlay("run");

            /**
             * 使用BasePeople类
             */
            this.people=new People(this.spriteData);
            this.people.x=200;
            this.people.y=600;
            this.onkey();
        }
        newGame() {
            score = 0;
            this.updateScoreBoard(SCORE,score);
            level = 0;
        }
        newLevel() {
            level++;
            this.updateScoreBoard(LEVEL,level);
        }
        waitComplete() {
            stage.addChild(this.ma);
            stage.addChild(this.sprite);
            stage.addChild(this.people);
        }

        runGame() {

        }
        onkey(){
            //左 37 ，右39，上38，下，40
            document.onkeyup = (e) => {
                switch (e.keyCode) {
                    case 65:
                        this.leftKeyDown = false;
                        if (this.people.arrow == "left") {
                            this.people.stopWalk();
                        }
                        break;
                    case 68:
                        this.rightKeyDown = false;
                        if (this.people.arrow == "right") {
                            this.people.stopWalk();
                        }
                        break;
                    case 87:
                        this.upKeyDown = false;
                        break;
                    case 83:
                        this.downKeyDown = false;
                        break;
                    case 100:
                        this.attackKeyDown = false;
                        break;
                    case 102:
                        this.attackKeyDown3 = false;
                        break;
                    case 103:
                        this.guiqizhankeyDown = false;
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
                            this.leftTic++;
                            this.people.startWalk(-this.people.walkSpeedX, 0);
                            setTimeout(() => {
                                if (this.leftTic >= 2) {
                                    this.people.startWalk(-this.people.runSpeedX, 0, "run");
                                }
                                this.leftTic = 0;
                            }, 200);
                        }
                        break;
                    case 68:
                        if (!this.rightKeyDown) {
                            this.rightKeyDown = true;
                            this.rightTic++;
                            this.people.startWalk(this.people.walkSpeedX, 0);
                            setTimeout(() => {
                                if (this.rightTic >= 2) {
                                    this.people.startWalk(this.people.runSpeedX, 0, "run");
                                }
                                this.rightTic = 0;
                            }, 200);
                        }
                        break;
                    case 87:
                        if (!this.upKeyDown) {
                            this.upKeyDown = true;
                            this.people.jump();

                        }
                        break;
                    case 83:
                        if (!this.downKeyDown) {
                            this.downKeyDown = true;
                            this.people.startDecelerate();
                        }
                        break;
                    case 100:
                        // if (!this.attackKeyDown) {//按攻击键是否持续攻击
                            this.attackKeyDown = true;
                            this.people.startAttack();
                        // }
                        break;
                    case 102:
                        if (!this.attackKeyDown3) {
                            this.attackKeyDown3 = true;
                            this.people.startAttack(3);
                        }
                        break;
                    case 103:
                        if (!this.guiqizhankeyDown) {
                            this.guiqizhankeyDown = true;
                            this.people.startGuiqizhan();
                        }
                        break;
                    default:
                }
            };
        }
        clear(){
            super.clear();
            this.onkey=super.onkey;
        }
    }
    window.Sprite = Sprite;

    class People extends BasePeople {
        constructor(spriteData) {
            super();
            this.setSpriteData(spriteData);
        }
        startGuiqizhan(){
            if(this.busy) return;
            this.stop();
            this.animation.gotoAndPlay("guiqizhan");
            var _this=this;
            this.addEventListener("tick",this._guiqizhaning=function(){
                _this.guiqizhaning();
            });
            this.busy=true;//设置技能期间不能用其他技能。
            
        }
        guiqizhaning(){
            if(this.animation.currentFrame==144){
                if(this.guiqizhan1!=1){
                    let guiqizhan1=new Guiqizhan();
                    this.parent.addChild(guiqizhan1);
                    guiqizhan1.x=this.x+(this.arrow=="left"?-30:30);
                    guiqizhan1.y=this.y;
                    guiqizhan1.arrow=this.arrow;
                    var num=(this.arrow=="left"?-10:10);
                    guiqizhan1.startRun(num,0.5,"run2");
                    this.guiqizhan1=1;
                }
            }
            else if(this.animation.currentFrame==147){
                if(this.guiqizhan2 !=1){
                    var guiqizhan2=new Guiqizhan();
                    this.parent.addChild(guiqizhan2);
                    guiqizhan2.x=this.x+(this.arrow=="left"?-30:30);
                    guiqizhan2.y=this.y;
                    guiqizhan2.arrow=this.arrow;
                    var num=(this.arrow=="left"?-10:10);
                    guiqizhan2.startRun(num,-0.5,"run");
                    this.guiqizhan2=1;
                }
            }
            else if(this.animation.currentFrame==151){
                this.stopguiqizhan();
                this.guiqizhan1=0;
                this.guiqizhan2=0;
            }
        }
        stopguiqizhan(){
            this.animation.gotoAndPlay("stand");
            this.removeEventListener("tick",this._guiqizhaning);
            this.busy=false;
        }
    
    }
    
    
    class Guiqizhan extends Barrage{
        constructor(){
            super();
        }
        initData(){
            var skilData={
                images: ["images/guiqizhan.png"],
            frames: {width: 82, height: 83, regX: 41, regY: 41.5},
            animations: {
                run: [0, 3, "run", 0.3],
                hit: [4, 7, "", 0.3],
                run2: [8, 11, "run2", 0.3]
            }
            };
            this.spriteSheet = new createjs.SpriteSheet(skilData);
            this.animation = new createjs.Sprite(this.spriteSheet, "run");
            this.addChild(this.animation);
        }
        
    }
})();