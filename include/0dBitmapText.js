// window.onload = function () {
//     "use strict";
//     /*************初始化 整个游戏入口*****/
//     var g = new GFrame('canvas');
//     /**********自适应************* */
//     g.adapt();
//     /*********预加载手动********** */
//     g.preload(BitmapText);

//     /***********fps********** */
//     FPS.startFPS(stage);
// };

(function () {
    "use strict";
    //游戏变量;
    var score, level,spritesheetbar,valspritesheet;
    class BitmapText extends Game {
        constructor() {
            super();
            this.titleScreen.setText("使用bitmapText测试,\n替换分数板");
        }
        /**建立游戏元素游戏初始化
         * 在构造函数内建立
         */
        buildElement() {
            // this.onkey()
            spritesheetbar=new createjs.SpriteSheet(queue.getResult("fakezeeSpritesheetData"));
            valspritesheet=new createjs.SpriteSheet(queue.getResult("lettersData"));
        }
        initScreen() {
            let width = stage.canvas.width,
                height = stage.canvas.height;

            mc.style.fontSize = 40; //按钮label字体大小

            this.titleScreen = new BasicScreen();
            this.titleScreen.createDisplayText('bitmapText测试', width / 2, 300);
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

            this.scoreBoard = new ScoreBoard(0,0,{sheet:spritesheetbar,ani:"scoreBar"});
            this.scoreBoard.createTextElement(SCORE,'0',10,14,{valsheet:valspritesheet,labsheet:spritesheetbar,labani:"fives_score"});
            // this.scoreBoard.createTextElement(SCORE,'0',10,14,{valsheet:valspritesheet,labid:"score"});
            this.scoreBoard.createTextElement(LEVEL, '0',320,14);
        }
        newGame() {
            score = 0;
            this.updateScoreBoard(SCORE, score);
            level = 0;
        }
        newLevel() {
            level++;
            this.updateScoreBoard(LEVEL, level);
            this.updateLevelInScreen(level);
        }
        waitComplete() {
            
        }
        runGame() {
            score++;
            this.updateScoreBoard(SCORE,score);
        }
        clear() {
            super.clear();
        }

    }
    BitmapText.loaded = false;
    BitmapText.loadItem = [{
        id: "letters",
        src: "assets/letters.png"
    },{
        id:"lettersData",
        src:"assets/letter.json"
    },{
        id:"score",
        src:"assets/Font1.png"
    },{
        id:"bg",
        src:"assets/Font.png"
    },{
        id:"fakezee",
        src:"assets/fakezee.png"
    }, {
        id: "fakezeeSpritesheetData",
        src: "assets/fakezee.json"
    }];
    window.BitmapText = BitmapText;


})();