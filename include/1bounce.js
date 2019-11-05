// window.onload = function () {
//     "use strict";
//     /*************初始化 整个游戏入口*****/
//     var g = new GFrame('canvas');
//     /**********自适应************* */
//     g.adapt();
//     /*********不加载********** */
//     g.initGame(Bounce);
//     /***********fps********** */
//     FPS.startFPS(stage);
// };

(function () {
    "use strict";
    //游戏变量;
    var score, level,lives;

    const LIVES="lives";

    var wall,
    paddleHits = 0,
    combo = 0,
    puck,
    paddle;

    const WALL_THICKNESS = 20,
        PUCK_RADIUS = 5,
        PUCK_SPEED = 5,
        PADDLE_WIDTH = 100,
        PADDLE_HEIGHT = 10,
        PADDLE_SPEED = 15,
        PADDLE_HITS_MAX = 7;
    class Bounce extends Game {
        constructor() {
            super();
            this.titleScreen.setText("弹球游戏");
            this.scoreBoard.creatTextElement(LIVES,"5");
            this.scoreBoard.y = stage.canvas.height - GFrame.style.SCOREBOARD_HEIGHT;
        }
        /**建立游戏元素游戏初始化
         * 在构造函数内建立
         */
        buildElement() {
            this.onkey()
            wall = new Wall(WALL_THICKNESS);
            paddle = new createjs.Shape();
            paddle.graphics.beginFill('#006600').drawRect(0, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
            puck = new createjs.Shape();
            puck.graphics.beginFill('#ffffff').drawCircle(0, 0, PUCK_RADIUS);
            this.brick = new Brick();
        }
        newGame() {
            score = 0;
            lives=5;
            this.updateScoreBoard(LIVES,lives);
            this.updateScoreBoard(SCORE, score);
            level = 0;
            paddleHits=0;
            combo=0;
        }
        newLevel() {
            level++;
            this.updateScoreBoard(LEVEL, level);
        }
        waitComplete() {
            let w = stage.canvas.width;
             stage.addChild(puck, wall, paddle);
             paddle.x = w / 2 - WALL_THICKNESS - PADDLE_WIDTH / 2 + WALL_THICKNESS;
             paddle.y = stage.canvas.height - PADDLE_HEIGHT - GFrame.style.SCOREBOARD_HEIGHT;
             this.brick.createBrick(WALL_THICKNESS, WALL_THICKNESS, stage.canvas.width - WALL_THICKNESS, level);
             this.brick.createBrick(WALL_THICKNESS, WALL_THICKNESS, stage.canvas.width - WALL_THICKNESS, level);
             puck.x = w / 2;
             puck.y = this.brick.bricks[0].y + this.brick.brickHeight * 2 + PUCK_RADIUS * 2;
 
             puck.vx = puck.vy = PUCK_SPEED;
             puck.isAlive = true;
        }
        runGame() {
            this._updatePaddle();
            this._updatePuck();
            this._checkPaddle();
            this._checkPuck();
            this._checkBrick();
            this._checkOver();
            // this._checkLevelUp();
        }
        _updatePaddle() {
            if (this.leftKeyDown) paddle.x -= PADDLE_SPEED;
            if (this.rightKeyDown) paddle.x += PADDLE_SPEED;
            let d = stage.canvas.width - PADDLE_WIDTH - WALL_THICKNESS;
            if (paddle.x < WALL_THICKNESS) paddle.x = WALL_THICKNESS;
            else if (paddle.x > d) paddle.x = d;
        }
        _updatePuck() {
            puck.x += puck.vx;
            puck.y += puck.vy;
            let d = stage.canvas.width - WALL_THICKNESS - PUCK_RADIUS;
            if (puck.x > d) {
                puck.x = d;
                puck.vx *= -1;
            } else if (puck.x < WALL_THICKNESS + PUCK_RADIUS) {
                puck.x = WALL_THICKNESS + PUCK_RADIUS;
                puck.vx *= -1;
            }
            if (puck.y < WALL_THICKNESS + PUCK_RADIUS) {
                puck.y = WALL_THICKNESS + PUCK_RADIUS;
                puck.vy *= -1;
            }
        }
        _checkPaddle() {
            if (puck.vy > 0 && puck.x >= paddle.x && puck.x <= paddle.x + PADDLE_WIDTH && puck.y >= paddle.y - PUCK_RADIUS && puck.isAlive) {
                puck.y = paddle.y - PUCK_RADIUS;
                puck.vy *= -1;
                let x1 = puck.x - paddle.x - PADDLE_WIDTH / 2;
                puck.vx += x1 / PADDLE_WIDTH * 15;
                paddleHits++;
                combo = 0;
                if (paddleHits == PADDLE_HITS_MAX) {
                    this.brick.createBrick(WALL_THICKNESS, WALL_THICKNESS, stage.canvas.width - WALL_THICKNESS, level);
                    paddleHits = 0;
                }
            }
        }
        _checkPuck() {
            if (puck.y > paddle.y) {
                puck.isAlive = false;
            }
            if (puck.y > stage.canvas.height + 200) {
                puck.y = this.brick.bricks[0].y + this.brick.brickHeight * 2 + PUCK_RADIUS * 2;
                puck.x = stage.canvas.width / 2;
                puck.isAlive = true;
                puck.vx = PUCK_SPEED;
                combo = 0;
                lives--;
                this.scoreBoard.update(LIVES,lives);
            }
        }
        _checkBrick() {
            if (!puck.isAlive || this.brick.bricks.length == 0) {
                return;
            }
            let brick, l = this.brick.bricks.length;
            for (let i = l - 1; i >= 0; i--) {
                brick = this.brick.bricks[i];
                if (puck.y <= brick.y + brick.height + PUCK_RADIUS && puck.y >= brick.y - PUCK_RADIUS && puck.x >= brick.x - PUCK_RADIUS && puck.x <= brick.x + brick.width + PUCK_RADIUS) {

                    score++;
                    this.updateScoreBoard(SCORE,score);
                    combo++;
                    if (brick.freeLife) {
                        lives++;
                        this.updateScoreBoard(LIVES,lives);
                        createjs.Tween.get(brick.freeLife).to({
                            alpha: 0,
                            y: brick.freeLife.y - 100
                        }, 1000).call(this._remove);
                    }
                    if (combo > 4) {
                        score += (combo * 10);
                        this.updateScoreBoard(SCORE,score);
                        let combotex = new createjs.Text('combo x' + (combo * 10), '14px Times', '#ff0000');
                        combotex.x = brick.x;
                        combotex.y = brick.y;
                        combotex.regX = brick.width / 2;
                        combotex.regY = brick.height / 2;
                        combotex.alpha = 0;
                        stage.addChild(combotex);
                        createjs.Tween.get(combotex).to({
                            alpha: 1,
                            scaleY: 2,
                            scaleX: 2,
                            y: combotex.y - 60
                        }, 1000).call(this._remove);
                    }
                    stage.removeChild(brick);
                    this.brick.bricks.splice(i, 1);
                    puck.vy *= -1;
                    return;
                }
            }
        }
        _checkOver() {
            if (this.brick.bricks.length == 0) {
                return;
            }
            if (lives < 0 || this.brick.bricks[0].y > paddle.y) {
                this.gameover = true;
            }
            if (this.gameover) {
                this.gameover = false;
                this.brick.clear();
                stage.dispatchEvent(GFrame.event.GAME_OVER);
            }
        }
        clear() {
            super.clear();

        }
        _remove() {
            stage.removeChild(this);

        }

    }
    window.Bounce = Bounce;
})();
class Brick {
    constructor() {
        this.bricks = [];
        this.brickHeight = 20;
    }
    createBrick(xpos1, ypos1, xpos2, level) {
        this.shiftBricksDown();
        let width = xpos2 - xpos1,
            num = level * 2 + 18,
            brickWidth = Math.floor(width / num * 2);
        xpos1 = Math.floor(width / 2 - brickWidth * num / 4 + xpos1);
        let xpos = xpos1,
            ypos = ypos1,
            freeLife = Math.floor(Math.random() * num),
            color = utils.randomColor();
        for (let i = 0; i < num; i++) {
            let brick = new createjs.Shape();
            let freeLifeTxt;
            brick.graphics.beginFill(i == freeLife ? '#009900' : color);
            brick.graphics.drawRect(0, 0, brickWidth, this.brickHeight).endFill();
            brick.x = xpos;
            brick.y = ypos;
            brick.width = brickWidth;
            brick.height = this.brickHeight;
            brick.freeLife = false;
            this.bricks.push(brick);
            stage.addChild(brick);
            if (i == freeLife) {
                freeLifeTxt = new createjs.Text('1UP', '12px Times', '#fff');
                freeLifeTxt.x = brick.x + (brickWidth / 2);
                freeLifeTxt.y = brick.y + 4;
                freeLifeTxt.textAlign = 'center';
                brick.freeLife = freeLifeTxt;
                stage.addChild(freeLifeTxt);
            }
            xpos += brickWidth;
            if (xpos + brickWidth > xpos2) {
                xpos = xpos1;
                ypos += this.brickHeight;
            }

        }
    }
    shiftBricksDown() {
        let l = this.bricks.length,
            h = this.brickHeight * 4;
        for (let i = 0; i < l; i++) {
            const brick = this.bricks[i];
            brick.y += h;
            if (brick.freeLife) {
                brick.freeLife.y += h;
            }
        }
    }
    clear() {
        this.bricks.splice(0, this.bricks.length);
    }
}