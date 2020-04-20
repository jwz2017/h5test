var stage, queue, model, lib;
window.onload = function () {
  "use strict";
  /*************初始化 整个游戏入口*****/
  var g = new GFrame('canvas');
  /**********自适应************* */
  g.adapt();
  /*********加载（和菜单选一个）********** */
  // g.preload(PlaySound);

  /****************选择菜单******************* */
  var text = new createjs.Text("游戏菜单", '58px ' + GFrame.style.SCOREBOARD_FONTFAMILY, GFrame.style.TITLE_TEXT_COLOR);
  text.x = 250;
  text.y = 250;
  var select = document.getElementById("select1");
  var domElement = new createjs.DOMElement(select);
  domElement.x = 220;
  domElement.y = 350;
  select.style.display = "block";
  stage.addChild(domElement, text);
  select.focus();
  select.onchange = function () {
    select.style.display = "none";
    stage.removeChild(domElement, text);
    let index = select.selectedIndex;
    g.preload(eval(select.options[index].value));
  }

  /***********fps********** */
  FPS.startFPS(stage);
};

/*************************GFrame************************************************************************ */
class GFrame {
  constructor(canvasId) {
    this.waitTime = 0;
    this.waitCount = 40;
    this._systemFunction = this._systemWaitForClose;
    this._setupStage(canvasId);

    /*********接收animate影片剪辑播放过程发出的事件。***/
    model = new createjs.EventDispatcher();
    model.addEventListener(GFrame.event.PAUSE, () => {
      if (this._currentSystemState == GFrame.state.STATE_GAME_PLAY) {
        if (createjs.Ticker.paused) {
          this._systemFunction = this._systemWaitForClose;
        } else {
          this._systemFunction = this._systemGamePlay;
        }
      } else {
        createjs.Ticker.paused = false;
      }
    });
  }

  /**自适应
   * 
   * @param {boolean} h =true,是否高度适应
   */
  adapt() {
    // let stageWidth = document.documentElement.clientWidth,
    //   stageHeight = document.documentElement.clientHeight;
    var stageWidth = window.innerWidth;
    var stageHeight = window.innerHeight;
    if (typeof stageWidth != "number") {
      if (document.compatMode == 'CSS1Compat') {
        stageWidth = document.documentElement.clientWidth;
        stageHeight = document.documentElement.clientHeight;
      } else {
        stageWidth = document.body.clientWidth;
        stageHeight = document.body.clientHeight;
      }
    }
    var gameDiv = document.getElementById("game"),
      width = stage.canvas.width,
      height = stage.canvas.height,
      stageScale = 1;
    //0.665  高度自适应
    if (stageWidth / stageHeight > 0.665) {
      stageScale = stageHeight / height;
      gameDiv.style.left = (stageWidth - width * stageScale) / 2 + 'px';
    } else {//宽度自适应
      stageScale = stageWidth / width;
    }
    
    // stage.canvas.style.width=stage.canvas.width*stageScale+'px';
    // stage.canvas.style.height=stage.canvas.height*stageScale+'px';
    gameDiv.style.transformOrigin = '0 0';
    gameDiv.style.transform = 'scale(' + stageScale + ')';
  }
  /**预加载
   * 
   * @param {*} array 
   * @param {*} game 
   * @param {*} compid 
   */
  preload(GClass) {
    if (!GClass.loadItem) {
      this.initGame(GClass);
      return;
    }
    if (!queue) {
      queue = new createjs.LoadQueue();
      queue.installPlugin(createjs.Sound); //注册声音插件
      this.loaderBar = new LoaderBar();
      this.loaderBar.x = (stage.canvas.width - this.loaderBar.getBounds().width) / 2;
      this.loaderBar.y = (stage.canvas.height - this.loaderBar.getBounds().height) / 2;
    }
    stage.addChild(this.loaderBar);

    if (GClass.loadItem instanceof Array) {
      queue.loadManifest(GClass.loadItem);
    } else if (typeof GClass.loadItem === "string") {
      let comp = AdobeAn.getComposition(GClass.loadItem);
      queue.on('fileload', this.onFileLoad, this, false, comp);
      lib = comp.getLibrary();
      queue.loadManifest(lib.properties.manifest);
    }
    queue.on('complete', function onComplete(e) {
      queue.removeAllEventListeners();
      stage.removeChild(this.loaderBar);
      this.initGame(GClass);
    }, this, true);
    queue.on('progress', (e) => {
      this.loaderBar.startLoad(e.progress);
    });
    queue.on('error', () => {
      console.log("loaderror");
    });
  }

  /**初始化屏幕元素
   * 
   */
  initGame(GClass) {
    this.game = new GClass();
    this._switchSystemState(GFrame.state.STATE_TITLE);
  }

  /**加载完成事件
   * 
   */
  onFileLoad(evt, comp) {
    let images = comp.getImages();
    if (evt.item.type == "image") {
      images[evt.item.id] = evt.result;
    }
  }
  //****************************************私有方法**************************************************** */
  /**建立舞台
   * 
   */
  _setupStage(canvasId) {
    stage = new createjs.Stage(canvasId);
    stage.canvas.style.display = "block"; //显示canvas
    stage.enableMouseOver(); //开启鼠标经过事件
    createjs.Touch.enable(stage, true, false); //开启触摸

    //createjs.MotionGuidePlugin.install(); //使用引导层必须

    // createjs.FlashAudioPlugin.swfPath = "plugin/FlashAudioPlugin";//安装flash插件
    // createjs.Sound.registerPlugins([createjs.FlashAudioPlugin]);//安装flash插件

    // createjs.Ticker.framerate = 65; //设置帧频
    // createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on("tick", (e) => {
      this._systemFunction();
      stage.update();
    });
  }
  //选择游戏状态
  _switchSystemState(stateval) {
    this._lastSystemState = this._currentSystemState;
    this._currentSystemState = stateval;
    switch (stateval) {
      case GFrame.state.STATE_WAIT:
        this._systemFunction = this._systemWait;
        break;
      case GFrame.state.STATE_WAIT_FOR_CLOSE:
        this._systemFunction = this._systemWaitForClose;
        break;
      case GFrame.state.STATE_TITLE:
        this._systemFunction = this._systemTitle;
        break;
      case GFrame.state.STATE_INSTRUCTION:
        this._systemFunction = this._systemInstruction;
        break;
      case GFrame.state.STATE_NEW_GAME:
        this._systemFunction = this._systemNewGame;
        break;
      case GFrame.state.STATE_NEW_LEVEL:
        this._systemFunction = this._systemNewLevel;
        break;
      case GFrame.state.STATE_LEVEL_IN:
        this._systemFunction = this._systemLevelIn;
        break;
      case GFrame.state.STATE_GAME_PLAY:
        this._systemFunction = this._systemGamePlay;
        break;
      case GFrame.state.STATE_GAME_OVER:
        this._systemFunction = this._systemGameOver;
        break;
      default:
    }
  }
  //标题状态
  _systemTitle() {
    stage.addChild(this.game.titleScreen);
    this.okButton = this.game.titleScreen.on(GFrame.event.OK_BUTTON, this._okButton, this, true);
    this._switchSystemState(GFrame.state.STATE_WAIT_FOR_CLOSE);
    this._nextSystemState = GFrame.state.STATE_INSTRUCTION;
  }
  //介绍界面状态
  _systemInstruction() {
    stage.addChild(this.game.instructionScreen);
    this.okButton = this.game.instructionScreen.on(GFrame.event.OK_BUTTON, this._okButton, this, true);
    this._switchSystemState(GFrame.state.STATE_WAIT_FOR_CLOSE);
    this._nextSystemState = GFrame.state.STATE_NEW_GAME;
  }
  //新游戏开始状态
  _systemNewGame() {
    stage.addEventListener(GFrame.event.NEW_LEVEL, (e) => {
      this._switchSystemState(GFrame.state.STATE_NEW_LEVEL);
    });
    stage.addEventListener(GFrame.event.GAME_OVER, () => {
      this._switchSystemState(GFrame.state.STATE_GAME_OVER);
    });
    stage.on(GFrame.event.WAIT_COMPLETE, this.game.waitComplete, this.game);
    this.game.newGame();
    this._switchSystemState(GFrame.state.STATE_NEW_LEVEL);
  }
  //设置新等级状态
  _systemNewLevel() {
    if (this._lastSystemState === GFrame.state.STATE_GAME_PLAY) this.game.clear();
    this.game.newLevel();
    this._switchSystemState(GFrame.state.STATE_LEVEL_IN);
  }
  //新等级界面状态
  _systemLevelIn() {
    stage.addChild(this.game.levelInScreen);
    this._nextSystemState = GFrame.state.STATE_GAME_PLAY;
    this._switchSystemState(GFrame.state.STATE_WAIT);
  }
  //结束界面状态
  _systemGameOver() {
    this.game.clear();
    stage.removeAllChildren();
    stage.removeAllEventListeners();
    stage.addChild(this.game.gameOverScreen);
    this.okButton = this.game.gameOverScreen.on(GFrame.event.OK_BUTTON, this._okButton, this, true);
    this._switchSystemState(GFrame.state.STATE_WAIT_FOR_CLOSE);
    this._nextSystemState = GFrame.state.STATE_TITLE;
  }
  //游戏运行界面状态
  _systemGamePlay() {
    this.game.runGame();
  }
  //等待关闭界面状态
  _systemWaitForClose() {

  }
  //等级界面等待状态
  _systemWait() {
    this.waitTime++;
    if (this.waitTime >= this.waitCount) {
      this.waitTime = 0;
      switch (this._lastSystemState) {
        case GFrame.state.STATE_LEVEL_IN:
          stage.addChild(this.game.scoreBoard);
          stage.removeChild(this.game.levelInScreen);
          stage.dispatchEvent(GFrame.event.WAIT_COMPLETE); //等待完成发送事件
          break;
      }
      this._switchSystemState(this._nextSystemState);
    };
  }

  //按钮点击
  _okButton(e) {
    stage.removeChild(e.target);
    this._switchSystemState(this._nextSystemState);
  }
}
/*******************************************静态变量****************************************** */
GFrame.style = {
  TITLE_TEXT_SIZE: 36,
  TITLE_TEXT_COLOR: "#FF0000",
  SIDE_BUFFWIDTH: 10,
  SCORE_TEXT_COLOR: "#FFFFFF",
  // SCORE_BUFF: 160,
  //分数板样式
  SCORE_TEXT_SIZE: 36,
  SCORE_BUFF: 2,
  SCOREBOARD_HEIGHT: 70,
  SCOREBOARD_WIDTH: 750,
  SCOREBOARD_COLOR: "#333",
  SCOREBOARD_FONTFAMILY: "Calibri"
  // "Microsoft YaHei"

};
GFrame.event = {
  GAME_OVER: "gameover",
  NEW_LEVEL: "newlevel",
  WAIT_COMPLETE: "waitcomplete",
  OK_BUTTON: "okbutton",
  PAUSE: "pause"
};
GFrame.state = {
  STATE_WAIT_FOR_CLOSE: "statewaitforclose",
  STATE_TITLE: "statetitle",
  STATE_INSTRUCTION: "stateinstruction",
  STATE_NEW_GAME: "statenewgame",
  STATE_GAME_OVER: "stategameover",
  STATE_NEW_LEVEL: "statenewlevel",
  STATE_LEVEL_IN: "statelevelin",
  STATE_GAME_PLAY: "stategameplay",
  STATE_LEVEL_OUT: "statelevelout",
  STATE_WAIT: "statewait"
};
/*****************************************游戏界面**************************** */
class BasicScreen extends createjs.Container {
  constructor() {
    super();
    this.displayText = new createjs.Text();
  }
  /**创建显示文本
   * 
   * @param {string} text 文本内容
   * @param {number} xpos 文本x坐标
   * @param {number} ypos 文本y坐标
   */
  createDisplayText(text, xpos, ypos) {
    this.displayText.text = text;
    this.displayText.x = xpos;
    this.displayText.y = ypos;
    this.displayText.textAlign = "center";
    this.displayText.textBaseline = "middle";
    this.displayText.font = GFrame.style.TITLE_TEXT_SIZE + "px Microsoft YaHei";
    this.displayText.color = GFrame.style.TITLE_TEXT_COLOR;
    this.addChild(this.displayText);
  }
  /**创建按钮
   * 
   * @param {number} xpos 按钮x坐标
   * @param {number} ypos 按钮y坐标
   * @param {string} label 按钮标签文本内容
   * @param {[number]} width 按钮宽度 默认100
   * @param {[number]} height 按钮高度 默认20
   */
  createOkButton(xpos, ypos, label, width, height) {
    let button = new PushButton(this, label, () => {
      this.dispatchEvent(GFrame.event.OK_BUTTON, false);
    }, xpos, ypos, width, height);
  }
  /**设置文本内容
   * 
   * @param {string} key 文本索引
   * @param {string} val 文本内容
   */
  setText(val) {
    this.displayText.text = val;
  }

}
class SideBysideScore extends createjs.Container {
  constructor(labeText, valText) {
    super();
    this._label = new createjs.Text(labeText + ':', GFrame.style.SCORE_TEXT_SIZE + 'px ' + GFrame.style.SCOREBOARD_FONTFAMILY, GFrame.style.SCORE_TEXT_COLOR);
    this._value = new createjs.Text(valText, GFrame.style.SCORE_TEXT_SIZE + 'px ' + GFrame.style.SCOREBOARD_FONTFAMILY, GFrame.style.SCORE_TEXT_COLOR);
    this._value.y = 1;
    this._label.x = 0;
    this._value.x = GFrame.style.SCORE_BUFF + this._label.getMeasuredWidth();
    this.addChild(this._label, this._value);
  }
  setValText(val) {
    this._value.text = val;
  }
}
class SideBysideScoreBitmap extends createjs.Container {
  /**
   * 
   * @param {*} key 引索也是label
   * @param {*} value 
   * @param {*} map 图片资源
   * {valsheet:（必选queue的dataid）,labsheet:(可选 ),labani:有labsheet后必选}
   * {valsheet:（必选queue的dataid）,labid:(可选 )bitmapid }
   */
  constructor(key, val, map) {
    super();
    this.sheet = map.valsheet;
    this.value = new createjs.BitmapText(val, this.sheet);
    this.offsetY = this.value.getBounds().height / 2;
    if (map.labsheet) {
      this.label = new createjs.Sprite(map.labsheet, map.labani);
      // this.label.paused=true;
      this.valuexpos = this.label.getBounds().width + GFrame.style.SCORE_BUFF;
      this.valueypos = this.label.getBounds().height / 2;
    } else if (map.labid) {
      this.label = new createjs.Bitmap(queue.getResult(map.labid));
      this.valuexpos = this.label.getBounds().width + GFrame.style.SCORE_BUFF;
      this.valueypos = this.label.getBounds().height / 2;
    } else {
      this.label = new createjs.Text(key + ' :', GFrame.style.SCORE_TEXT_SIZE + 'px ' + GFrame.style.SCOREBOARD_FONTFAMILY, GFrame.style.SCORE_TEXT_COLOR);
      this.valuexpos = this.label.getMeasuredWidth() + GFrame.style.SCORE_BUFF;
      this.valueypos = this.label.getMeasuredHeight() / 2;
    }
    this.value.x = this.valuexpos;
    this.value.y = this.valueypos - this.offsetY;
    this.addChild(this.label, this.value);
  }
  setValText(val) {
    this.removeChild(this.value);
    this.value = new createjs.BitmapText(val.toString(), this.sheet);
    this.value.x = this.valuexpos;
    this.value.y = this.valueypos - this.offsetY;
    this.value.letterSpacing = 4;
    this.addChild(this.value);
    // this.value.scaleX=this.value.scaleY=0.5;
  }
}

class ScoreBoard extends createjs.Container {
  /**
   * 分数板
   * @param {*} xpos 
   * @param {*} ypos 
   * @param {*} bg 背景图
   * 可选：默认"shape" 
   * {sheet:spritesheet, ani:sprite的animation}
   * {id:bitmap的id}
   * null
   */
  constructor(xpos = 0, ypos = 0, bg = "shape") {
    super();
    this.x = xpos;
    this.y = ypos;
    this._textElements = {};
    if (!bg) {
      return;
    } else if (bg == "shape") {
      this.scoreBar = new createjs.Shape();
      this.scoreBar.graphics.beginFill(GFrame.style.SCOREBOARD_COLOR)
        .drawRect(0, 0, GFrame.style.SCOREBOARD_WIDTH, GFrame.style.SCOREBOARD_HEIGHT);
      this.addChild(this.scoreBar);
    } else if (bg.sheet) {
      this.addChild(this.scoreBar);
      this.scoreBar = new createjs.Sprite(bg.sheet, bg.ani);
      this.addChild(this.scoreBar);
    } else {
      this.scoreBar = new createjs.Bitmap(queue.getResult(bg.id));
      this.addChild(this.scoreBar);
    }

  }
  /**
   * 创建分数元素
   * @param {String} key 
   * @param {String} value 
   * @param {*} xpos 
   * @param {*} ypos 
   * @param {{}} map 图片资源
   * {valsheet:（必选queue的dataid）,labsheet:(可选 ),labani:有labsheet后必选}
   * {valsheet:（必选queue的dataid）,labid:(可选 )bitmapid }
   */
  createTextElement(key, val, xpos, ypos, map) {
    if (map) {
      var obj = new SideBysideScoreBitmap(key, val, map);
    } else {
      var obj = new SideBysideScore(key, val);
    }
    this._textElements[key] = obj;
    obj.x = xpos;
    obj.y = ypos;
    this.addChild(obj);
  }
  /**
   * 跟新分数板
   * @param {*} key 
   * @param {*} val 
   */
  update(key, val) {
    this._textElements[key].setValText(val);
  }
}
/***************************************游戏基类****************************** */
const SCORE = "score",
  LEVEL = "level",
  LIEVES="lieves"
class Game {
  constructor() {
    this.buildElement();
    this.initScreen();
  }
  initScreen() {
    let width = stage.canvas.width,
      height = stage.canvas.height;
      // height = document.documentElement.clientHeight;
    mc.style.fontSize = 40; //mc组件字体大小
    this.titleScreen = new BasicScreen();
    this.titleScreen.createDisplayText('开始界面5', width / 2, height / 3);
    this.titleScreen.createOkButton((width - 300) / 2, height / 3 * 2, 'start', 300, 60);
    // this.titleScreen=new lib.Title();//协作animate使用-------------------1

    this.instructionScreen = new BasicScreen();
    this.instructionScreen.createDisplayText('介绍界面', width / 2, height / 3);
    this.instructionScreen.createOkButton((width - 300) / 2, height / 3 * 2, 'ok', 300, 60);

    this.levelInScreen = new BasicScreen();
    this.levelInScreen.createDisplayText('level:0', (width) / 2, height / 2, LEVEL);

    this.gameOverScreen = new BasicScreen();
    this.gameOverScreen.createDisplayText('结束界面', width / 2, height / 3);
    this.gameOverScreen.createOkButton((width - 300) / 2, height / 3 * 2, 'gameover', 300, 60);

    // this.scoreBoard = new ScoreBoard();
    // this.scoreBoard.createTextElement(SCORE, '0', 20, 14);
    // this.scoreBoard.createTextElement(LEVEL, '0', 320, 14);
  }
  newGame() {

  }
  newLevel() {

  }
  waitComplete() {
    //override
  }
  runGame() {

  }
  /**建立游戏元素
   * 在构造函数里建立
   */
  buildElement() {

  }
  clear() {
    
  }
  updateScoreBoard(key, val) {
    this.scoreBoard.update(key, val);
  }
  updateLevelInScreen(val) {
    this.levelInScreen.setText("level: " + val);
  }
  onkey() {
    document.onkeyup = (e) => {
      switch (e.keyCode) {
        case 65:
          this.leftKeyDown = false;
          break;
        case 68:
          this.rightKeyDown = false;
          break;
        case 87:
          this.upKeyDown = false;
          break;
        case 83:
          this.downKeyDown = false;
          break;
        case 32:
          createjs.Ticker.paused = !createjs.Ticker.paused;
          model.dispatchEvent(GFrame.event.PAUSE);
          break;
        default:
      }
    };
    document.onkeydown = (e) => {
      switch (e.keyCode) {
        case 65:
          if (!this.leftKeyDown) {
            this.leftKeyDown = true;

          }
          break;
        case 68:
          if (!this.rightKeyDown) {
            this.rightKeyDown = true;

          }
          break;
        case 87:
          if (!this.upKeyDown) {
            this.upKeyDown = true;

          }
          break;
        case 83:
          if (!this.downKeyDown) {
            this.downKeyDown = true;

          }
          break;
        default:
      }
    };
  }

}