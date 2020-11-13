(function () {
    "use strict";
    //游戏变量;定义。。构造内初始化，new game初始化
    class Mctest extends Game {
        constructor() {
            super();
            let dom=document.getElementById("close");
            dom.style.visibility="visible";
            this.titleScreen.setPosition(width/2,height/10);
            this.titleScreen.setText(
                "mc组件测试");
            this.instructionScreen.setText("游戏介绍");
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
            // mc.style.darkStyle();//黑色主题
            this.scorecontainer=new ScrollContainer(stage,0,0,600,750,1200,1500);
            //Rect RoundRect Circle Star Arrow
            this.button=new PushButton(this.scorecontainer,"ok",null,50,50);
            this.button1=new PushButton(this.scorecontainer,"ok",null,50,100,200,40,new RoundRect(20));
            this.button2=new PushButton(this.scorecontainer,"ok",null,50,150,60,60,new Circle());
            this.button3=new PushButton(this.scorecontainer,"ok",null,100,200,80,80,new Star(6,2.5,30));
            this.button4=new PushButton(this.scorecontainer,"ok",null,200,200,80,80,new Star(6,0,0));
            this.button5=new PushButton(this.scorecontainer,"ok",null,50,300,80,80,new Arrow(0));
            ////带三角的按钮图形  Rect Circle RoundRect
            this.arrowButtonShap=new ArrowButtonShape(this.scorecontainer,null,120,60,90);
            this.arrowButtonShap.x=200;
            this.arrowButtonShap.y=300;
            this.arrowButtonShap1=new ArrowButtonShape(this.scorecontainer,null,40,40,180,new Circle);
            this.arrowButtonShap1.x=50;
            this.arrowButtonShap1.y=400;
            //checkBoxShape图形 Rect Circle RoundRect star
            this.checkboxShap = new CheckBoxShape(this.scorecontainer,null,false, 60, 60, new Star);
            this.checkboxShap.x = 50;
            this.checkboxShap.y = 500;
            this.checkboxShap1 = new CheckBoxShape(this.scorecontainer,null,false, 60, 60, new Rect);
            this.checkboxShap1.x = 200;
            this.checkboxShap1.y = 500;
            this.checkboxShap2 = new CheckBoxShape(this.scorecontainer,null,false, 60, 60, new Circle);
            this.checkboxShap2.x = 400;
            this.checkboxShap2.y = 500;
            //sliderShape图形 Rect RoundRect
            this.sliderShap = new SliderShape(this.scorecontainer, () => {
                console.log(this.sliderShap.value);
            }, 210, 30, new RoundRect(15), false);
            this.sliderShap.x = 50;
            this.sliderShap.y = 600;
            this.sliderShap.continuous = false;
            this.sliderShap1 = new SliderShape(this.scorecontainer, () => {
                console.log(this.sliderShap1.value);
            }, 210, 30, new Rect(), true);
            this.sliderShap1.x = 300;
            this.sliderShap1.y = 500;
            this.sliderShap1.continuous = false;
            //checkbox Rect RoundRect Circle Star
            mc.style.fontSize = 24;
            this.checkbox = new CheckBox(this.scorecontainer, "黑色", () => {
                console.log(this.checkbox.selected);
            }, false, 50, 700, 40, 40, new Circle);
            this.checkbox1 = new CheckBox(this.scorecontainer, "黑色", () => {
                console.log(this.checkbox1.selected);
            }, false, 50, 750, 40, 40, new Rect);
            this.checkbox2 = new CheckBox(this.scorecontainer, "黑色", () => {
                console.log(this.checkbox2.selected);
            }, false, 50, 800, 40, 40, new Star);
            //RadioButton单选框  Rect RoundRect Circle Star
            var radiobutton1 = new RadioButton(this.scorecontainer, "白色", handle, false, 450, 800, 40, 40, new Rect);
            var radiobutton2 = new RadioButton(this.scorecontainer, "蓝色", handle, false, 450, 850, 40, 40, new Rect);
            var radiobutton3 = new RadioButton(this.scorecontainer, "红色", handle, false, 450, 900, 40, 40, new Rect);
            function handle() {
                switch (RadioButton.selectedButton) {
                    case radiobutton1:
                        console.log("白色");

                        break;
                    case radiobutton2:
                        console.log("蓝色");
                        break;
                    case radiobutton3:
                        console.log("红色");
                        break;

                    default:
                        break;
                }
            }
            //slider  Rect RoundRect
            this.slider = new Slider(this.scorecontainer, "分数", () => {
                console.log(this.slider.value);
            }, 50, 1000, 230, 24, new Rect, true);
            this.slider1 = new Slider(this.scorecontainer, "分数", () => {
                console.log(this.slider1.value);
            }, 200, 1000, 230, 24, new RoundRect(12), false);


        }
        runGame() {

        }
        clear() {
            super.clear();
        }

    }
    window.Mctest = Mctest;
})();