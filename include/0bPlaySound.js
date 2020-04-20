(function () {
    "use strict";
    //游戏变量;
    var score,level;
    var btn1,btn2,btn3,sound;
    class PlaySound extends Game {
        constructor() {
            super();
            this.titleScreen.setText("声音测试");
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {
            // this.onkey()
            /**
             * 使用interrupt_any时，要再预加载lib里设置data:"1"：一个声音只能再一个通道里播放。
             */
            mc.style.fontSize=38;
            btn1 = new PushButton(null, "button", ()=>{
                sound=createjs.Sound.play('p',{interrupt:createjs.Sound.INTERRUPT_ANY});
            }, 100, 200,150,60);


            /**
             * 一个通道播放一个声音
             */
            //sound是AbstractSoundInstance类，是具体的声音控制
            btn2=new PushButton(null,"music",function(){
                if(sound) 
                {sound.destroy();
                
                    console.log(sound);//destroy后sound依然存在。所以错误警告
                }
                // sound=createjs.Sound.play("p",{interrupt:createjs.Sound.INTERRUPT_ANY});
                    
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
            score = 0;
            this.updateScoreBoard(SCORE,score);
            level = 0;
        }
        newLevel() {
            level++;
            this.updateScoreBoard(LEVEL,level);
            this.updateLevelInScreen(level);
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
    PlaySound.loaded=false;
    PlaySound.loadItem="A81D833FE7C7754FB5395FF7A6EFA6E1";
    window.PlaySound = PlaySound;
})();