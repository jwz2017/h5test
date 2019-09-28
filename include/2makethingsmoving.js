var stageScale = 1,
    lib, model;
const SCORE = "score",
    LEVEL = "level",
    LIVES = "lives",
    PAUSE = "pause";
window.onload = function () {
    "use strict";
    /*************初始化 整个游戏入口,开启fps需要加第二个参数 'fps' fps是与dom*****/
    new Main('canvas', 'fps');
    //添加代码

}
class Main extends GFrame {
    constructor(canvasId, fpsid) {
        super(canvasId, fpsid);
        /*********接收animate影片剪辑播放过程发出的事件。***/
        model = new createjs.EventDispatcher();

        /*********自适应*********** */
        this.adapt();

        /*********预加载手动********** */
        // this.preload([{
        //     id: "butterfly",
        //     src: "assets/butterfly.png"
        // }]);

        /*********animate加载******* ---------------------------------------1*/
        let comp = AdobeAn.getComposition("A81D833FE7C7754FB5395FF7A6EFA6E1");
        lib = comp.getLibrary();
        this.preload(lib.properties.manifest, comp);

        /*********不加载，直接初始化*************** */
        // this.init();
    }
    adapt() {
        let stageWidth = document.documentElement.clientWidth,
            stageHeight = document.documentElement.clientHeight,
            width = stage.canvas.width,
            height = stage.canvas.height;
        //高度自适应
        let gameDiv = document.getElementById("game");
        stageScale = stageHeight / height;
        gameDiv.style.left = (stageWidth - width * stageScale) / 2 + 'px';

        //宽带自适应
        // stageScale = stageWidth /width;

        stage.canvas.style.width = width * stageScale + 'px';
    }

    initScreen() {
        let width = stage.canvas.width,
            height = stage.canvas.height;

        mc.style.fontSize = 30; //按钮label字体大小

        this.titleScreen = new BasicScreen();
        this.titleScreen.createDisplayText('开始界面', width / 2, 200);
        this.titleScreen.createOkButton((width - 200) / 2, height / 2 + 100, 'start', 200, 40);
        // this.titleScreen=new lib.Title();//协作animate使用-------------------1

        this.instructionScreen = new BasicScreen();
        this.instructionScreen.createDisplayText('介绍界面', width / 2, 200);
        this.instructionScreen.createOkButton((width - 200) / 2, height / 2 + 100, 'ok', 200, 40);

        this.levelInScreen = new BasicScreen();
        this.levelInScreen.createDisplayText('level:0', (width) / 2, height / 2, LEVEL);

        this.gameOverScreen = new BasicScreen();
        this.gameOverScreen.createDisplayText('结束界面', width / 2, 200);
        this.gameOverScreen.createOkButton((width - 200) / 2, height / 2 + 100, 'gameover', 200, 40);

        GFrame.style.SCORE_BUFF = 200; //分数版元素间隔大小

        this.scoreBoard = new ScoreBoard();
        this.scoreBoard.y = height - GFrame.style.SCOREBOARD_HEIGHT;
        this.scoreBoard.creatTextElement(SCORE, new SideBysideScore(SCORE, '0'));
        this.scoreBoard.creatTextElement(LEVEL, new SideBysideScore(LEVEL, '0'));
        this.scoreBoard.creatTextElement(LIVES, new SideBysideScore(LIVES, '0'));
        this.scoreBoard.creatTextElement(PAUSE, new SideBysideScore(PAUSE, 'press space to pause'), 200, 30);
        this.scoreBoard.createBG(width, GFrame.style.SCOREBOARD_HEIGHT, '#333');
        // this.scoreBoard.flicker([PAUSE]);//闪烁分数版元素
        this.game = new MyGame();
    }
}
(function () {
    "use strict";
    //程序变量
    let level = 0,
        lives = 5,
        score = 0;
    //游戏变量;
    let arrow = new Ship(20,"#ff0000"),
    ball=new Ball(),
    line = new createjs.Shape(),
    textFiled = new createjs.Text("qq","bold 36px Arial"),
    xpos = 0,
    ypos,
    speed = 5,
    ax = 0,
    ay = 0,
    vx = 0,
    vy = 0,
    vr = 0.05,
    thrust = 0,
    bounce = -0.7,
    gravity = 0.3,
    oldX,
    oldY,
    cos1 = Math.cos(vr),
    sin1 = Math.sin(vr),
    mat = new createjs.Matrix2D().rotate(vr * 180 / Math.PI),
  // var mat=new createjs.Matrix2D().rotate(45).translate(20,0);//先translate再rotate.可以反过来
    // var mat=new createjs.Matrix2D().translate(20,0).rotate(45);//先rotate再translate.可以反过来
    angle = 0;

    class MyGame extends Game {
        constructor() {
            super();
        }
        /**建立游戏元素
         * 在构造函数里建立
         */
        buildElement() {

        }
        newGame() {
            score = 0;
            level = 0;
            lives = 5;
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, SCORE, score));
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, LIVES, lives));

        }
        newLevel() {
            level++;
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.SCOREBOARD_UPDATE, LEVEL, level));
            stage.dispatchEvent(new GFrame.event.DATA_UPDATE(GFrame.event.LEVELIN_UPDATE, LEVEL, LEVEL + ' : ' + level));

        }
        /**levelinscreen等待结束时执行
         * 
         */
        waitComplete() {
            this.onkey();
            
      stage.addChild(textFiled,arrow,ball);
      ball.x=ball.y=200;
      textFiled.x = textFiled.y = 400;
      // arrow.filters=[new createjs.ColorFilter(0,0,0,1,0,0,255,0)];////颜色滤镜,需要开启下一行
      // arrow.cache(-18,-18,36,36);
      // arrow.shadow = new createjs.Shadow("#000000", 1, 1, 10); //阴影设置
      arrow.vx = Math.random() * 10 - 5; //斜面返弹要注释
      arrow.vy = -10;
      arrow.addEventListener('mousedown', () => {
        oldX = arrow.x;
        oldY = arrow.y;
        createjs.Ticker.paused = true;
      });
      arrow.addEventListener('pressmove', () => {

        arrow.x = stage.mouseX;
        arrow.y = stage.mouseY;
        arrow.vx = arrow.x - oldX;
        arrow.vy = arrow.y - oldY;
        oldX = arrow.x;
        oldY = arrow.y;

      });
      arrow.addEventListener('pressup', () => {
        createjs.Ticker.paused = false;
      });
      arrow.x = arrow.y = 350;
      line.graphics.setStrokeStyle(1).beginStroke('#000000').moveTo(0, 0).lineTo(300, 0);
      stage.addChild(line);
      line.x = 50;
      line.y = 200;
      line.rotation = 10;
      
      //测试
      // GraphicsUtils.drawLine(arrow.graphics,{x:0,y:0},{x:400,y:400},10,0)
      // GraphicsUtils.drawSector(arrow.graphics,0,0,100,30,90,300)
      // GraphicsUtils.drawRing(arrow.graphics.beginFill("#ff0000"),400,400,100,100,0,360,0.5)
      // GraphicsUtils.drawCurve(arrow.graphics,0,0,100,70,-30,60)
      // arrow.graphics.endStroke().setStrokeStyle(1).beginStroke("#000000")
      // arrow.graphics.arc(100,100,100,0,60*Math.PI/180,false)
      // FPS.startFPS(stage);
      // let a = new baseb

        }
        runGame() {
            // this._rotation();//计算角度(rotation);
    //   this._sin();//正玄运动；
    //   this._wavel();//线性运动
    //   this._pulse();//心跳效果
    //   this._wavel2();//绘制波形
    //   this._circle();//圆形运动以及椭圆运动
    //   this._circle2(); //圆形运动坐标旋转
      // this._circle3();//矩阵圆形运动
    //   this._matrixrotation();//矩阵操作rotation
    //   this._mouseDistance();//鼠标距离
      // this._followMouse();//鼠标跟随运动
    //   this._acceleration();//加速运动
    //   this._shipSim();//飞船控制
      // this._throwing();//投掷运动
      // this._anglebounce3();//斜面返弹公式版
      // this._anglebounce();//斜面返弹矩阵版
      // this._anglebounce3();
        }
        onkey(){
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
        _rotation() {
            let dx = stage.mouseX - arrow.x,
              dy = stage.mouseY - arrow.y,
              radians = Math.atan2(dy, dx);
            arrow.rotation = radians * 180 / Math.PI;
          }
          _matrix() {
      
          }
          _sin() {
            arrow.y = 200 + Math.sin(angle) * 50;
            angle += 0.1;
          }
          _wavel() {
            arrow.x += 1;
            this._sin();
          }
          _pulse() {
            arrow.scaleX = arrow.scaleY = 1 + Math.sin(angle) * 0.5;
            angle += 0.1;
          }
          _wavel2() {
            xpos += 1;
            angle += 0.05;
            ypos = 100 + Math.sin(angle) * 50;
            arrow.graphics.lineTo(xpos, ypos);
          }
          _circle() {
            arrow.x = 200 + Math.cos(angle) * 200; //100为圆形运动
            arrow.y = 200 + Math.sin(angle) * 100;
            angle += vr;
            arrow.rotation = angle * 180 / Math.PI + 90;
          }
          _circle2() {
            let x1 = arrow.x - 200,
              y1 = arrow.y - 200,
              x2 = cos1 * x1 - sin1 * y1,
              y2 = cos1 * y1 + sin1 * x1;
            arrow.x = x2 + 200;
            arrow.y = y2 + 200;
          }
          _circle3() {
            let x1 = arrow.x - 200,
              y1 = arrow.y - 200;
            const p = mat.transformPoint(x1, y1);
            arrow.x = p.x + 200;
            arrow.y = p.y + 200;
          }
          _matrixrotation() {
            angle += vr;
            let cos = Math.cos(angle),
              sin = Math.sin(angle);
            arrow.transformMatrix = new createjs.Matrix2D(cos, sin, -sin, cos, 400, 400);
            console.log(arrow.rotation);
      
          }
          _mouseDistance() {
            let pt = arrow.globalToLocal(stage.mouseX, stage.mouseY); //转换为本地坐标
            arrow.graphics.clear();
            arrow._redraw();
            arrow.graphics.moveTo(0, 0).lineTo(pt.x, pt.y);
            let dist = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
            textFiled.text = dist.toString();
      
          }
          _followMouse() {
            let dx = stage.mouseX - arrow.x,
              dy = stage.mouseY - arrow.y;
            angle = Math.atan2(dy, dx);
            arrow.rotation = angle * 180 / Math.PI;
            let vx = Math.cos(angle) * speed,
              vy = Math.sin(angle) * speed;
            arrow.x += vx;
            arrow.y += vy;
          }
          _acceleration() {
            if (this.leftKeyDown) {
              ax -= 0.002;
            } else if (this.rightKeyDown) {
              ax += 0.002;
            } else {
              ax = 0;
            }
            if (this.upKeyDown) {
              ay -= 0.002;
            } else if (this.downKeyDown) {
              ay += 0.002;
            } else {
              ay = 0;
            }
            if (this.leftKeyDown || this.rightKeyDown || this.upKeyDown || this.downKeyDown) {
              arrow.showFlame = true;
            } else {
              if (arrow.showFlame) {
                arrow.showFlame = false;
              }
            }
            vx += ax;
            vy += ay;
            angle = Math.atan2(vy, vx) * 180 / Math.PI;
            arrow.rotation = angle;
            arrow.x += vx;
            arrow.y += vy;
          }
          _shipSim() {
            if (this.leftKeyDown) {
              vr = -5;
            } else if (this.rightKeyDown) {
              vr = 5;
            } else if (this.upKeyDown) {
              thrust = 0.1;
              arrow.showFlame = true;
            } else {
              vr = 0;
              thrust = 0;
              if (arrow.showFlame) {
                arrow.showFlame = false;
              }
            }
            arrow.rotation += vr;
            angle = arrow.rotation * Math.PI / 180;
            ax = Math.cos(angle) * thrust;
            ay = Math.sin(angle) * thrust;
            vx += ax;
            vy += ay;
            arrow.x += vx;
            arrow.y += vy;
          }
          _throwing() {
            arrow.vy += gravity;
            arrow.x += arrow.vx;
            arrow.y += arrow.vy;
            utils.checkBounds(0, 50, canvas.width, canvas.height, arrow, bounce);
          }
          _anglebounce() {
            line.rotation = (canvas.width / 2 - stage.mouseX) * 0.1;
            //普通运动
            ball.vy += gravity;
            ball.x += ball.vx;
            ball.y += ball.vy;
            // utils.checkBounds(0, 0, canvas.width, canvas.height, ball, bounce);
            //获得ball与line的相对位置
            this.mat1 = new createjs.Matrix2D().rotate(-line.rotation); //旋转矩阵
            this.mat2 = new createjs.Matrix2D().rotate(line.rotation); //反旋转矩阵
            let x1 = ball.x - line.x,
              y1 = ball.y - line.y;
            if (x1 > 0 && x1 < 300 * Math.cos(line.rotation * Math.PI / 180)) {
              //旋转坐标
              let p = this.mat1.transformPoint(x1, y1);
              //实现返弹
              if (p.y > -ball.radius) {
                p.y = -ball.radius;
                //旋转向量
                let v = this.mat1.transformPoint(ball.vx, ball.vy);
                v.y *= bounce;
                //将一切旋转回去
                p = this.mat2.transformPoint(p.x, p.y),
                  v = this.mat2.transformPoint(v.x, v.y);
                ball.vx = v.x;
                ball.vy = v.y;
                ball.x = line.x + p.x;
                ball.y = line.y + p.y;
              }
            }
          }
          _anglebounce2() {
            //普通运动
            arrow.vy += gravity;
            arrow.x += arrow.vx;
            arrow.y += arrow.vy;
            utils.checkBounds(0, 0, canvas.width, canvas.height, arrow, bounce);
            //获得ball与line的相对位置
            line.rotation = (canvas.width / 2 - stage.mouseX) * 0.1;
            angle = line.rotation * Math.PI / 180;
            this.cos = Math.cos(angle);
            this.sin = Math.sin(angle);
            let x1 = arrow.x - line.x,
              y1 = arrow.y - line.y;
            // if (x1>0&&x1<300*this.cos) {
            //旋转坐标
            let p = utils.rotateP1(x1, y1, this.cos, this.sin);
            let v = utils.rotateP1(arrow.vx, arrow.vy, this.cos, this.sin);
            //实现返弹
            if (p.y > -arrow.radius && p.y < v.y) {
              p.y = -arrow.radius;
              //旋转向量
              // let v=utils.rotateP1(arrow.vx,arrow.vy,this.cos,this.sin);
              v.y *= bounce;
              //将一切旋转回去
              p = utils.rotateP2(p.x, p.y, this.cos, this.sin);
              v = utils.rotateP2(v.x, v.y, this.cos, this.sin);
              arrow.vx = v.x;
              arrow.vy = v.y;
              arrow.x = line.x + p.x;
              arrow.y = line.y + p.y;
            }
            // }
          }
          _anglebounce3() {
            //普通运动
            arrow.vy += gravity;
            arrow.x += arrow.vx;
            arrow.y += arrow.vy;
            utils.checkBounds(0, 0, canvas.width, canvas.height, arrow, bounce);
            //获得ball与line的相对位置
            line.rotation = (canvas.width / 2 - stage.mouseX) * 0.1;
            angle = line.rotation * Math.PI / 180;
            this.cos = Math.cos(angle);
            this.sin = Math.sin(angle);
            let x1 = arrow.x - line.x,
              y1 = arrow.y - line.y;
            let y2 = this.cos * y1 - this.sin * x1,
              vy1 = this.cos * arrow.vy - this.sin * arrow.vx;
            //实现返弹
      
      
            if (y2 > -arrow.radius && y2 < vy1) {
      
      
              //旋转向量
              let x2 = this.cos * x1 + this.sin * y1,
                vx1 = this.cos * arrow.vx + this.sin * arrow.vy;
              y2 = -arrow.radius;
              vy1 *= bounce;
              //将一切旋转回去
              x1 = this.cos * x2 - this.sin * y2;
              y1 = this.cos * y2 + this.sin * x2;
              arrow.vx = this.cos * vx1 - this.sin * vy1;
              arrow.vy = this.cos * vy1 + this.sin * vx1;
              arrow.x = line.x + x1;
              arrow.y = line.y + y1;
            }
          }
      
    }
    window.MyGame = MyGame;
})();