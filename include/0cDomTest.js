(function () {
    "use strict";
    //游戏变量;
    var score,level;
    var textTxt,domElement,openBtn,openBtnElement,nameInput,nameInpuElement,pop;
    class DomTest extends Game {
        constructor() {
            super();
            this.titleScreen.setText("加入dom测试");
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {
            // this.onkey()
            // 加入dom到舞台
            textTxt = document.getElementById("testTxt");
            domElement = new createjs.DOMElement(textTxt);
            domElement.x=domElement.y=200;
            domElement.regX=100;
            domElement.regY=100;
            domElement.htmlElement.onclick=function(){
                console.log("click");
            }

            //加入dom到animate
            openBtn=document.getElementById("openBtn");
            openBtnElement=new createjs.DOMElement(openBtn);
            openBtnElement.y=340;
            openBtn.onclick=function(){
                pop.gotoAndPlay(1);
            }
            
            nameInput=document.getElementById("inputText");
            nameInpuElement=new createjs.DOMElement(nameInput);
            pop=new lib.Pop();
            pop.win.con.addChild(nameInpuElement);
            pop.y=400;
            nameInpuElement.x=140;
            nameInpuElement.y=80;
            pop.win.btn.addEventListener("click",this.f=function(){
                pop.gotoAndStop(0);
            })
            
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
            textTxt.style.display = "block";
            stage.addChild(domElement);

            openBtn.style.display="block";
            stage.addChild(openBtnElement);
            nameInput.style.display="block";
            stage.addChild(pop);
        }

        runGame() {
            domElement.rotation+=1;

        }
        clear() {
             super.clear()
             domElement.htmlElement.onclick=null;
             openBtn.onclick=null;
             pop.win.btn.removeEventListener('click',this.f);
             
             textTxt.style.display = "none";
            openBtn.style.display="none";
            nameInput.style.display="none";
        }
    }
    DomTest.loaded=false;
    DomTest.loadItem="A81D833FE7C7754FB5395FF7A6EFA6E1";
    window.DomTest = DomTest;
})();