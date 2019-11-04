// window.onload = function () {
//     "use strict";
//     /*************初始化 整个游戏入口*****/
//     var g = new GFrame('canvas');
//     /**********自适应************* */
//     g.adapt();
//     /*********预加载手动********** */
//     // g.preload(new PlaySound,[{
//     //     id: "butterfly",
//     //     src: "assets/butterfly.png"
//     // }]);

//     /*********animate加载*******/
//     g.preload(new PlaySound, "A81D833FE7C7754FB5395FF7A6EFA6E1");
//     /*********不加载********** */
//     // g.initGame(new PlaySound)
//     /***********fps********** */
//     FPS.startFPS(stage);

// };
(function () {
    "use strict";
    //游戏变量;
    var btn1,btn2,btn3,sound;
    class PlaySound extends Game {
        constructor() {
            super();
            
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {
            // this.onkey()
            this.titleScreen.setText("声音测试");
            /**
             * 使用interrupt_any时，要再预加载lib里设置data:"1"：一个声音只能再一个通道里播放。
             */
            btn1 = new PushButton(null, "button", ()=>{
                createjs.Sound.play('p',{interrupt:createjs.Sound.INTERRUPT_ANY});
            }, 100, 200,150,60);


            /**
             * 一个通道播放一个声音
             */
            //sound是AbstractSoundInstance类，是具体的声音控制
            btn2=new PushButton(null,"music",function(){
                if(sound) sound.destroy();
                sound=createjs.Sound.play("p",{interrupt:createjs.Sound.INTERRUPT_ANY});
                    
            },100,300,150,60);

            btn3=new PushButton(null,"music2",function(){
                if(sound) sound.destroy();
                sound=createjs.Sound.play("woosh");
                sound.on('complete', function() {        //建立声音播放完时侦听。。。。。
                    console.log('c');
                  });
            },100,400,150,60);
        }
        newGame() {
            this.score = 0;
            this.lives = 5;
            this._level = 0;
        }
        newLevel() {
            this.level++;
        }
        waitComplete() {
            stage.addChild(btn1,btn2,btn3);
        }

        runGame() {

        }
        clear(){
            super.clear();
            if(sound) sound.destroy();
            sound=null;
        }
    }
    window.PlaySound = PlaySound;
})();