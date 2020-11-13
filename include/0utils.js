(function () {
    "use strict";
    //游戏变量;定义。。构造内初始化，new game初始化
    class Utils extends Game {
        constructor() {
            super();
            let dom=document.getElementById("close");
            dom.style.visibility="visible";
            this.titleScreen.setPosition(width/2,height/10);
            this.instructionScreen.setPosition(width/2,height/10);
            this.titleScreen.fontSize = 24;
            this.instructionScreen.fontSize = 24;
            this.titleScreen.setText(
            "//A:parseColor颜色转换0xffffff转为#ffffff和数字\r"+
            "console.log(utils.parseColor(0xffffff));\r"+
            "console.log(utils.parseColor(0xffffff,true));\r"+
            "//B:randomColor随机颜色\r"+
            "console.log(utils.randomColor());\r"+
            "//C:drawPoints绘制图形\r"+
            "var shape=new createjs.Shape();\r"+
            "stage.addChild(shape);\r"+
            "shape.graphics.beginFill(#333);"
            )
            this.instructionScreen.setText(
            "var mat = new createjs.Matrix2D().translate(200, 200).rotate(180);\r"+
            "var points = [\r"+
                "[0, -25],\r"+
                "[25, 25],\r"+
                "[-25, 25],\r"+
                "[0, -25]\r"+
            "];\r"+
            "utils.drawPoints(shape.graphics, mat, points);\r"+
            "//D:Array随机排序\r"+
            "utils.randomArray(points);\r"+
            "console.log(points);"
            );
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
            //A:parseColor颜色转换0xffffff转为#ffffff和数字
            console.log(utils.parseColor(0xffffff));
            console.log(utils.parseColor(0xffffff,true));
            //B:randomColor随机颜色
            console.log(utils.randomColor());
            //C:drawPoints绘制图形
            var shape=new createjs.Shape();
            stage.addChild(shape);
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
        }
        runGame() {

        }
        clear() {
            super.clear();
        }

    }
    window.Utils = Utils;
})();