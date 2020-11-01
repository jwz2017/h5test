const mc = {};
mc.style = {
  //颜色
  shadowColor: "#888888",
  borderColor: "#999999",
  buttonDownColor: "#bbbbbb",
  buttonOverColor: "#cccccc",
  buttonUpColor: "#ffffff",
  labelColor: "#666666",
  highlightColor: "#eeeeee",
  fontSize: 12,
  fontName: "sans-serif", //"YaHei",
  strokeStyle: 2,
  CENTER_MIDDLE: "centermiddle",
  LEFT_MIDDLE: "leftmiddle",
  CENTER_BOTTOM: "centerbottom",
  RIGHT_MIDDLE: "rightmiddle",
  CENTER_TOP: "centertop",
  SCROLL_BAR_SIZE:20,
  DARK: "dark",
  /**
   * @param {[string]} val =null [可选：可设置值：mc.style.DARK]
   */
  setStyle: function (val) {
    switch (val) {
      case this.DARK:
        this.shadowColor = "#999999";
        this.borderColor = "#555555";
        this.buttonDownColor = "#444444";
        this.buttonOverColor = "#999999";
        this.buttonUpColor = "#666666";
        this.labelColor = "#cccccc";
        break;
      default:
        this.shadowColor = "#888888";
        this.borderColor = "#999999";
        this.buttonDownColor = "#bbbbbb";
        this.buttonOverColor = "#cccccc";
        this.buttonUpColor = "#ffffff";
        this.labelColor = "#666666";
    }
  }
};
//---------------------------------------------------图形----------------------------------------------------------------------

//进度条
class LoaderBar extends createjs.Container {
  /**
   * 进度条
   * @param {[object]} parent 父级容器
   * @param {[number]} x 
   * @param {[number]} y 
   * @param {[number]} width 
   * @param {[number]} height 
   */
  constructor(parent, x=0, y=0, width=400, height=20) {
    super();
    if (parent) {
      parent.addChild(this);
    }
    this.loaderBar=new createjs.Shape();
    this.x = x;
    this.y = y ;
    this.percentLoaded = 0;
    this.loaderBar.setBounds(0, 0, width, height);
    //标题
    this.titleText=new createjs.Text('loading...','36px Stylus BT','#ffffff');
    this.titleText.textAlign="center";
    this.titleText.x=width/2;
    this.titleText.y=-45;
    //数字
    this.text=new createjs.Text(this.percentLoaded+"%", '32px Microsoft YaHei', "#ffffff");
    this.text.textAlign="center";
    this.text.x=width/2;
    this.text.y=height+10;
    this.addChild(this.loaderBar,this.text,this.titleText);
    this._redraw();
  }
  _redraw() {
    let t=Math.floor(this.percentLoaded*100);
    this.text.text=t+"%";
    this.loaderBar.graphics.clear();
    this.loaderBar.graphics.beginFill('#ffffff').drawRect(3, 3, (this.loaderBar.getBounds().width-6) * this.percentLoaded, this.loaderBar.getBounds().height-6).endFill();
    this.loaderBar.graphics.setStrokeStyle(2).beginStroke('#ffffff').drawRect(0, 0, this.loaderBar.getBounds().width, this.loaderBar.getBounds().height).endStroke();
  }
  /**
   * 开始加载
   */
  startLoad(percentLoaded) {
    this.percentLoaded=percentLoaded;
    if (this.percentLoaded >= 1) {
      this.percentLoaded=1;
    }
    this._redraw();
  }
}
//进度条1
class LoaderBar1 extends createjs.Container {
  /**
   * 进度条
   * @param {[object]} parent 父级容器
   * @param {[number]} x 
   * @param {[number]} y 
   * @param {[number]} width 
   * @param {[number]} height 
   */
  constructor(dataid,parent, x=0, y=0, width=400, height=20) {
    super();
    if (parent) {
      parent.addChild(this);
    }
    this.width=width;
    this.height=height;
    this.loaderBar=new createjs.Shape();
    this.x = x;
    this.y = y ;
    this.percentLoaded = 0;
    this.loaderBar.setBounds(0, 0, width, height);
    //标题
    this.titleText=new createjs.Text('loading...','36px Stylus BT','#ffffff');
    this.titleText.textAlign="center";
    this.sheet=new createjs.SpriteSheet(dataid);
    this.titleText=new createjs.Sprite(this.sheet,"title");
    this.titleText.y=-this.titleText.getBounds().height;
    //数字
    this.percent=new createjs.BitmapText(this.percentLoaded.toString()+'%',this.sheet);
    this.percent.x=(width-this.percent.getBounds().width)/2;
    this.percent.y=this.height+10;
    this.addChild(this.loaderBar,this.percent,this.titleText);
    this._redraw();
    //测试图片预加载,,,queue = new createjs.LoadQueue(false)
    // var a=new Image();
    // a.src="assets/loaderbar.png";
    // var b=new createjs.Bitmap("assets/loaderbar.png");
    // console.log(a.width,b.getBounds().width);
  }
  _redraw() {
    let t=Math.floor(this.percentLoaded*100);
    this.percent.text=t.toString()+"%";
    this.titleText.x=this.width * this.percentLoaded-this.titleText.getBounds().width/2;
    this.loaderBar.graphics.clear();
    this.loaderBar.graphics.beginRadialGradientFill(["#F00","#0F0"], [0, 1], 100, 100, 0,0, 0, 300).drawRoundRect(3, 3, (this.width-6) * this.percentLoaded, this.height-6,7).endFill();
    this.loaderBar.graphics.setStrokeStyle(2).beginStroke('#ffffff').drawRoundRect(0, 0, this.width, this.height,10).endStroke();
  }
  /**
   * 开始加载
   */
  startLoad(percentLoaded) {
    this.percentLoaded=percentLoaded;
    if (this.percentLoaded >= 1) {
      this.percentLoaded=1;
    }
    this._redraw();
  }
}



//---------------------------------------------------Graphics---------------------------------------------------------------
class Rect extends createjs.Graphics {
  constructor() {
    super();
  }
  //border
  drawBorder(width, height, color) {
    this.beginFill(color).drawRect(0, 0, width, height);
  }
  //face
  drawFaceDown(width, height, color) {
    this.beginFill(color).drawRect(1.5, 1.5, width - 1.5, height - 1.5);
  }
  drawFaceUp(width, height, color) {
    this.beginFill(color).drawRect(1, 1, width - 2, height - 2);
  }
  //selected
  drawSelected(width, height) {
    this.beginFill(mc.style.highlightColor).drawRect(2, 2, width - 4, height - 4);
    this.beginFill(mc.style.shadowColor).drawRect(3, 3, width - 5, height - 5);
    this.beginFill(mc.style.buttonDownColor).drawRect(3, 3, width - 6, height - 6);
  }
  //handle
  drawHandle(x, y, height) {
    this.beginFill(mc.style.highlightColor).drawRect(x + 1, y + 1, height - 2, height - 2);
    this.beginFill(mc.style.shadowColor).drawRect(x + 2, y + 2, height - 2, height - 2);
    this.beginFill(mc.style.buttonDownColor).drawRect(x + 2, y + 2, height - 3, height - 3);
  }
}
class Circle extends createjs.Graphics {
  constructor() {
    super();
  }
  //border
  drawBorder(width, height, color) {
    const r = width / 2;
    this.beginFill(color).drawCircle(r, r, r);
  }
  //face
  drawFaceDown(width, height, color) {
    const r = width / 2;
    this.beginFill(color).drawCircle(r + 0.5, r + 0.5, r - 0.6);
  }
  drawFaceUp(width, height, color) {
    const r = width / 2;
    this.beginFill(color).drawCircle(r, r, r - 1);
  }
  //selected
  drawSelected(width, height) {
    this.beginFill(mc.style.highlightColor).drawCircle(width / 2, height / 2, width / 2 - 2);
    this.beginFill(mc.style.shadowColor).drawCircle(width / 2 + 0.5, height / 2 + 0.5, width / 2 - 2.5);
    this.beginFill(mc.style.buttonDownColor).drawCircle(width / 2, height / 2, width / 2 - 3);
  }

}
class Arrow extends createjs.Graphics {
  /**
   *  箭头绘制
   * @param {number} rot =0，箭头角度
   */
  constructor(rot = 0) {
    super();
    this._arrowRotation = rot;
  }
  //border
  drawBorder(width, height, color) {
    const mat = new createjs.Matrix2D().translate(width / 2, height / 2).rotate(this._arrowRotation);
    this.beginFill(color);
    utils.drawPoints(this, mat, this._getPoints(width, height));
  }
  //face
  drawFaceDown(width, height, color) {
    const mat = new createjs.Matrix2D().translate(width / 2 + 0.5, height / 2 + 0.5).rotate(this._arrowRotation);
    this.beginFill(color);
    utils.drawPoints(this, mat, this._getPoints(width - 2, height - 2));
  }
  drawFaceUp(width, height, color) {
    const mat = new createjs.Matrix2D().translate(width / 2, height / 2).rotate(this._arrowRotation);
    this.beginFill(color);
    utils.drawPoints(this, mat, this._getPoints(width - 1.5, height - 1.5));
  }
  _getPoints(width, height) {
    return [
      [-width / 2, -height / 4],
      [0, -height / 4],
      [0, -height / 2],
      [width / 2, 0],
      [0, height / 2],
      [0, height / 4],
      [-width / 2, height / 4]
    ];
  }
}
class RoundRect extends createjs.Graphics {
  constructor(radius = 5) {
    super();
    this._radius = radius;
  }
  //border
  drawBorder(width, height, color) {
    this.beginFill(color).drawRoundRect(0, 0, width, height, this._radius);
  }
  //face
  drawFaceDown(width, height, color) {
    this.beginFill(color).drawRoundRect(1.5, 1.5, width - 1.5, height - 1.5, this._radius);
  }
  drawFaceUp(width, height, color) {
    this.beginFill(color).drawRoundRect(1, 1, width - 2, height - 2, this._radius);
  }
  //selected
  drawSelected(width, height) {
    this.beginFill(mc.style.highlightColor).drawRoundRect(2, 2, width - 4, height - 4, this._radius);
    this.beginFill(mc.style.shadowColor).drawRoundRect(3, 3, width - 5, height - 5, this._radius);
    this.beginFill(mc.style.buttonDownColor).drawRoundRect(3, 3, width - 6, height - 6, this._radius);
  }
  //handle
  drawHandle(x, y, height) {
    this.beginFill(mc.style.highlightColor).drawRoundRect(x + 1, y + 1, height - 2, height - 2, this._radius);
    this.beginFill(mc.style.shadowColor).drawRoundRect(x + 2, y + 2, height - 2, height - 2, this._radius);
    this.beginFill(mc.style.buttonDownColor).drawRoundRect(x + 2, y + 2, height - 3, height - 3, this._radius);
  }
}
class Star extends createjs.Graphics {
  constructor(sides = 4, pointSize = 0.6, angle = -90) {
    super();
    this._sides = sides;
    this._pointSize = pointSize;
    this._angle = angle;
  }
  //border
  drawBorder(width, height, color) {
    const r = width / 2;
    this.beginFill(color).drawPolyStar(r, r, r, this._sides, this._pointSize, this._angle);
  }
  //face
  drawFaceDown(width, height, color) {
    const r = width / 2;
    this.beginFill(color).drawPolyStar(r + 0.7, r + 0.7, r - 0.7, this._sides, this._pointSize, this._angle);
  }
  drawFaceUp(width, height, color) {
    const r = width / 2;
    this.beginFill(color).drawPolyStar(r, r, r - 1, this._sides, this._pointSize, this._angle);
  }
  //selected
  drawSelected(width, height) {
    this.beginFill(mc.style.highlightColor).drawPolyStar(width / 2, height / 2, width / 2 - 4, this._sides, this._pointSize, this._angle);
    this.beginFill(mc.style.shadowColor).drawPolyStar(width / 2 + 0.5, height / 2 + 0.5, width / 2 - 5.5, this._sides, this._pointSize, this._angle);
    this.beginFill(mc.style.buttonDownColor).drawPolyStar(width / 2, height / 2, width / 2 - 7, this._sides, this._pointSize, this._angle);
  }

}
//---------------------------------------------------图形按钮类-----------------------------------------------------------
class ButtonShape extends createjs.Shape {
  constructor(parent, handle, GClass = new Rect) {
    super()
    if (parent) parent.addChild(this);
    this._handler = handle;
    this.graphics = GClass;
    //状态
    this.cursor = "pointer"; //手型
    this._down = false;
    this._over = false;
    this._selected = false; //选择状态
    this.toggle = false; // 设置是否开关状态
    this._enable = true;
    //鼠标事件
    this.on("mouseover", e => {
      this._over = true;
      this.redraw();
    })
    this.on("mouseout", this._onMouseOut);
    this.on("mousedown", this._onMouseDown);
    this.on("pressup", this._onPressUp);
  }
  _onMouseDown(e) {
    this._down = true;
    this.redraw();
  }
  _onMouseOut(e) {
    this._down = this._selected;
    this._over = false;
    this.redraw();
  }
  _onPressUp(e) {
    if (this._over && this._down && this.toggle) {
      this._selected = !this._selected;
    }
    if (this._handler && e.target.hitTest(e.localX, e.localY)) {
      this._handler(this);
    }
    this._down = this._selected;
    this.redraw();
  }
  redraw() {
    this.graphics.clear();
    //override
  }

  get enable() {
    return this.mouseEnabled;
  }

  set enable(enable) {
    this.mouseEnabled = enable;
  }

  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get selected() {
    return this._selected;
  }
  set selected(val) {
    if (this._selected != val) {
      this._selected = val;
      this.redraw();
    }
  }

  setSize(width, height) {
    this._width = width;
    this._height = height;
    this.setBounds(0, 0, this._width, this._height);
    this.redraw();
  }
}
//pushButtonShape类
class PushButtonShape extends ButtonShape {
  /**
   * 方形按钮
   * @param {Container} parent 父级容器
   * @param {Function} handle 点击事件
   * @param {Number} width =100
   * @param {number} height =20
   * @param {Class} GClass =Rect
   */
  constructor(parent, handle, width = 100, height = 20, GClass) {
    super(parent, handle, GClass);
    this.setSize(width, height);
  }
  redraw() {
    super.redraw();
    //drawborder
    if (this._down) {
      this.graphics.drawBorder(this._width, this._height, mc.style.shadowColor);
    } else {
      this.graphics.drawBorder(this._width, this._height, mc.style.borderColor);
    }
    //drawFace
    if (this._down) {
      this.graphics.drawFaceDown(this._width, this._height, mc.style.buttonDownColor);
    } else if (this._over) {
      this.graphics.drawFaceUp(this._width, this._height, mc.style.buttonOverColor);
    } else {
      this.graphics.drawFaceUp(this._width, this._height, mc.style.buttonUpColor);
    }
  }
}
//带三角的pushbuttonShape类
class ArrowButtonShape extends PushButtonShape {
  constructor(parent, handle, width = 20, height = 20, arrowRotation = 0, GClass) {
    super(parent, handle, width, height, GClass)
    this.arrowWidth = width/2;
    this.arrowHeight = height/4;
    this.arrowRotation = arrowRotation;
  }
  redraw() {
    super.redraw();
    //绘制三角形
    if (this._down) {
      this.graphics.beginFill(mc.style.buttonUpColor);
    } else {
      this.graphics.beginFill(mc.style.shadowColor);

    }
    const mat = new createjs.Matrix2D().translate(this._width / 2, this._height / 2).rotate(this._arrowRotation);
    utils.drawPoints(this.graphics, mat, [
      [0, -this.arrowHeight / 2],
      [this.arrowWidth / 2, this.arrowHeight / 2],
      [-this.arrowWidth / 2, this.arrowHeight / 2],
      [0,-this.arrowHeight/2]
    ]);
  }
  get arrowRotation() {
    return this._arrowRotation;
  }
  set arrowRotation(val) {
    this._arrowRotation = val;
    this.redraw();
  }

}
//checkBoxShape类
class CheckBoxShape extends ButtonShape {
  /**
   * 
   * @param {Container} parent 容器
   * @param {Function} handle 点击事件
   * @param {boolen} selected =false选择状态
   * @param {number} width =15 宽度
   * @param {*} height 
   * @param {*} GClass 
   */
  constructor(parent, handle, selected = false, width = 15, height = 15, GClass) {
    super(parent, handle, GClass);
    this._selected = selected;
    this.toggle = true;
    this.setSize(width, height);
  }
  _onMouseDown(e) {
    this._down = true;
  }
  redraw() {
    super.redraw();
    //绘制border
    this.graphics.drawBorder(this._width, this._height, mc.style.shadowColor);
    //drawFace
    if (this._over) {
      this.graphics.drawFaceDown(this._width, this._height, mc.style.buttonOverColor);
    } else {
      this.graphics.drawFaceDown(this._width, this._height, mc.style.buttonUpColor);
    }
    //绘制选择状态
    if (this._selected) {
      this.graphics.drawSelected(this._width, this._height);
    }
  }
}
//sliderShape类
class SliderShape extends ButtonShape {
  constructor(parent, handle, sliderWidth = 120, sliderHeight = 10, GClass, isVSlider = true) {
    super(parent, handle, GClass);
    this._isVSlider = isVSlider;

    this.valueLabel = new createjs.Text("0");

    this._handlePos = 0;
    this._px = this._isVSlider ? 0 : 1;
    this._py = this._isVSlider ? 1 : 0;

    this._value = 0;
    this._precision = 2; //小数点位数
    this._continuous = true; //是否持续执行函数
    this._minimum = 0;
    this._maximum = 100;
    this._draging = false;
    this.on('pressmove', e => {
      this._press(e);
      this._calculateValue();
      if (this._handler && this._continuous) {
        this._handler(this);
      }
    });
    this.setSize(sliderWidth, sliderHeight);
  }
  _onMouseDown(e) {
    this._down = true;
  }
  _onMouseOut(e) {
    this._over = false;
    this.redraw();
  }
  _onPressUp(e) {
    this._down = false;
    this._press(e);
    this._calculateValue();
    if (this._handler) {
      this._handler(this);
    }
  }
  _press(e) {
    const p = [e.localY, e.localX],
      mousePos = p[this._px];
    this._handlePos = mousePos - this._sliderHeight / 2;
    this._handlePos = Math.min(this._handlePos, this._sliderWidth - this._sliderHeight);
    this._handlePos = Math.max(this._handlePos, 0);
  }
  _calculateValue() {
    const range = this._maximum - this._minimum,
      h = this._sliderWidth - this._sliderHeight,
      d = [h - this._handlePos, this._handlePos],
      mult = Math.pow(10, this._precision);
    this._value = this._minimum + d[this._px] / h * range;
    this._value = Math.min(this._value, this._maximum);
    this._value = Math.max(this._value, this._minimum);
    this.value = Math.round(this._value * mult) / mult;
  }
  _calculateHandle() {
    const range = this._maximum - this._minimum,
      percent = (this._value - this._minimum) / range,
      pts = [1 - percent, percent],
      h = this._sliderWidth - this._sliderHeight;
    this._handlePos = h * pts[this._px];
  }
  redraw() {
    const VHPos = [0, this._handlePos],
      posX = VHPos[this._px],
      posY = VHPos[this._py];
    this.graphics.clear();
    //drawborder
    this.graphics.drawBorder(this._width, this._height, mc.style.shadowColor);
    if (this._over || this._down) {
      this.graphics.drawFaceDown(this._width, this._height, mc.style.buttonOverColor);
    } else {
      this.graphics.drawFaceDown(this._width, this._height, mc.style.buttonUpColor);
    }
    //drawhandle
    this.graphics.drawHandle(posX, posY, this._sliderHeight);
  }
  get value() {
    return this._value;
  }
  set value(val) {
    this._value = val;
    this.valueLabel.text = val;
    this._calculateHandle();
    this.redraw();
  }
  setSize(sliderWidth, sliderHeight) {
    this._sliderWidth = sliderWidth;
    this._sliderHeight = sliderHeight;
    this._width = this._isVSlider ? sliderHeight : sliderWidth;
    this._height = this._isVSlider ? sliderWidth : sliderHeight;
    this.setBounds(0, 0, this._width, this._height);
    this._calculateHandle();
    this.redraw();
  }
  setMmum(max, min) {
    this._maximum = max;
    this._minimum = min;
    this._value = Math.max(this._value, min);
    this.value = Math.min(this._value, max);
  }
  get continuous() {
    return this._continuous;
  }
  set continuous(bool) {
    this._continuous = bool;
  }
  get precision() {
    return this._precision;
  }
  set precision(val) {
    this._precision = val;
  }
}
//-------------------------------------------------组件类--------------------------------------------------------------
class Component extends createjs.Container {
  constructor(parent, x=0, y=0) {
    super();
    if (parent) {
      parent.addChild(this);
    }
    this.x = x;
    this.y = y;
  }
  /**
   * 创建label
   * @param {string} text 文本内容
   * @param {string} val 对齐方式 可选：mc.style.CENTER:mc.style.CENTER_LEFT
   */
  _createLabel(text, val) {
    let label = new createjs.Text();
    label.font = mc.style.fontSize + "px " + mc.style.fontName;
    label.color = mc.style.labelColor;
    switch (val) {
      case mc.style.CENTER_MIDDLE:
        label.textAlign = "center";
        label.textBaseline = "middle";
        break;
      case mc.style.LEFT_MIDDLE:
        label.textBaseline = "middle";
        break;
      case mc.style.CENTER_BOTTOM:
        label.textAlign = "center";
        label.textBaseline = "bottom";
        break;
      case mc.style.RIGHT_MIDDLE:
        label.textAlign = "right";
        label.textBaseline = "middle";
        break;
      case mc.style.CENTER_TOP:
        label.textAlign = "center";
        break;
      default:
        break;
    }
    label.text = text;
    this.addChild(label);
    return label;
  }
  _positionLabel() {
    //override
  }
  setSize(width, height) {
    this.shape.setSize(width, height);
    this._positionLabel();
  }
}
//pushButton类
class PushButton extends Component {
  /**
   * [pushButton类]
   * @param {[object]} parent  [option:父级容器]
   * @param {[string]} label  [option:按钮标签文本]
   * @param {[Function]} handler =null [option:点击事件]
   * @param {[number]} x =0 [option:x坐标]
   * @param {[number]} y =0 [option:y坐标]
   * @param {[number]} width =100 [长度]
   * @param {[number]} height =20 [高度]
   * @param {[Graphics]} GClass  图形类
   */
  constructor(parent, label, handler, x, y, width, height, GClass) {
    super(parent, x, y);
    //addChildren
    this.shape = new PushButtonShape(this, handler, width, height, GClass);
    this._label = this._createLabel(label, mc.style.CENTER_MIDDLE);
    this._positionLabel();
  }
  _positionLabel() {
    this._label.x = this.shape.width / 2;
    this._label.y = this.shape.height / 2;
  }
  get selected() {
    return this.shape.selected;
  }
  get toggle() {
    return this.shape.toggle;
  }
  set toggle(val) {
    this.shape.toggle = val;
  }
}
// checkBox类
class CheckBox extends Component {
  /**
   * [CheckBox类]
   * @param {[object]} parent  [option:父级容器]
   * @param {[string]} label  [option:按钮标签文本]
   * @param {[Function]} handler =null [option:点击事件]
   * @param {boolen} selected =false 是否选择状态
   * @param {[number]} x =0 [option:x坐标]
   * @param {[number]} y =0 [option:y坐标]
   * @param {number} width=15 [长度]
   * @param {[number]} height =15 [高度]
   * @param {Graphics} GClass  图形类
   */
  constructor(parent, label, handler, selected, x, y, width, height, GClass) {
    super(parent, x, y);
    //addChildren
    this.shape = new CheckBoxShape(this, handler, selected, width, height, GClass);
    this._label = this._createLabel(label, mc.style.LEFT_MIDDLE);
    this._positionLabel();
  }
  _positionLabel() {
    this._label.x = this.shape.width + 8;
    this._label.y = this.shape.height / 2 +1;
  }
  get selected() {
    return this.shape.selected;
  }
  set selected(val) {
    this.shape.selected = val;
  }
}
//单选框
class RadioButton extends CheckBox {
  /**
   * [RadioButton类]
   * handler中的this指向 undefinde
   * @param {[object]} parent  [option:父级容器]
   * @param {[string]} label  [option:按钮标签文本]
   * @param {[Function]} handler =null [option:点击事件]
   * @param {boolen} selected  是否选择状态
   * @param {[number]} x =0 [option:x坐标]
   * @param {[number]} y =0 [option:y坐标]
   * @param {[number]} width =15 [长度]
   * @param {[number]} height =15 [高度]
   * @param {Class} GClass  图形类
   */
  constructor(parent, label, handler, selected, x, y, width, height, GClass) {
    super(parent, label, () => {
      if (!this.selected) {
        this._clearAll();
        RadioButton.selectedButton = this;
        this.selected = true;
        if (handler) {
          handler(this);
        }
      }
    }, selected, x, y, width, height, GClass);
    //设置开关状态关闭
    this.shape.toggle = false;
    if (this.selected) {
      this._clearAll();
      RadioButton.selectedButton = this;
    }
    RadioButton.group.push(this);
  }

  _clearAll() {
    if (RadioButton.selectedButton) {
      RadioButton.selectedButton.selected = false;
    }
  }
}
RadioButton.selectedButton = null;
RadioButton.group = [];
//slider类
class Slider extends Component {
  /**
   * [pushButton类]
   * @param {[object]} parent  [option:父级容器]
   * @param {[string]} label  [option:按钮标签文本]
   * @param {[Function]} handler =null [option:点击事件]
   * @param {[number]} x =0 [option:x坐标]
   * @param {[number]} y =0 [option:y坐标]
   * @param {[number]} sliderWidth =120 [长度]
   * @param {[number]} sliderHeight =10 [高度]
   * @param {[Graphics]} GClass  图形类
   * @param {[boolean]} isVSlider  =true,方向
   */
  constructor(parent, label, handler, x, y, sliderWidth, sliderHeight, GClass, isVSlider) {
    super(parent, x, y);
    //addChildren
    this.shape = new SliderShape(this, handler, sliderWidth, sliderHeight, GClass, isVSlider);
    this._valueLabel = this.shape.valueLabel;
    if (this.shape._isVSlider) {
      this._label = this._createLabel(label, mc.style.CENTER_TOP);
      this._valueLabel.textAlign = "center";
      this._valueLabel.textBaseline = "bottom";
    } else {
      this._label = this._createLabel(label, mc.style.RIGHT_MIDDLE);
      this._valueLabel.textBaseline = "middle";
    }
    this._valueLabel.font = this._label.font;
    this._valueLabel.color = mc.style.labelColor;
    this.addChild(this._valueLabel);
    this._positionLabel();
  }
  _positionLabel() {
    if (this.shape._isVSlider) {
      this._label.x = this.shape.width / 2;
      this._label.y = this.shape.height+8;
      this._valueLabel.x = this.shape.width / 2;
      this._valueLabel.y=-8;
    } else {
      this._label.y = this.shape.height / 2+3 ;
      this._label.x=-8;
      this._valueLabel.x = this.shape.width+8;
      this._valueLabel.y = this.shape.height / 2+3;
    }
  }
  get value() {
    return this.shape.value;
  }
  set value(val) {
    this.shape.value = val;
  }
  setMmum(max, min) {
    this.shape.setMmum(max, min);
  }
  get continuous() {
    return this.shape.continuous;
  }
  set continuous(bool) {
    this.shape.continuous = bool;
  }
  get precision() {
    return this.shape.precision;
  }
  set precision(val) {
    this.shape.precision = val;
  }
}
//scrollbar类
class ScrollBar extends createjs.Container {
  /**
   * 滚动条
   * @param {object} parent 
   * @param {*} x =0
   * @param {*} y =0
   * @param {*} barWidth =150
   * @param {*} barHeight =15
   * @param {boolean} isVertical =false
   */
  constructor(parent, x = 0, y = 0, barWidth = 150, barHeight = 15, isVertical = false) {
    super();this.height
    if (parent) parent.addChild(this);
    this.x = x;
    this.y = y;
    this.isVertical = isVertical;
    this._contentLength = 0;
    this._value = 0;
    this.unitIncrement = 120;
    this.blockIncrement = 240;

    this.background = new createjs.Shape;
    this.addChild(this.background);
    this.background.on("mousedown", e => {
      const pos = this.isVertical ? e.localY : e.localX
      const handleHead = this.isVertical ? this.handle.y : this.handle.x
      const handleTail = this.isVertical ? this.handle.y + this.handle.height : this.handle.x + this.handle.width
      if (pos < handleHead) {
        this._changeValue(this.value + this.blockIncrement)
      } else if (pos > handleTail) {
        this._changeValue(this.value - this.blockIncrement)
      }
    })
    const rot = this.isVertical ? 0 : -90
    this.headArrow = new ArrowButtonShape(this, ()=> {
      this._changeValue(this.value + this.unitIncrement);
    }, barHeight, barHeight, rot);

    this.tailArrow = new ArrowButtonShape(this, () => {
      this._changeValue(this.value - this.unitIncrement);
    }, barHeight, barHeight, rot + 180);
    this.handle = new createjs.Shape();
    this.addChild(this.handle);
    this.handle.on("mousedown", e => {
      this.startPos = {
        x: e.stageX,
        y: e.stageY,
        value: this.value
      }
      this.handle.down = true;
      this._handleRedraw();
    })
    this.handle.on("pressmove", e => {
      const delta = this.isVertical ? this.startPos.y - e.stageY : this.startPos.x - e.stageX
      this._changeValue(this.startPos.value + this._positionToValue(delta))
    })
    this.handle.on('mouseover', e => {
      this.handle.over = true;
      this._handleRedraw();
    })
    this.handle.on('mouseout', e => {
      this.handle.over = false;
      this.handle.down = false;
      this._handleRedraw();
    })
    this.handle.on('pressup', e => {
      this.handle.down = false;
      this._handleRedraw();
    })
    this.setSize(barWidth, barHeight);
  }

  _changeValue(value) {
    const oldValue = this._value
    this.value = value
    if (oldValue != this.value) this.dispatchEvent("change")
  }

  get value() {
    return this._value
  }

  set value(value) {
    this._value = Math.floor(Math.max(Math.min(0, value), this.maxValue))
    this.redraw()
  }

  get contentLength() {
    return this._contentLength
  }

  set contentLength(length) {
    this._contentLength = length
    this.redraw()
  }

  redraw() {
    this.background.graphics
      .clear()
      .beginFill(mc.style.shadowColor)
      .rect(0, 0, this.width, this.height)
      .beginFill(mc.style.buttonOverColor)
      .rect(1, 1, this.width - 2, this.height - 2)
    this._drawArrows()
    this._drawHandle()
  }

  get maxValue() {
    return Math.min(-0.001, this._barWidth - this._contentLength)
  }

  _positionToValue(pos) {
    return pos * this._contentLength / (this._barWidth - 2 * this._barHeight)
  }

  _drawHandle() {
    function normalize(v) {
      return Math.max(0, Math.min(1, v))
    }
    const maxLength = this._barWidth - this._barHeight * 2
    const handleSize = [
      this._barHeight * 0.8,
      maxLength * normalize(this._barWidth / this._contentLength)
    ]
    
    const handlePos = [
      (this._barHeight - handleSize[0]) / 2,
      this._barHeight + maxLength * (1 - normalize(this._barWidth / this._contentLength)) * normalize(this.value / this.maxValue)
    ]
    const px = this.isVertical ? 0 : 1
    const py = this.isVertical ? 1 : 0
    this.handle.x = handlePos[px]
    this.handle.y = handlePos[py]
    this.handle.width = handleSize[px]
    this.handle.height = handleSize[py]
    this._handleRedraw();
  }
  _handleRedraw() {
    this.handle.graphics.clear();
    if (this.handle.down) {
      this.handle.graphics.beginFill(mc.style.highlightColor);
    } else if (this.handle.over) {
      this.handle.graphics.beginFill(mc.style.buttonUpColor);
    } else {
      this.handle.graphics.beginFill(mc.style.borderColor);
    }
    this.handle.graphics.drawRect(0, 0, this.handle.width, this.handle.height);
  }

  _drawArrows() {
    const size = this._barHeight
    const px = this.isVertical ? 0 : 1
    const py = this.isVertical ? 1 : 0

    const tailPos = [0, this._barWidth - size]
    this.tailArrow.x = tailPos[px]
    this.tailArrow.y = tailPos[py]

    this.headArrow.arrowWidth = size / 2
    this.headArrow.arrowHeight = size / 4
    this.tailArrow.arrowWidth = size / 2
    this.tailArrow.arrowHeight = size / 4
    this.headArrow.setSize(size, size);
    this.tailArrow.setSize(size, size)
  }
  setSize(barWidth, barHeight) {
    this._barWidth = barWidth;
    this._barHeight = barHeight;
    this.width = this.isVertical ? barHeight : barWidth;
    this.height = this.isVertical ? barWidth : barHeight;
    this.setBounds(0, 0, this.width, this.height);
    this.redraw();
  }
}
//ScrollContainer类
class ScrollContainer extends createjs.Container {
  /**
   * [constructor description]
   * @param {[string]} canvas [stage]
   */
  constructor(canvas,parent,x,y,width=400,height=400,containerWidth=0,containerHeight=0) {
    super();
    if (parent) parent.addChild(this);
    this.x=x;
    this.y=y;

    this.container = new createjs.Container();
    this.container.setBounds(0,0,containerWidth,containerHeight);
    this.addChild(this.container)

    this.scrollBarV = new ScrollBar(this,0,0,0,mc.style.SCROLL_BAR_SIZE,true);

    this.scrollBarH = new ScrollBar(this,0,0,0,mc.style.SCROLL_BAR_SIZE);

    this.scrollBarV.on("change", e => {
      this.container.y = e.target.value
      this.dispatchEvent("scroll")
    })

    this.scrollBarH.on("change", e => {
      this.container.x = e.target.value
      this.dispatchEvent("scroll")
    })

    canvas.addEventListener("mousewheel", e => {
      const h = this.contentSize.height - this.getBounds().height
      const w = this.contentSize.width - this.getBounds().width
      this.scrollY += e.wheelDeltaY
      this.scrollX += e.wheelDeltaX
    })

    this.superAddChild = this.addChild

    this.addChild = child => {
      this.container.addChild(child)
    }
    this.setSize(width,height);
  }

  get scrollX() {
    return this.container.x
  }

  set scrollX(x) {
    const w = this.contentSize.width - this.getBounds().width
    this.container.x = Math.min(0, Math.floor(Math.max(x, -w - mc.style.SCROLL_BAR_SIZE)))
    this.scrollBarH.value = x
    this.dispatchEvent("scroll")
  }

  get scrollY() {
    return this.container.y
  }

  set scrollY(y) {
    const h = this.contentSize.height - this.getBounds().height
    this.container.y = Math.min(0, Math.max(y, -h - mc.style.SCROLL_BAR_SIZE))
    this.scrollBarV.value = y
    this.dispatchEvent("scroll")
  }

  get contentSize() {
    return {
      width: this.container.getBounds().width,
      height: this.container.getBounds().height
    };
  }
  set contentSize(size) {
    this.container.setBounds(0, 0, size.width, size.height)
    this.scrollBarH.contentLength = size.width
    this.scrollBarV.contentLength = size.height
    if (size.width<=this.getBounds().width-mc.style.SCROLL_BAR_SIZE) {
      this.scrollBarH.visible=false;
    }else{
      this.scrollBarH.visible=true;
    }
    if (size.height<=this.getBounds().height-mc.style.SCROLL_BAR_SIZE) {
      this.scrollBarV.visible=false;
    }else{
      this.scrollBarV.visible=true;
    }
  }

  setSize(width,height){
    this.setBounds(0,0,width,height);
    this.contentSize={
      width: Math.max(width-mc.style.SCROLL_BAR_SIZE,this.container.getBounds().width),
      height: Math.max(height-mc.style.SCROLL_BAR_SIZE, this.container.getBounds().height)
    };
    
    this.container.mask = new createjs.Shape;
    this.container.mask.graphics.beginFill("#efefef").rect(0, 0, width, height);
    this.scrollBarV.x = width - mc.style.SCROLL_BAR_SIZE;
    this.scrollBarV.setSize(height-mc.style.SCROLL_BAR_SIZE,mc.style.SCROLL_BAR_SIZE);
    this.scrollBarH.y=height-mc.style.SCROLL_BAR_SIZE;
    this.scrollBarH.setSize(width-mc.style.SCROLL_BAR_SIZE,mc.style.SCROLL_BAR_SIZE);
  }
}