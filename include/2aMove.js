/**目录
 * 1:滤镜,阴影                        72
 * 2:旋转,鼠标跟随                     107
 * 3:波形运动                          112
 * 4:双角波形（圆形或椭圆）
 * 5:飞船控制，加速度
 * 6:弹簧链
 * 7:坐标旋转（角度反弹）
 * 
 * 
 * vx = dx * easing;         缓动
 * vx+=ax;                加速运动
 * this.graphics.beginRadialGradientFill(this.color,[0,1],7,-8,0,0,0,this.radius)  渐变
 * 
 * 
 * 
 * x: cos * xpos + sin * ypos,     逆时针旋转
*  y: cos * ypos - sin * xpos
 * 
 * x: cos * xpos - sin * ypos,      顺时针旋转
 * y: cos * ypos + sin * xpos
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
(function () {
    "use strict";
    var arrow, shape, random, ship, balls=[], chainShape,line,ball;
    class Move extends Game {
        constructor() {
            super();
            this.titleScreen.setText("运动测试");
        }
        /**建立游戏元素游戏初始化
         * 在构造函数内建立
         */
        buildElement() {
            this.onkey()
            arrow = new PushButtonShape(null, null, 60, 40, new Arrow);
            arrow.regX = 30;
            arrow.regY = 20;
            arrow.x = 350;
            arrow.y = 1100;

            shape = new createjs.Shape();
            shape.xpos = 0;
            shape.angle = 0;
            shape.graphics.setStrokeStyle(2).beginStroke("#000000").moveTo(0, 1000);

            random = new Ball("#ffffff", 6);
            random.centerX = stage.canvas.width / 2;
            random.centerY = stage.canvas.height / 2;
            random.angleX = 0;
            random.angleY = 0;
            //滤镜（需要开启cache）
            random.filters = [new createjs.ColorFilter(0, 0, 0, 1, 0, 0, 255, 0)]
            random.cache(-3, -3, 6, 6);
            //阴影
            random.shadow = new createjs.Shadow("#000000", 1, 1, 10);

            ship = new Ship(10, "#ff0000");
            ship.x = stage.canvas.width / 2;
            ship.y = stage.canvas.height / 2;
            ship.vx = ship.vy = 0;

            line=new createjs.Shape();
            line.x = 100;
            line.y = 200;
            line.graphics.beginStroke('#000000').moveTo(0, 0).lineTo(300, 0);
            line.rotation = 10;

            ball=new Ball();
            ball.x=ball.y=100;

        }
        waitComplete() {
            chainShape = new createjs.Shape();
            stage.addChild(chainShape);
            for (let i = 0; i < 7; i++) {
                const ball = new Ball(["#fff","#00f"]);
                ball.vx = ball.vy = 0;
                stage.addChild(ball);
                balls.push(ball);
            }

            stage.addChild(arrow, shape, random, ship,line,ball);
        }
        runGame() {
            /**
             * *******************旋转**************************************
             */
            this.rotation();

            /**
             * *******************波形运动***********************************
             * 可用scalex,scaley缩放
             */
            this.wavel();

            /**
             * *******************双角波形*************************************
             * 椭圆或圆形运动
             */
            this.random();

            /**
             * *********************飞船控制***********************************
             */
            this.shipControl();

            /**
             * ************************弹簧链*********************************
             */
            this.chain();

            /**
             * **********************坐标旋转***********************************
             */
            this.angleBounce();
        }

        rotation() {
            //旋转
            let dx = stage.mouseX - arrow.x,
                dy = stage.mouseY - arrow.y,
                angle = Math.atan2(dy, dx);
            arrow.rotation = angle * 180 / Math.PI;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist >= 4) {
                //鼠标跟随
                let vx = Math.cos(angle) * 4,
                    vy = Math.sin(angle) * 4;
                arrow.x += vx;
                arrow.y += vy;
            }
        }
        wavel() {
            shape.xpos += 1;
            shape.angle += 0.05;
            shape.ypos = 1000 + Math.sin(shape.angle) * 50;
            shape.graphics.lineTo(shape.xpos, shape.ypos);
        }
        random() {
            random.x = random.centerX + Math.sin(random.angleX) * 50;
            random.y = random.centerY + Math.sin(random.angleY) * 50;
            random.angleX += 0.07;
            random.angleY += 0.11;
        }
        shipControl() {
            if (this.leftKeyDown) {
                ship.vr = -5;
            } else if (this.rightKeyDown) {
                ship.vr = 5;
            } else if (this.upKeyDown) {
                ship.thrust = 0.1;
                ship.showFlame = true;
            } else {
                ship.vr = 0;
                ship.thrust = 0;
                if (ship.showFlame) ship.showFlame = false;
            }
            ship.rotation += ship.vr;
            let angle = ship.rotation * Math.PI / 180,
                ax = Math.cos(angle) * ship.thrust,
                ay = Math.sin(angle) * ship.thrust;
            ship.vx += ax;
            ship.vy += ay;
            ship.x += ship.vx;
            ship.y += ship.vy;
        }
        chain() {
            chainShape.graphics.clear();
            chainShape.graphics.setStrokeStyle(2).beginStroke("#000000").moveTo(stage.mouseX, stage.mouseY);
            this._moveBall(balls[0], stage.mouseX, stage.mouseY);
            chainShape.graphics.lineTo(balls[0].x, balls[0].y);
            for (let i = 1; i < balls.length; i++) {
                const ballA = balls[i - 1],
                    ballB = balls[i];
                this._moveBall(ballB, ballA.x, ballA.y);
                chainShape.graphics.lineTo(ballB.x, ballB.y);
            }
        }
        _moveBall(ball, targetX, targetY) {
            ball.vx += (targetX - ball.x) * 0.1;//缓动系数
            ball.vy += (targetY - ball.y) * 0.1;
            ball.vy += 7;//重力
            ball.vx *= 0.8;//摩檫力
            ball.vy *= 0.8;
            ball.x += ball.vx;
            ball.y += ball.vy;
        }
        angleBounce() {
            line.rotation = (canvas.width / 2 - stage.mouseX) * 0.1;
            //普通运动
            ball.vy += 0.3;//重力
            ball.x += ball.vx;
            ball.y += ball.vy;
            utils.checkBounds(ball);
            //获得ball与line的相对位置
            let angle = line.rotation * Math.PI / 180,
                cos = Math.cos(angle),
                sin = Math.sin(angle),
                x1 = ball.x - line.x,
                y1 = ball.y - line.y,
                //旋转y,vy
                y2 = cos * y1 - sin * x1,
                vy2 = cos * ball.vy - sin * ball.vx;

            //实现反弹
            if (y2 > -ball.radius && y2 < vy2) {
                y2 = -ball.radius;
                vy2 *= -0.7;
                //旋转x,vx
                let x2 = cos * x1 + sin * y1,
                    vx2 = cos * ball.vx + sin * ball.vy;
                //将一切旋转回去
                x1 = cos * x2 - sin * y2;
                y1 = cos * y2 + sin * x2;
                ball.vx = cos * vx2 - sin * vy2;
                ball.vy = cos * vy2 + sin * vx2;
                ball.x = line.x + x1;
                ball.y = line.y + y1;
            }
        }

    }
    Move.loadItem = null;
    window.Move = Move;
})();

class Ball extends createjs.Shape {
    /**
     * @param {[string]} color #ff0000
     * @param {[number]} radius 15
     */
    constructor(color = "#ff0000", radius = 15) {
        super();
        this.color = color;
        this.cursor = "pointer";
        this.radius = radius;
        this.vx = this.vy = 0;
        this._redraw();
        this.setBounds(-this.radius - mc.style.strokeStyle, -this.radius - mc.style.strokeStyle, 2 * this.radius + 2 * mc.style.strokeStyle, 2 * this.radius + 2 * mc.style.strokeStyle);
    }
    _redraw() {
        this.graphics.clear();
        this.graphics.setStrokeStyle(1).beginStroke('#ffffff')
        if (typeof(this.color)=="string") {
            this.graphics.beginFill(this.color);
        }else{//渐变
            this.graphics.beginRadialGradientFill(this.color,[0,1],7,-8,0,0,0,this.radius)
        }
        this.graphics.drawCircle(0, 0, this.radius);
            
    }
    
}
//飞船
class Ship extends createjs.Shape {
    /**
     *飞船
     * @param {[number]} radius 10
     * @param {[string]} color "#000000"
     */
    constructor(radius, color) {
        super();
        this.radius = radius || 10;
        this.color = color || mc.style.borderColor;
        this._showFlame = false;
        this._redraw();
    }

    _redraw() {
        this.graphics.clear();
        this.graphics.setStrokeStyle(1).beginStroke(this.color).moveTo(this.radius, 0)
            .lineTo(-this.radius, this.radius).lineTo(-this.radius / 2, 0).lineTo(-this.radius, -this.radius)
            .lineTo(this.radius, 0);
        if (this._showFlame) {
            this.graphics.moveTo(-this.radius * 0.75, -this.radius / 2)
                .lineTo(-this.radius * 1.5, 0)
                .lineTo(-this.radius * 0.75, this.radius / 2);
        }
    }
    
    get showFlame() {
        return this._showFlame;
    }
    /**
     * 设置尾巴
     * val:boolen
     */
    set showFlame(val) {
        this._showFlame = val;
        this._redraw();
    }
}