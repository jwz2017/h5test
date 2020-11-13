(function () {
    "use strict";
    //游戏变量;定义。。构造内初始化，new game初始化
    class Graphics extends Game {
        constructor() {
            super();
            let dom=document.getElementById("close");
            dom.style.visibility="visible";
            this.titleScreen.setPosition(width/2,height/10);
            this.titleScreen.fontSize = 24;
            this.titleScreen.setText(
                "this.shape=new createjs.Shape();\r"+
            "this.shape.graphics.setStrokeStyle(1).beginStroke(#000);\r"+
            "//画虚线\r"+
            "GraphicsUtils.drawLine(this.shape.graphics,{\r"+
                "x:700,\r"+
                "y:50\r"+
            "},{\r"+
                "x:0,\r"+
                "y:50\r"+
            "},10,1);\r"+
            "//画扇形\r"+
            "GraphicsUtils.drawSector\r(this.shape.graphics, 100, 200, 200, 100, 0,90);\r"+
            "//同心圆\r"+
            "GraphicsUtils.drawRing\r(this.shape.graphics, 400, 200, 100, 100, 0, 180,.5);");
            this.instructionScreen.setText("游戏介绍");
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {
            this.shape=new createjs.Shape();
            this.shape.graphics.setStrokeStyle(1).beginStroke("#000");
            //画虚线
            GraphicsUtils.drawLine(this.shape.graphics,{
                x:700,
                y:50
            },{
                x:0,
                y:50
            },10,1);
            //画扇形
            GraphicsUtils.drawSector(this.shape.graphics, 100, 200, 200, 100, 0,90);
            //同心圆
            GraphicsUtils.drawRing(this.shape.graphics, 400, 200, 100, 100, 0, 180,.5);
        }
        newGame() {

        }
        newLevel() {

        }
        waitComplete() {
            stage.addChild(this.shape);
        }
        runGame() {

        }
        clear() {
            super.clear();
        }

    }
    // Graphics.loadItem = [{
    //    id: "",
    //    src: ""
    // }];
    Graphics.loaderbar = [{
        id: "loaderbarData",
        src: "assets/loaderbar/loaderbar.json"
    }, {
        id: "loaderbarpic",
        src: "assets/loaderbar/loaderbar.png"
    }];
    // Graphics.id = 'A81D833FE7C7754FB5395FF7A6EFA6E1';
    window.Graphics = Graphics;
})();