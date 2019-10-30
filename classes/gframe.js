var stage, queue, model;
class GFrame {
  constructor(canvasId) {
    this._waitCount = 0;
    this._waitTime = 40;
    this._systemFunction = function () {};

    /*********接收animate影片剪辑播放过程发出的事件。***/
    // model = new createjs.EventDispatcher();

    this._setupStage(canvasId);
  }

  /**自适应
   * 
   * @param {boolean} h =true,是否高度适应
   */
  adapt() {
    let stageWidth = document.documentElement.clientWidth,
      stageHeight = document.documentElement.clientHeight,
      gameDiv = document.getElementById("game"),
      width = stage.canvas.width,
      height = stage.canvas.height,
      stageScale = 1;

    if (stageWidth / stageHeight > 0.665) {
      stageScale = stageHeight / height;
      gameDiv.style.left = (stageWidth - width * stageScale) / 2 + 'px';
    } else {
      stageScale = stageWidth / width;
    }
    gameDiv.style.transformOrigin = '0 0';
    gameDiv.style.transform = 'scale(' + stageScale + ')';
  }
  /**预加载
   * 
   */
  preload(array, comp = null) {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound); //注册声音插件
    if (comp) {
      var b = queue.on('fileload', this.onFileLoad, this, false, comp);
    }
    queue.on('complete', function onComplete(e) {
      if (b) queue.off('fileload', b);
      this.init();
    }, this, true);
    let loaderBar = new LoaderBar(stage);
    loaderBar.x = (stage.canvas.width - loaderBar.getBounds().width) / 2;
    loaderBar.y = (stage.canvas.height - loaderBar.getBounds().height) / 2;
    queue.on('progress', (e) => {
      loaderBar.startLoad(e.progress);
    });
    queue.loadManifest(array);
  }

  /**初始化
   * 
   */
  init() {
    this.initScreen();
    this._switchSystemState(GFrame.state.STATE_TITLE);
  }
  /**初始化屏幕元素
   * 
   */
  initScreen() {
    //overried
  }
  /**加载完成事件
   * 
   */
  onFileLoad(evt, comp) {
    let images = comp.getImages();
    if (evt && (evt.item.type == "image")) {
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
      if (!e.paused || this._currentSystemState != GFrame.state.STATE_GAME_PLAY) {
        this._systemFunction();
      }
      stage.update(); //创建全局舞台刷新
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
    stage.addChild(this.titleScreen);
    this.titleScreen.on(GFrame.event.OK_BUTTON, this._okButton, this, true);
    this._switchSystemState(GFrame.state.STATE_WAIT_FOR_CLOSE);
    this._nextSystemState = GFrame.state.STATE_INSTRUCTION;
  }
  //介绍界面状态
  _systemInstruction() {
    stage.addChild(this.instructionScreen);
    this.instructionScreen.on(GFrame.event.OK_BUTTON, this._okButton, this, true);
    this._switchSystemState(GFrame.state.STATE_WAIT_FOR_CLOSE);
    this._nextSystemState = GFrame.state.STATE_NEW_GAME;
  }
  //新游戏开始状态
  _systemNewGame() {
    stage.addEventListener(GFrame.event.SCOREBOARD_UPDATE, (e) => {
      this.scoreBoard.update(e.key, e.value);
    });
    stage.addEventListener(GFrame.event.LEVELIN_UPDATE, (e) => {
      this.levelInScreen.setDisplayText(e.key, e.value);
    });
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
    document.onkeydown = null;
    document.onkeyup = null;
    stage.removeAllChildren();
    this.game.newLevel();
    this._switchSystemState(GFrame.state.STATE_LEVEL_IN);
  }
  //新等级界面状态
  _systemLevelIn() {
    stage.addChild(this.levelInScreen);
    this._nextSystemState = GFrame.state.STATE_GAME_PLAY;
    this._switchSystemState(GFrame.state.STATE_WAIT);
  }
  //结束界面状态
  _systemGameOver() {
    document.onkeydown = null;
    document.onkeyup = null;
    stage.removeAllChildren();
    stage.removeAllEventListeners();
    stage.addChild(this.gameOverScreen);
    this.gameOverScreen.on(GFrame.event.OK_BUTTON, this._okButton, this, true);
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
    this._waitCount++;
    if (this._waitCount > this._waitTime) {
      this._waitCount = 0;
      switch (this._lastSystemState) {
        case GFrame.state.STATE_LEVEL_IN:
          stage.addChild(this.scoreBoard);
          stage.removeChild(this.levelInScreen);
          stage.dispatchEvent(GFrame.event.WAIT_COMPLETE); //等待完成发送事件
          break;
        default:
      }
      this._switchSystemState(this._nextSystemState);
    }
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
  SCORE_TEXT_SIZE: 28,
  SCORE_TEXT_COLOR: "#FFFFFF",
  SCOREBOARD_HEIGHT: 60,
  SCORE_BUFF: 65
};
GFrame.event = {
  GAME_OVER: "gameover",
  NEW_LEVEL: "newlevel",
  WAIT_COMPLETE: "waitcomplete",
  OK_BUTTON: "okbutton",
  SCOREBOARD_UPDATE: "scoreboardupdatetext",
  LEVELIN_UPDATE: "levelinupdatetext",
  DATA_UPDATE: class extends createjs.Event {
    constructor(type, key, value, bubbles = false, cancelable) {
      super(type, bubbles, cancelable);
      this.key = key;
      this.value = value;
    }
  }
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
    this._textElements = {};
  }
  /**创建显示文本
   * 
   * @param {string} text 文本内容
   * @param {number} xpos 文本x坐标
   * @param {number} ypos 文本y坐标
   * @param {[string]} key 文本存储索引 默认null
   */
  createDisplayText(text, xpos, ypos, key) {
    let displayText = new createjs.Text(text);
    displayText.x = xpos;
    displayText.y = ypos;
    displayText.textAlign = "center";
    displayText.textBaseline = "middle";
    displayText.font = GFrame.style.TITLE_TEXT_SIZE + "px Microsoft YaHei";
    displayText.color = GFrame.style.TITLE_TEXT_COLOR;
    this.addChild(displayText);
    if (key) {
      this._textElements[key] = displayText;
    }
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
  setDisplayText(key, val) {
    this._textElements[key].text = val;
  }
}
class SideBysideScore extends createjs.Container {
  constructor(labeText, valText) {
    super();
    this._label = new createjs.Text(labeText + ' ' + ':', GFrame.style.SCORE_TEXT_SIZE + 'px Microsoft YaHei', GFrame.style.SCORE_TEXT_COLOR);
    this._value = new createjs.Text(valText, GFrame.style.SCORE_TEXT_SIZE + 'px Microsoft YaHei', GFrame.style.SCORE_TEXT_COLOR);
    // this._value.y = 2;
    this._label.x = 0;
    this._value.x = GFrame.style.SIDE_BUFFWIDTH + this._label.getBounds().width;
    this.addChild(this._label, this._value);
  }
  setValText(str) {
    this._value.text = str;
  }
}

class ScoreBoard extends createjs.Container {
  constructor() {
    super();
    this._textElements = {};
  }
  /**创建背景色
   * 
   * @param {number} width 宽度
   * @param {number} height 高度
   * @param {string} color 颜色
   */
  createBG(width, height, color) {
    let board = new createjs.Shape();
    board.graphics.beginFill(color).drawRect(0, 0, width, height);
    board.cache(0, 0, width, height);
    this.addChildAt(board, 0);
  }
  /**创建分数元素
   * 
   * @param {string} key 分数引索
   * @param {SideBysideScore} obj 
   * @param {number} xpos 分数元素x坐标
   * @param {number} ypos 分数元素y坐标
   */
  creatTextElement(key, val, xpos, ypos) {
    let obj = new SideBysideScore(key, val);
    this._textElements[key] = obj;
    obj.x = xpos || (this.getBounds() ? this.getBounds().width + GFrame.style.SCORE_BUFF : 20);
    obj.y = ypos || 20;
    this.addChild(obj);

  }
  /**闪烁分数
   * 
   * @param {array} key 索引数组
   */
  flicker(key) {
    setInterval(() => {
      key.forEach((item) => {
        this._textElements[item].alpha = this._textElements[item].alpha === 1 ? 0 : 1;
      })
    }, 800);

  }
  update(key, val) {
    this._textElements[key].setValText(val);
  }
}
/***************************************游戏基类****************************** */
class Game {
  constructor() {
    this.buildElement();
  }
  newGame() {

  }
  newLevel() {

  }
  runGame() {

  }
  /**建立游戏元素
   * 在构造函数里建立
   */
  buildElement() {

  }
  /**levelinscreen等待结束时执行
   * 
   */
  waitComplete() {

  }


}