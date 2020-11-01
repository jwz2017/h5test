var stage, queue, model, lib, width, height, stageScale = 1;
window.onload = function () {
  "use strict";
  /*************游戏入口*****/
  var g = new GFrame('canvas');
  //设置窗口高度
  var container = document.getElementById("container");
  container.style.height = document.documentElement.clientHeight + 'px';
  /****************选择菜单或直接加载游戏******************* */
  mainlist(); //菜单方式
  //直接加载游戏方式
  // g.adapt();//可加true参数在pc端高度自适应
  // g.preload();//参数为具体游戏

  function mainlist() {
    var select = document.getElementById("select");
    var mainlist = document.getElementById("mainlist");
    var game = document.getElementById("game");
    select.focus();
    select.onchange = function () {
      mainlist.style.display = "none";
      game.style.width = 100 + '%';
      game.style.display = "block";
      let index = select.selectedIndex;
      let sgame = eval(select.options[index].value);
      //选择>750高度自适应游戏
      if (index === 1) {
        g.adapt(true);
      } else {
        g.adapt();
      }
      //检查是否已加载过
      if (!sgame.preload) {
        g.preload(sgame);
      } else {
        g.initGame(sgame);
      }
    }

  }

  /***********fps********** */
  // FPS.startFPS(stage);

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

  /********************自适应*********************
   * 
   * 
   */
  adapt(bool) {
    let stageWidth = document.documentElement.clientWidth,
      stageHeight = document.documentElement.clientHeight;
    let game = document.getElementById("game");
    //宽度自适应
    if (stageWidth <= 750) {
      stageScale = (stageWidth / width); //.toFixed(2);//四舍五入
      let h = stageHeight / stageScale,
        h1 = stage.canvas.height;
      height = h > h1 ? h1 : h;
    }
    //高度自适应
    else if (stageWidth >= 1200 && bool) {
      stageScale = stageHeight / height;
      game.style.width = width * stageScale + 'px';
    }
    //不缩放
    else {
      stageScale = 1;
      let h = stageHeight / stageScale,
        h1 = stage.canvas.height;
      height = h > h1 ? h1 : h;
    }
    game.style.transform = 'scale(' + stageScale + ')';
  }

  /*********************预加载****************************
   * 
   * @param {*} array 
   * @param {*} game 
   * @param {*} compid 
   */
  preload(GClass) {
    if ((!GClass.loadItem && !GClass.id) || GClass.isloaded) {
      this.initGame(GClass);
      return;
    }
    if (!queue) {
      //开启false,图片地址为加载后的图像，ture: json数据写成js，
      // 地址用 getResult()
      queue = new createjs.LoadQueue(false);
      queue.installPlugin(createjs.Sound); //注册声音插件
      if (GClass.loaderbar) {
        queue.loadManifest(GClass.loaderbar);
        queue.on('complete', () => {
          this.loaderBar = new LoaderBar1(queue.getResult("loaderbarData"));
          this._preloadon(GClass);
        }, this, true);
      } else {
        this.loaderBar = new LoaderBar();
        this._preloadon(GClass);
      }
    }
  }
  _preloadon(GClass) {
    this.loaderBar.x = (width - this.loaderBar.getBounds().width) / 2;
    this.loaderBar.y = (height - this.loaderBar.getBounds().height) / 2;
    stage.addChild(this.loaderBar);
    queue.on('complete', function onComplete(e) {
      queue.removeAllEventListeners();
      stage.removeChild(this.loaderBar);
      GClass.isloaded = true;
      this.initGame(GClass);
    }, this, true);
    queue.on('progress', (e) => {
      this.loaderBar.startLoad(e.progress);
    });
    queue.on('error', () => {
      console.log("loaderror");
    });
    if (GClass.id) {
      let comp = AdobeAn.getComposition(GClass.id);
      queue.on('fileload', this.onFileLoad, this, false, comp);
      lib = comp.getLibrary();
      queue.loadManifest(lib.properties.manifest);
    }
    if (GClass.loadItem) {
      queue.loadManifest(GClass.loadItem);
    }
  }

  /**初始化游戏
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
    stage.enableMouseOver(); //开启鼠标经过事件
    width = stage.canvas.width;
    height = stage.canvas.height;
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
    this.game.titleScreen.on(GFrame.event.OK_BUTTON, this._okButton, this, true);
    this._switchSystemState(GFrame.state.STATE_WAIT_FOR_CLOSE);
    this._nextSystemState = GFrame.state.STATE_INSTRUCTION;
  }
  //介绍界面状态
  _systemInstruction() {
    stage.addChild(this.game.instructionScreen);
    this.game.instructionScreen.on(GFrame.event.OK_BUTTON, this._okButton, this, true);
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
    stage.removeAllEventListeners();
    stage.addChild(this.game.gameOverScreen);
    this.game.gameOverScreen.on(GFrame.event.OK_BUTTON, this._okButton, this, true);
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
          this.game.waitComplete();
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
  TITLE_TEXT_SIZE: 54,
  TITLE_FONTFAMILY: "Microsoft YaHei",
  TITLE_TEXT_COLOR: "#FF0000",
  //分数板样式
  SCORE_TEXT_SIZE: 36,
  SCORE_BUFF: 2,
  SCOREBOARD_HEIGHT: 70,
  SCOREBOARD_WIDTH: 750,
  SCOREBOARD_FONTFAMILY: "Calibri",
  SCORE_TEXT_COLOR: "#FFFFFF",
  SCOREBOARD_COLOR: "#333"
  // "Microsoft YaHei"

};
GFrame.event = {
  GAME_OVER: "gameover",
  NEW_LEVEL: "newlevel",
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
  constructor(text = null, xpos = 0, ypos = 0) {
    super();
    this.displayText = new createjs.Text(text);
    this.displayText.text = text;
    this.displayText.x = xpos;
    this.displayText.y = ypos;
    this.displayText.textAlign = "center";
    this.displayText.textBaseline = "middle";
    this.displayText.font = GFrame.style.TITLE_TEXT_SIZE + 'px ' + GFrame.style.TITLE_FONTFAMILY;
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
    new PushButton(this, label, () => {
      this.dispatchEvent(GFrame.event.OK_BUTTON, false);
    }, xpos, ypos, width, height, new Star(6, 0.5));
  }
  /**设置文本内容
   * 
   * @param {string} key 文本索引
   * @param {string} val 文本内容
   */
  setText(val) {
    this.displayText.text = val.toString();
  }

}
class SideBysideScore extends createjs.Container {
  /**
   * 
   * @param {*} label 引索也是key
   * @param {*} value 
   * @param {*} obj 图片资源
   * {valsheet:（必选queue的dataid）,labsheet:(可选 ),labani:有labsheet后必选}
   * {valsheet:（必选queue的dataid）,labid:(可选 )bitmapid }
   * map. scale:缩放
   */
  constructor(label, value, obj = null, scale = 1, letterSpacing = 2) {
    super();
    if (!obj) {
      this.createScore(label, value);
    } else {
      this.createScorePic(label, value, obj, scale, letterSpacing);
    }
  }
  createScore(label, value) {
    this._label = new createjs.Text(label + ':', GFrame.style.SCORE_TEXT_SIZE + 'px ' + GFrame.style.SCOREBOARD_FONTFAMILY, GFrame.style.SCORE_TEXT_COLOR);
    this._value = new createjs.Text(value, GFrame.style.SCORE_TEXT_SIZE + 'px ' + GFrame.style.SCOREBOARD_FONTFAMILY, GFrame.style.SCORE_TEXT_COLOR);
    this._value.y = 1;
    this._label.x = 0;
    this._value.x = GFrame.style.SCORE_BUFF + this._label.getMeasuredWidth();
    this.addChild(this._label, this._value);
  }
  createScorePic(label, value, obj, scale, letterSpacing) {
    let sheet = obj.valsheet;
    this._value = new createjs.BitmapText(value, sheet);
    this._value.regY = this._value.getBounds().height / 2;
    this._value.scaleX = this._value.scaleY = scale;
    if (obj.labsheet) {
      this._label = new createjs.Sprite(obj.labsheet, obj.labani);
    } else if (obj.labid) {
      this._label = new createjs.Bitmap(queue.getResult(obj.labid));
    } else {
      this._label = new createjs.Text(label + ' :', GFrame.style.SCORE_TEXT_SIZE + 'px ' + GFrame.style.SCOREBOARD_FONTFAMILY, GFrame.style.SCORE_TEXT_COLOR);
    }
    let valuexpos = this._label.getBounds().width + GFrame.style.SCORE_BUFF,
      valueypos = this._label.getBounds().height / 2;
    this._value.x = valuexpos;
    this._value.y = valueypos;
    this._value.letterSpacing = letterSpacing;
    this.addChild(this._label, this._value);
  }
  setValText(val) {
    this._value.text = val.toString();
  }
}
class ScoreBoard extends createjs.Container {
  /**
   * 分数板
   * @param {*} xpos 
   * @param {*} ypos 
   * @param {*} obj 背景图{(sheet,ani)或id或null 默认“shape”}
   */
  constructor(xpos = 0, ypos = 0,obj="shape") {
    super();
    this.x = xpos;
    this.y = ypos;
    this._textElements = {};
    if (!obj) {
      return;
    } else if (obj.id) {
      this.scoreBar = new createjs.Bitmap(queue.getResult(obj.id));
    } else if (obj.sheet) {
      this.scoreBar = new createjs.Sprite(obj.sheet, obj.ani);
    } else {
      this.scoreBar = new createjs.Shape();
      this.scoreBar.graphics.beginFill(GFrame.style.SCOREBOARD_COLOR)
        .drawRect(0, 0, GFrame.style.SCOREBOARD_WIDTH, GFrame.style.SCOREBOARD_HEIGHT);
    }
    this.addChild(this.scoreBar);
  }
  /**
   * 创建分数元素
   * @param {*} label 
   * @param {*} val 
   * @param {*} xpos 
   * @param {*} ypos 
   * @param {*} obj 图片资源 {(labsheet,labani或labid)(valsheet)}
   * @param {*} scale =1
   * @param {*} letterSpacing =2
   */
  createTextElement(label, val, xpos, ypos, obj, scale, letterSpacing) {
    var _obj = new SideBysideScore(label, val, obj, scale, letterSpacing);
    this._textElements[label] = _obj;
    _obj.x = xpos;
    _obj.y = ypos;
    this.addChild(_obj);
  }
  /**
   * 跟新分数板
   * @param {*} label 
   * @param {*} val 
   */
  update(label, val) {
    this._textElements[label].setValText(val);
  }
}
/***************************************游戏基类****************************** */
class Game {
  constructor() {
    mc.style.fontSize = 40; //mc组件字体大小
    this.createTitleScreen();
    this.createInstructionScreen();
    this.createLevelInScreen();
    this.createGameOverScreen();
    this.createScoreBoard();
    this.buildElement();
  }
  buildElement() {

  }
  createTitleScreen() {
    this.titleScreen = new BasicScreen('开始界面5', width / 2, height / 3);
    this.titleScreen.createOkButton((width - 250) / 2, height / 3 * 2, 'start', 250, 250); //300,60
    // this.titleScreen=new lib.Title();//协作animate使用-------------------1
  }
  createInstructionScreen() {
    this.instructionScreen = new BasicScreen('介绍界面', width / 2, height / 3);
    this.instructionScreen.createOkButton((width - 250) / 2, height / 3 * 2, 'ok', 250, 250);
  }
  createLevelInScreen() {
    this.levelInScreen = new BasicScreen('level:0', width / 2, height / 2);
  }
  createGameOverScreen() {
    this.gameOverScreen = new BasicScreen('结束界面', width / 2, height / 3);
    this.gameOverScreen.createOkButton((width - 250) / 2, height / 3 * 2, 'over', 250, 250);
  }
  createScoreBoard() {

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
    stage.removeAllChildren();
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