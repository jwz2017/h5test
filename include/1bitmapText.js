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
    var score, level;
    var spriteSheet,bitmapText;
        class BitmapText extends Game {
            constructor() {
                super();
                this.titleScreen.setText("使用bitmapText测试");
            }
            /**建立游戏元素游戏初始化
             * 在构造函数内建立
             */
            buildElement() {
                // this.onkey()
                var spriteData = {
                    "images": ["assets/letters.png"],
                    "frames": [

                        [2, 2, 34, 41],
                        [34, 176, 22, 43],
                        [36, 45, 26, 41],
                        [34, 88, 24, 41],
                        [2, 45, 32, 41],
                        [34, 131, 22, 43],
                        [2, 174, 30, 41],
                        [38, 2, 24, 41],
                        [2, 131, 30, 41],
                        [2, 88, 30, 41]
                    ],
                    "animations": {

                        "0": [0],
                        "1": [1],
                        "2": [2],
                        "3": [3],
                        "4": [4],
                        "5": [5],
                        "6": [6],
                        "7": [7],
                        "8": [8],
                        "9": [9]
                    },
                    "texturepacker": [
                        "SmartUpdateHash: $TexturePacker:SmartUpdate:30a491e7ec1f55acfc7681f12d743fa2:1/1$",
                        "Created with TexturePacker (http://www.texturepacker.com) for EaselJS"
                    ]
                };
                spriteSheet = new createjs.SpriteSheet(spriteData);
                bitmapText = new createjs.BitmapText("0", spriteSheet);
                bitmapText.x = bitmapText.y = 400;
                
                
            }
            newGame() {
                score = 0;
                this.updateScoreBoard(SCORE, score);
                level = 0;
            }
            newLevel() {
                level++;
                this.updateScoreBoard(LEVEL, level);
            }
            waitComplete() {
                stage.addChild(bitmapText);
                var _this = this;
                this.a=setInterval(this._updataScore = function () {
                    _this.updataScore();
                }, 300);
            }
            updataScore(){
                score++;
                this.updateScoreBoard(SCORE,score);

                stage.removeChild(bitmapText);
                bitmapText=new createjs.BitmapText(score.toString(),spriteSheet);
                stage.addChild(bitmapText);
                bitmapText.letterSpacing = 6;
                bitmapText.x=bitmapText.y=400;
                // console.log(this.bitmapText.text);
            }
            runGame() {

            }
            clear() {
                super.clear();
                clearInterval(this.a);
            }

        }
        BitmapText.loaded=false;
        BitmapText.loadItem=[{
            id: "letters",
            src: "assets/letters.png"
        }];
    window.BitmapText = BitmapText;
})();