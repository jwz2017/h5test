(function () {
    "use strict";
    //游戏变量;定义。。构造内初始化，new game初始化
    var score, level;
    let ship,ship2,shape,ball,line,gravity=0.3;
    class MakeThingsMove extends Game {
        constructor() {
            super();
            this.titleScreen.setText("makethingsmove");
        }
        /**建立游戏元素游戏初始化
         * 在构造函数内建立
         */
        buildElement() {
            this.onkey()
            ship=new Ship(10,"#ff0000");
            ship.x=ship.y=300;
            ship.vx=ship.vy=0;

            ship2=new Ship(6,"#00ff00");
            ship2.vr=0.05;
            ship2.angle=0;
            ship2.x=100;
            ship2.y=500;
            ship2.cos=Math.cos(ship2.vr);
            ship2.sin=Math.sin(ship2.vr);
            //.translate(20,0).平移
            ship2.mat=new createjs.Matrix2D().rotate(ship2.vr*180/Math.PI);

            shape=new createjs.Shape();
            shape.angle = shape.xpos = shape.ypos = 0;
            shape.graphics.beginStroke("#ff0000").moveTo(0, 100);

            ball=new Ball();
            ball.x=ball.y=100;
            //球拖拽
            ball.addEventListener('mousedown', () => {
                ball.oldX = ball.x;
                ball.oldY = ball.y;
                createjs.Ticker.paused = true; //停止以前的运动
            });
            ball.addEventListener('pressmove', () => {
                ball.x = stage.mouseX;
                ball.y = stage.mouseY;
                ball.vx = ball.x - ball.oldX;
                ball.vy = ball.y - ball.oldY;
                ball.oldX = ball.x;
                ball.oldY = ball.y;
            });
            ball.addEventListener('pressup', () => {
                createjs.Ticker.paused = false; //恢复以前运动
            })

            line=new createjs.Shape();
            line.x = 50;
            line.y = 200;
            line.graphics.beginStroke('#000000').moveTo(0, 0).lineTo(300, 0);
            line.rotation = 10;

        }
        newGame() {
            score = 0;
            this.updateScoreBoard(SCORE, score);
            level = 0;
        }
        newLevel() {
            level++;
            this.updateScoreBoard(LEVEL, level);
            this.updateLevelInScreen(level);
        }
        waitComplete() {
            stage.addChild(ship, ball, shape, ship2, line);

            //滤镜(需要开启cache)
            // ship.filters=[new createjs.ColorFilter(0,0,0,1,0,0,255,0)];
            // ship.cache(-18,-18,36,36);

            //阴影
            // ship.shadow=new createjs.Shadow("#000000",1,1,10);
        }
        runGame() {
            // this.rotation(); //计算角度  鼠标跟随
            this.shipControl() //飞船控制

            // this.sin(); //正弦运动
            // this.throwing();//拖拽运动
            // this.angleBounce(); //斜面反弹公式版(高)
            // this.angleBounce2();//斜面反弹utils
            this.angleBounce3();//斜面反弹矩阵版

            this.wavel(); //绘制波形

            // this.circle(); //圆形运动以及椭圆运动
            // this.circle2();//圆形运动坐标旋转版本
            this.circle3(); //圆形运动矩阵版本
            // this.matrixrotation();//矩阵操控对象
        }
        rotation() {
            //计算角度
            let dx = stage.mouseX - ship.x,
                dy = stage.mouseY - ship.y,
                angle = Math.atan2(dy, dx);
            ship.rotation = angle * 180 / Math.PI;
            //计算速度
            let vx = Math.cos(angle) * 5,
                vy = Math.sin(angle) * 5;
            ship.x += vx;
            ship.y += vy;
        }
        sin() {
            let r = Math.sin(ball.angle);
            ball.y = 200 + r * 50;
            ball.scaleX = ball.scaleY = 1 + r * 0.5; //心型
            ball.angle += 0.1;
            ball.x += 1;

        }
        wavel() {
            shape.xpos += 1;
            shape.angle += 0.05;
            shape.ypos = 100 + Math.sin(shape.angle) * 50;
            shape.graphics.lineTo(shape.xpos, shape.ypos);
        }
        circle() { //100 400为圆形运动
            ship2.x = 100 + Math.cos(ship2.angle) * 100;
            ship2.y = 400 + Math.sin(ship2.angle) * 50;
            ship2.angle += ship2.vr;
            ship2.rotation = ship2.angle * 180 / Math.PI + 90;
        }
        circle2() {
            let x1 = ship2.x - 100,
                y1 = ship2.y - 400,
                p = utils.rotateP2(x1, y1, ship2.cos, ship2.sin);
            ship2.x = p.x + 100;
            ship2.y = p.y + 400;
            ship2.angle += ship2.vr; //（逆 -=    去180下）
            ship2.rotation = ship2.angle * 180 / Math.PI + 180;
        }
        circle3() {
            let x1 = ship2.x - 100,
                y1 = ship2.y - 400,
                p = ship2.mat.transformPoint(x1, y1);
            ship2.x = p.x + 100;
            ship2.y = p.y + 400;
            ship2.angle += ship2.vr; //（逆 -=    去180下）
            ship2.rotation = ship2.angle * 180 / Math.PI + 180;
        }
        matrixrotation() {
            ship2.angle += ship2.vr;
            let cos = Math.cos(ship2.angle),
                sin = Math.sin(ship2.angle);
            ship2.transformMatrix = new createjs.Matrix2D(cos, sin, -sin, cos, 100, 400);
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
        throwing() {
            ball.vy += gravity;
            ball.x += ball.vx;
            ball.y += ball.vy;
            utils.checkBounds(ball);
        }
        angleBounce() {
            line.rotation = (canvas.width / 2 - stage.mouseX) * 0.1;
            //普通运动
            ball.vy += gravity;
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
        angleBounce2() {
            line.rotation = (canvas.width / 2 - stage.mouseX) * 0.1;
            //普通运动
            ball.vy += gravity;
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
                p=utils.rotateP1(x1,y1,cos,sin),
                v=utils.rotateP1(ball.vx,ball.vy,cos,sin);

            //实现反弹
            if (p.y > -ball.radius && p.y < v.y) {
                p.y = -ball.radius;
                v.y *= -0.7;
                //将一切旋转回去
                p=utils.rotateP2(p.x,p.y,cos,sin);
                v=utils.rotateP2(v.x,v.y,cos,sin);
                ball.vx = v.x;
                ball.vy = v.y;
                ball.x = line.x + p.x;
                ball.y = line.y + p.y;
            }
        }
        angleBounce3() {
            line.rotation = (canvas.width / 2 - stage.mouseX) * 0.1;
            //普通运动
            ball.vy += gravity;
            ball.x += ball.vx;
            ball.y += ball.vy;
            utils.checkBounds(ball);
            //定义矩阵
            let mat1=new createjs.Matrix2D().rotate(-line.rotation);
            //获得ball与line的相对位置
            let x1 = ball.x - line.x,
                y1 = ball.y - line.y,
                //旋转y,vy
                p=mat1.transformPoint(x1,y1),
                v=mat1.transformPoint(ball.vx,ball.vy);

            //实现反弹
            if (p.y > -ball.radius && p.y < v.y) {
                p.y = -ball.radius;
                v.y *= -0.7;
                //将一切旋转回去
                let mat2=new createjs.Matrix2D().rotate(line.rotation);
                p=mat2.transformPoint(p.x,p.y);
                v=mat2.transformPoint(v.x,v.y);
                ball.vx = v.x;
                ball.vy = v.y;
                ball.x = line.x + p.x;
                ball.y = line.y + p.y;
            }
        }
        clear() {
            super.clear();

        }

    }
    MakeThingsMove.loaded=false;
    MakeThingsMove.loadItem=null;
    window.MakeThingsMove = MakeThingsMove;
})();