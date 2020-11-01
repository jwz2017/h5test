(function () {
    "use strict";
    //游戏变量;定义。。构造内初始化，new game初始化
    var spriteData;
    class Sprite extends Game {
        constructor() {
            super();
            this.titleScreen.setText("sprite测试");
            this.instructionScreen.setText("w,a,s,d=上下左右，\n小键盘4756出拳");
        }

        /**建立游戏元素游戏初始化
         * 在构造函数内建立
         */
        buildElement() {
            spriteData = {
                images: [queue.getResult("woody_0"), "assets/sprite/woody_1.png", queue.getResult("woody_2")],
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
                    roll: {
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
                    guiqizhan: {
                        frames: [140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151],
                        next: "stand",
                        speed: 0.3
                    }
                }
            }
            this.onkey()
            this.people = new People1(spriteData);
            this.people.x = 200;
            this.people.y = 600;
        }
        waitComplete() {
            stage.addChild(this.people);
        }
        runGame() {
            this.people.animation();
        }
        onkey() {
            //左 37 ，右39，上38，下，40
            document.onkeyup = (e) => {
                switch (e.keyCode) {
                    case 65:
                        this.people.leftKeyDown = false;
                        // this.people.stopMove()
                        break;
                    case 68:
                        this.people.rightKeyDown = false;
                        // this.people.stopMove();
                        break;
                    case 87:
                        this.people.upKeyDown = false;
                        // this.people.stopMove();
                        break;
                    case 83:
                        this.people.downKeyDown = false;
                        // this.people.stopMove();
                        break;
                    case 100:
                        this.people.attackKeyDown = false;
                        break;
                    case 102:
                        this.people.attackKeyDown3 = false;
                        break;
                    case 103:
                        this.people.guiqizhankeyDown = false;
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
                        if (!this.people.leftKeyDown) {
                            this.people.leftKeyDown = true;
                            this.people.arrow = "left";
                            this.people.startWalk();
                        }
                        break;
                    case 68:
                        if (!this.people.rightKeyDown) {
                            this.people.rightKeyDown = true;
                            this.people.arrow = "right";
                            this.people.startWalk();
                        }
                        break;
                    case 87:
                        if (!this.people.upKeyDown) {
                            this.people.upKeyDown = true;
                            this.people.startJump();
                            // this.people.startWalkUp(true)

                        }
                        break;
                    case 83:
                        if (!this.people.downKeyDown) {
                            this.people.downKeyDown = true;
                            this.people.startRoll();
                            // this.people.startWalkUp(false);
                        }
                        break;
                    case 100:
                        if (!this.people.attackKeyDown) { //按攻击键是否持续攻击
                            // this.people.attackKeyDown = true;
                            this.people.startAttack1();
                        }
                        break;
                    case 102:
                        if (!this.people.attackKeyDown3) {
                            this.people.attackKeyDown3 = true;
                            this.people.startAttack2();
                        }
                        break;
                    case 103:
                        if (!this.people.guiqizhankeyDown) {
                            this.people.guiqizhankeyDown = true;
                            this.people.startguiqizhan();
                        }
                        break;
                    default:
                }
            };
        }

    }
    Sprite.loadItem = [{
        id: "woody_0",
        src: "assets/sprite/woody_0.png"
    }, {
        id: "woody_1",
        src: "assets/sprite/woody_1.png"
    }, {
        id: "woody_2",
        src: "assets/sprite/woody_2.png"
    }, {
        id: "guiqizhan",
        src: "assets/sprite/guiqizhan.png"
    }];
    window.Sprite = Sprite;
})();

/**
 * 人物继承实例
 */
class People1 extends BasePeople {
    constructor(data) {
        super(data);
        this.skilData = {
            images: [queue.getResult('guiqizhan')],
            frames: {
                width: 82,
                height: 83,
                regX: 41,
                regY: 41.5
            },
            animations: {
                run: [0, 3, "run", 0.3],
                hit: [4, 7, "", 0.3],
                run2: [8, 11, "run2", 0.3]
            }
        };
    }
    startguiqizhan() {
        if (this.attack2 || this.attack3) {
            return;
        }
        if (!this.busy || this.attack1) {
            this.busy = true;
            this.attack3 = true;
            this.sprite.gotoAndPlay("guiqizhan");
            this.animation = this.guiqizhaning;
        }
    }
    guiqizhaning() {
        if (this.sprite.currentFrame == 144) {
            if (!this._guiqizhan1) {
                let guiqizhan1 = new Barrage(this.skilData);
                this.parent.addChild(guiqizhan1);
                guiqizhan1.x = this.x + (this.arrow == "left" ? -30 : 30);
                guiqizhan1.y = this.y;
                guiqizhan1.arrow = this.arrow;
                let vx = (this.arrow == "left" ? -10 : 10);
                guiqizhan1.startRun(vx, -0.5, "run2");
                this._guiqizhan1 = true;
            }
        }
        if (this.sprite.currentFrame == 147) {
            if (!this._guiqizhan2) {
                let guiqizhan2 = new Barrage(this.skilData);
                this.parent.addChild(guiqizhan2);
                guiqizhan2.x = this.x + (this.arrow == "left" ? -30 : 30);
                guiqizhan2.y = this.y;
                guiqizhan2.arrow = this.arrow;
                let vx = (this.arrow == "left" ? -10 : 10);
                guiqizhan2.startRun(vx, 0.5, "run");
                this._guiqizhan2 = true;
            }
        }
        super.attacking();
    }
    stopAttack() {
        super.stopAttack();
        this.attack3 = false;
        this._guiqizhan1 = false;
        this._guiqizhan2 = false;
    }
}
