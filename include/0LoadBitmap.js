
(function () {
    "use strict";
    //游戏变量;定义。。构造内初始化，new game初始化
    const SCORE="score";
    class LoadBitmap extends Game {
        constructor() {
            super();
            this.titleScreen.fontSize=24;
            this.instructionScreen.fontSize=24;
            this.titleScreen.setText(
                "1:直接加载地址，image没有width,要等加载完成后才有width。\r"+
                "2:queue设置为false可以直接用地址\rqueue=new createjs.LoadQueue(false)\r"+
                "3:bitmap宽度获取:butterfly.image.width\rbutterfly.getBounds().width\r"+
                "4:lib库加载 this.button = new lib.Button()\r"+
                "5:位图九宫格 new createjs.ScaleBitmap（）\r");
            this.instructionScreen.setText(
                "// 直接使用地址  设置false后和getResult等同\r"+
                "// this.butterfly=new createjs.Bitmap(assets/move/butterfly.png);\r"+
                
                "//B:使用预加载获得地址\r"+
                "this.butterfly = new createjs.Bitmap(queue.getResult(butterfly));\r"+
    
                "//C:animate库加载        fly和index要在同一目录\r"+
                "// this.button = new lib.Button;\r"+
    
                "//九宫格使用\r"+
                "this.button = new createjs.ScaleBitmap\r(new lib.Button().image, new createjs.Rectangle(80, 25, 6, 6));\r"+
                "// this.button = new createjs.ScaleBitmap\r(queue.getResult(button), new createjs.Rectangle(80, 25, 6, 6));\r"+
                "this.button.setDrawSize(180, 56);");
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {
            // 直接使用地址  设置false后和getResult等同
            // this.butterfly=new createjs.Bitmap("assets/move/butterfly.png");
            
            //B:使用预加载获得地址
            this.butterfly = new createjs.Bitmap(queue.getResult("butterfly"));

            //C:animate库加载        fly和index要在同一目录
            // this.button = new lib.Button;

            //九宫格使用
            this.button = new createjs.ScaleBitmap(new lib.Button().image, new createjs.Rectangle(80, 25, 6, 6));
            // this.button = new createjs.ScaleBitmap(queue.getResult("button"), new createjs.Rectangle(80, 25, 6, 6));
            this.button.setDrawSize(180, 56);
        }
        newGame() {

        }
        newLevel() {

        }
        waitComplete() {
            this.butterfly.x=200;
            this.butterfly.scaleX=this.butterfly.scaleY=.5;
            
            stage.addChild(this.butterfly,this.button);
        }
        runGame() {

        }
        clear() {
            super.clear();
        }

    }
    LoadBitmap.loadItem = [{
        id: "butterfly",
        src: "assets/loadbitmap/butterfly.png"
    }];
    LoadBitmap.loaderbar = [{
        id: "loaderbarData",
        src: "assets/loaderbar/loaderbar.json"
    },{
        id:"loaderbarpic",
        src:"assets/loaderbar/loaderbar.png"
    }];
    LoadBitmap.id = 'A81D833FE7C7754FB5395FF7A6EFA6E1';
    window.LoadBitmap = LoadBitmap;
})();