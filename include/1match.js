var lib;
const SCORE = "score",
    LEVEL = "level",
    LIVES = "lives";
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
        // stage.canvas.height=document.documentElement.clientHeight;
        this.adapt();

        /*********预加载手动********** */
        this.preload([{
            id: "back",
            src: "assets/back.png"
        }, {
            id: "card",
            src: "assets/card.png"
        }, {
            id: "garlic",
            src: "assets/garlic.png"
        }, {
            id: "onion",
            src: "assets/onion.png"
        }, {
            id: "pepper",
            src: "assets/pepper.png"
        }, {
            id: "potato",
            src: "assets/potato.png"
        }, {
            id: "spinach",
            src: "assets/spinach.png"
        }, {
            id: "tomato",
            src: "assets/tomato.png"
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
        this.titleScreen.createDisplayText('开始界面11', width / 2, 300);
        this.titleScreen.createOkButton((width - 300) / 2, height / 2 + 100, 'start', 300, 60);
        // this.titleScreen=new lib.Title();//协作animate使用-------------------1

        this.instructionScreen = new BasicScreen();
        this.instructionScreen.createDisplayText('介绍界面', width / 2, 300);
        this.instructionScreen.createOkButton((width - 300) / 2, height / 2 + 100, 'ok', 300, 60);

        this.levelInScreen = new BasicScreen();
        this.levelInScreen.createDisplayText('level:0', (width) / 2, height / 2, LEVEL);

        this.gameOverScreen = new BasicScreen();
        this.gameOverScreen.createDisplayText('结束界面', width / 2, 300);
        this.gameOverScreen.createOkButton((width - 300) / 2, height / 2 + 100, 'gameover', 300, 60);

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
    let _level = 0,
        _lives = 5,
        _score = 0;
    //游戏变量;
    var faces, cards, selectedCards, matches;
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
            this.score = 0;
            this.lives = 5;
            _level = 0;
            faces = [];
            cards = [];
            selectedCards = [];
            matches = 0;
        }
        newLevel() {
            this.level++;
            faces = ['garlic', 'onion', 'pepper', 'potato', 'spinach', 'tomato'];
        }
        /**levelinscreen等待结束时执行
         * 
         */
        waitComplete() {
            // this.onkey();
            this.buildCards();
            this.shuffleCards(); //洗牌  
            this.deelCards();

        }
        runGame() {


        }
        buildCards() {
            var face, card1, card2;
            for (let i = 0; i < faces.length; i++) {
                face = faces[i],
                    card1 = new Card(face),
                    card2 = new Card(face);
                card1.key = card2.key = faces[i];
                cards.push(card1, card2);
            }
        }
        shuffleCards() {
            var card, randomIndex;
            var l = cards.length;
            var shuffledCards = [];
            for (let i = 0; i < l; i++) {
                randomIndex = Math.floor(Math.random() * cards.length);
                shuffledCards.push(cards[randomIndex]);
                cards.splice(randomIndex, 1);
            }
            cards = cards.concat(shuffledCards);
        }
        deelCards() {
            var xpos = 150,
                ypos = 150;
            var count = 0;
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                card.x = -200;
                card.y = 400;
                card.rotation = Math.floor(Math.random() * 600);
                stage.addChild(card);
                var _this = this;
                card.addEventListener('click', this._onClick = function (e) {
                    _this.onClick1(e);
                })
                createjs.Tween.get(card).wait(i * 100).to({
                    x: xpos,
                    y: ypos,
                    rotation: 0
                }, 300).call(()=>{
                    // card.back.shadow=new createjs.Shadow("#333",4,4,6);
                });
                xpos += 150;
                count++;
                if (count === 4) {
                    count = 0;
                    xpos = 150;
                    ypos += 220;
                }
            }
        }
        onClick1(e) {
            if (selectedCards.length === 2) {
                return;
            }
            var card = e.currentTarget;
            card.mouseEnabled = false;
            card.back.visible = false;

            selectedCards.push(card);
            if (selectedCards.length === 2) {
                if (selectedCards[0].key === selectedCards[1].key) {
                    matches++;
                    this.evalGame();
                } else {
                    setTimeout(() => {
                        selectedCards[0].mouseEnabled = selectedCards[1].mouseEnabled = true;
                        selectedCards[0].back.visible = true;
                        selectedCards[1].back.visible = true;
                        selectedCards = [];
                    }, 1000);
                }
            }
        }
        evalGame() {
            if (matches === faces.length) {
                this.clear();
                stage.dispatchEvent(GFrame.event.GAME_OVER);
            } else {
                selectedCards = [];
            }

        }
        clear() {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                card.removeEventListener('click', this._onClick);
            }
        }

        onkey() {
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
        get score() {
            return _score;
        }
        set score(val) {
            _score = val;
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, SCORE, _score));
        }
        get level() {
            return _level;
        }
        set level(val) {
            _level = val;
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.LEVELIN_UPDATE, LEVEL, LEVEL + ' : ' + _level));
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, LEVEL, _level));
        }
        get lives() {
            return _lives;
        }
        set lives(val) {
            _lives = val;
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, LIVES, _lives));
        }
    }
    window.MyGame = MyGame;
})();

class Card extends createjs.Container {
    constructor(face, card = "card", back = "back") {
        super();
        this.back = new createjs.Bitmap(queue.getResult("card")); //使用queue,不能clone   使用地址不能用image.width.要直接用数字
        this.back.shadow=new createjs.Shadow("#333",3,3,5);
        this.regX = this.back.image.width / 2;
        this.regY = this.back.image.height / 2;
        this.addChild(this.back);

        this.back = new createjs.Bitmap(queue.getResult(face));
        this.back.regX = this.back.image.width / 2;
        this.back.regY = this.back.image.height / 2;
        this.addChild(this.back);
        this.back.x = this.regX;
        this.back.y = 70;
        this.label = new createjs.Text(face.toUpperCase(), "20px Arial", "#000");
        this.label.textAlign = "center";
        this.label.x = this.regX;
        this.label.y = 144;
        this.addChild(this.label);
        this.back = new createjs.Bitmap(queue.getResult('back'));
        this.addChild(this.back);

    }
}