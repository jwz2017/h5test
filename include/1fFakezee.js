(function () {
    "use strict";
    //游戏变量;定义。。构造内初始化，new game初始化
    const SECTION1 = "Section1Score",
        SECTION2 = "Section2Score",
        BONUS="BonusScore";

    const TITLE_YPOS = 15;
    const DICE_TRAY_POSITION = {
        x: 78,
        y: 78
    };
    const SCORE_CARD_POSITION = {
        x: 20,
        y: 155
    };
    const SCOREBOARD_POSITION = {
        x: 75,
        y: 460
    };
    const NUM_DICE = 5;
    const NUM_SCORES = 13;
    const NUM_ROLLS = 3;

    // createjs
    var spritesheet;
    // display objects
    var title, diceTray, scoreCard;

    // scorecard buttons
    var scorecardButtons = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'threeKind',
        'fourKind', 'small', 'large', 'fullHouse', 'chance'
    ];
    var scorecardButtonKeys = [1, 2, 3, 4, 5, 6, 2, 3, 3, 4, 0, 0];
    // game values to reset
    var section1Score = 0;
    var section2Score = 0;
    var bonusScore = 0;
    var totalScore = 0;
    var rollsLeft = 3;
    var numScored = 0;
    var diceValues = [];
    var scoredFakezee = false;
    class Fakezee extends Game {
        constructor() {
            super();
        }
        createScoreBoard(){
            var padding = 7;
            var sec1XPos = 12;
            var sec2XPos = 145;
            var bounsXPos=288;
            GFrame.style.SCORE_TEXT_SIZE=16;
            this.scoreBoard = new ScoreBoard(SCOREBOARD_POSITION.x, SCOREBOARD_POSITION.y, {
                sheet:spritesheet,
                ani: "scoreBar"
            });
            this.scoreBoard.alpha=0;
            this.scoreBoard.createTextElement(SECTION1, '0', sec1XPos,padding);
            this.scoreBoard.createTextElement(SECTION2, '0',sec2XPos,padding);
            this.scoreBoard.createTextElement(BONUS,'0',bounsXPos,padding);
        }
        /**建立游戏元素游戏初始化
         * 在构造函数内建立
         */
        buildElement() {
            // this.onkey()
            var bg=new createjs.Bitmap(queue.getResult("bg"));
            stage.addChild(bg);
            spritesheet = new createjs.SpriteSheet(queue.getResult('fakezeeSpritesheetData'));
            //buildTitle
            title = new createjs.Sprite(spritesheet, 'logoSmall');
            title.regX = title.getBounds().width / 2;
            title.x = stage.canvas.width / 2;
            title.y = TITLE_YPOS;
            title.alpha=0;
            this.buildDiceTray();
            this.buildScoreCard();

        }
        buildDiceTray() {
            var trayBG, rollMsg, rollBtn, rollBG, rollsTxt, i, die;
            var rollBtnOffset = -27;
            var hGap = 60;
            var xPos = 37;
            var yPos = 37
            //dice tray container
            diceTray = new createjs.Container();
            diceTray.x = DICE_TRAY_POSITION.x;
            diceTray.y = DICE_TRAY_POSITION.y;
            diceTray.alpha = 0;
            //tray bg
            trayBG = new createjs.Sprite(spritesheet, 'diceTray');
            rollMsg = new createjs.Sprite(spritesheet, 'rollMessage');
            rollMsg.x = trayBG.getBounds().width;
            rollMsg.y = rollBtnOffset;
            rollMsg.name = 'rollMsg';
            rollMsg.alpha=0;
            diceTray.addChild(trayBG, rollMsg);
            //dice
            for (let i = 0; i < NUM_DICE; i++) {
                die = new createjs.Sprite(spritesheet, 'die');
                die.name = 'die' + i;
                die.paused = true;
                // die.visible=false;
                die.mouseEnabled = false;
                die.regX = die.getBounds().width / 2;
                die.regY = die.getBounds().height / 2;
                die.x = xPos;
                die.y = yPos;
                die.hold = false;
                die.on('click', this.holdDie);
                xPos += hGap;
                diceTray.addChild(die);
            }
            //roll button
            rollBtn = new createjs.Container();
            rollBtn.name = 'rollBtn';
            rollBtn.visible = false;
            rollBtn.x = xPos;
            rollBtn.y = yPos;
            rollBG = new createjs.Sprite(spritesheet, 'rollButton');
            rollBtn.addChild(rollBG);
            //roll text
            rollsTxt = new createjs.Text(rollsLeft, '27px Calibri', '#FFF');
            rollsTxt.name = 'rollsTxt';
            rollsTxt.textAlign = 'center';
            rollsTxt.textBaseline = 'middle';
            rollsTxt.x = rollBtn.getBounds().width / 2;
            rollsTxt.y = rollBtn.getBounds().height / 2;
            //add roll button
            rollBtn.regX = rollBtn.getBounds().width / 2;
            rollBtn.regY = rollBtn.getBounds().height / 2;
            rollBtn.addChild(rollsTxt);
            rollBtn.on('click', this.rollDice,this);
            rollBtn.rotation=360;
            diceTray.addChild(rollBtn);

        }
        buildScoreCard() {
            var btn, scoreMsg, scoreTxt;
            var xPos = 0;
            var yPos = 0;
            var row = 0;
            var vGap = 49;
            var hGap = 390;
            var btnsPerRow = 6;
            // var fakezeeBtnYPos = 75;
            var scoreMsgYPos = 150;
            var section = 1;
            scoreCard = new createjs.Container();
            // scoreCard.mouseEnabled = false;
            scoreCard.x = SCORE_CARD_POSITION.x;
            scoreCard.y = SCORE_CARD_POSITION.y;
            //score buttons
            for (let i = 0; i < scorecardButtons.length; i++) {
                btn = new createjs.Sprite(spritesheet, scorecardButtons[i]);
                btn.paused = true;
                btn.name = scorecardButtons[i];
                btn.key = scorecardButtonKeys[i];
                btn.section = section;
                btn.y = yPos;
                btn.x = xPos;
                btn.framerate = 30;
                btn.on('animationend', function (e) {
                    this.stop();
                });
                btn.on('click', this.onScoreCardBtnClick,this);
                scoreCard.addChild(btn);
                yPos += vGap;
                row++;
                if (row === btnsPerRow) {
                    section++;
                    row = 0;
                    yPos = 0;
                    xPos += hGap;
                }
            }
            //fakezee button
            btn = new createjs.Sprite(spritesheet, 'fakezee');
            btn.paused = true;
            btn.name = btn.key = 'fakezee';
            btn.section = 2;
            btn.regX = btn.getBounds().width / 2;
            btn.regY = btn.getBounds().height / 2;
            btn.x = scoreCard.getBounds().width / 2;
            btn.y = 75;
            btn.alpha = 0;
            btn.on('click', this.onScoreCardBtnClick,this);
            scoreCard.addChild(btn);
            //score message
            scoreMsg = new createjs.Sprite(spritesheet, 'totalScoreLabel');
            scoreMsg.name = 'scoreMsg';
            scoreMsg.regX = scoreMsg.getBounds().width / 2;
            scoreMsg.x = scoreCard.getBounds().width / 2;
            scoreMsg.y = scoreMsgYPos;
            // scoreMsg.alpha = 0;
            // score
            scoreTxt = new createjs.Text('0', '50px Calibri', '#FFF');
            scoreTxt.name = 'scoreTxt';
            scoreTxt.textAlign = 'center';
            scoreTxt.x = scoreCard.getBounds().width / 2;
            scoreTxt.y = scoreMsg.y + 30;
            // scoreTxt.alpha = 0;
            scoreCard.addChild(scoreTxt);
            scoreCard.addChild(scoreMsg);

        }
        holdDie(e) {
            console.log('click');

        }
        rollDice(e) {
            var rollBtn=e.currentTarget;
            var rollsTxt=rollBtn.getChildByName('rollsTxt');
            this.enableDice(false);
            scoreCard.mouseEnabled=false;
            rollBtn.mouseEnabled=false;
            rollBtn.alpha=.7;
            rollsLeft-=1;
            rollsTxt.text=rollsLeft;
            for (let i = 0; i < NUM_DICE; i++) {
                const die = diceTray.getChildByName('die'+i);
                if(die.hold){
                    continue;
                }
                die.framerate = Math.floor(Math.random() * 20) + 20;
               die.advance(1234);
                // console.log(die.framerate);
                
                die.play();
            }
            var _this=this;
            setTimeout(this._stopDice=function(){
                _this.stopDice();
            }, 1000);
        }
        enableDice(enable){
            for (let i = 0; i < NUM_DICE; i++) {
                const die =diceTray.getChildByName('die'+i);
                die.mouseEnabled=enable;
            }
        }
        stopDice(){
            var diceValues=[];
            
            for (let i = 0; i < NUM_DICE; i++) {
                const die = diceTray.getChildByName('die'+i);
                die.stop();
                diceValues[i]=Math.floor(die.currentAnimationFrame)+1;
                
            }
            if(rollsLeft>0){
                this.enableDice(true);
                var rollBtn=diceTray.getChildByName('rollBtn');
                rollBtn.alpha=1;
                rollBtn.mouseEnabled=true;
            }
        }
        onScoreCardBtnClick(e) {
            console.log("scorecardbtnclick");
            
            var btn=e.target;
            btn.mouseEnabled=false;
            scoreCard.mouseEnabled=false;
            var score=100;
            btn.gotoAndStop(btn.name+'_score');
            this.updateScore(btn,score);
            var totalScoreTxt=scoreCard.getChildByName('scoreTxt');
            totalScoreTxt.text=totalScore=(section1Score+section2Score+bonusScore);
        }
        updateScore(btn,score){
            var label=new createjs.Text(score,'27px Calibri','#fff');
            var labelXOffset;
            var labelYOffset;
            switch(btn.section){
                case 1:
                section1Score+=score;
                this.scoreBoard.update(SECTION1,section1Score);
                labelXOffset=70;
                labelYOffset=17;
                break;
                case 2:
                section2Score+=score;
                this.scoreBoard.update(SECTION2,section2Score);
                if(btn.name=="fakezee"){
                    labelXOffset=0;
                    labelYOffset=-15;
                }
                else{
                    labelXOffset=35;
                    labelYOffset=14;
                }
                break;
            }
            label.name="label";
            label.textAlign="center";
            label.x=btn.x+labelXOffset;
            label.y=btn.y+labelYOffset;
            scoreCard.addChild(label);
        }
        waitComplete() {
            createjs.Tween.get(this)
            .wait(100).call(this.revealTitle)
            .wait(400).call(this.revealDiceTray)
            .wait(1400).call(this.revealScoreCard)
            .wait(2000).call(this.revealScoreboard)

        }
        revealTitle(){
            stage.addChild(title);
            createjs.Tween.get(title).to({alpha:1},400);
        }
        revealDiceTray(){
            var delay,btn,rollMessage;
            stage.addChild(diceTray);
            createjs.Tween.get(diceTray).to({alpha:1},500);
            for (let i = 0; i < NUM_DICE; i++) {
                const die = diceTray.getChildByName('die'+i);
                die.scaleX=die.scaleY=0;
                die.visible=true;
                delay=(i*150)+500;
                createjs.Tween.get(die).wait(delay).to({scaleX:1,scaleY:1},1000,createjs.Ease.elasticOut);
            }
            btn=diceTray.getChildByName("rollBtn");
            btn.scaleX=btn.scaleY=0;
            btn.visible=true;
            delay+=150;
            createjs.Tween.get(btn).wait(delay)
            .to({scaleX:1,scaleY:1,rotation:0},1000,createjs.Ease.elasticOut);
            rollMessage=diceTray.getChildByName('rollMsg');
            createjs.Tween.get(rollMessage).wait(delay).to({alpha:1},1000);
        }
        revealScoreCard(){
            var btn,timer;
            var len=scorecardButtons.length;
            var i=0;
            stage.addChild(scoreCard);
            timer=setInterval(function(){
                btn=scoreCard.getChildAt(i);
                btn.play();
                i++
                if(i===len){
                    clearInterval(timer);
                    btn=scoreCard.getChildByName('fakezee');
                    btn.y-=10;
                    createjs.Tween.get(btn).to({alpha:1,y:btn.y+10},500);
                }
            },100);
        }
        revealScoreboard(){
            createjs.Tween.get(this.scoreBoard).to({alpha:1},500);
        }
        runGame() {

        }
        clear() {
            super.clear();

        }

    }
    Fakezee.loaded = false;
    Fakezee.loadItem = [{
        id: "bg",
        src: "assets/fakezee/bg.jpg"
    },{
        id: "fakezeeSpritesheet",
        src: "assets/fakezee/fakezee.png"
    }, {
        id: "fakezeeSpritesheetData",
        src: "assets/fakezee/fakezee.json"
    }];
    window.Fakezee = Fakezee;

})();