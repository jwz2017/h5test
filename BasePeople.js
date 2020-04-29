/**************************************人物基类**************************** */
class BasePeople extends createjs.Container {
    constructor() {
      super();
      // this.data = data;
      this._arrow = "right";
      this.busy = false; //设置技能期间能否用其他技能。
      this.walkSpeedX = 2
      this.runSpeedX = 5;
      this.runSpeedY = 0.5;
      this.walkSpeedY = 0.5
      this.jumpHeight = 80;
      this._jumpHeight = -this.jumpHeight;
      this.runJumpHeight = 120;
      this.initData();
    }
    initData() {
      //override
    }
    setSpriteData(data) {
      if (this.animation) {
        if (this.animation.parent) {
          this.animation.parent.removeChild(this.animation);
        }
      }
      this.spriteSheet = new createjs.SpriteSheet(data);
      this.animation = new createjs.Sprite(this.spriteSheet, "stand");
      this.addChild(this.animation);
    }
    /**
     * 移动
     * @param {number} x 
     * @param {number} y 
     */
    move(x, y) {
      this.x += x;
      this.y += y;
    }
    stop() {
      this.removeAllEventListeners("tick");
      this._decelerate = false; //能被取消的动作放这里
      this._attack = false;
    }
    /**
     * 开始行走以及跑步
     * @param {number} sx x方向速度
     * @param {number} sy y方向速度
     * @param {string} walk 跑步还是走咯
     */
    startWalk(vx, vy, walk = "walk") {
      if (this.busy && this._jump) {
        this.removeEventListener("tick", this._walking);
        this.removeEventListener("tick", this._decelerate);
      } else if (this.busy) return;
      else {
        this.stop();
        this.animation.gotoAndPlay(walk);
        if (walk == "walk") this._jumpHeight = -this.jumpHeight; //走路改变跳跃高度
        else this._jumpHeight = -this.runJumpHeight; //跑步改变跳跃高度
      }
  
      if (vx > 0) {
        this.arrow = "right";
      } else if (vx < 0) {
        this.arrow = "left";
      }
      this.vx = vx;
      this.vy = vy;
      var _this = this;
      this.addEventListener('tick', this._walking = function () {
        _this.move(_this.vx, _this.vy);
      });
    }
  
    /**
     * 停止移动或者跑步
     * 在方向键放开时执行
     */
    stopWalk() {
      this.removeEventListener("tick", this._walking);
      if (this.animation.currentAnimation == "run" || this.animation.currentAnimation == "walk") {
        this.animation.gotoAndPlay("stand");
      }
    }
  
    /**
     * 地滚减速运动
     */
    startDecelerate() {
      if (this.busy || this._decelerate) {
        return;
      }
      this.stop();
  
      this.animation.gotoAndPlay("somersault");
      var _this = this;
      this.addEventListener("tick", this._decelerating = function () {
        _this.decelerating();
      });
      this._decelerate = true;
    }
    decelerating() {
      this.vx = this.vx * 0.95;
      this.vy = this.vy * 0.95;
      this.move(this.vx, this.vy);
      if (this.animation.currentFrame == 0) {
        this.stopDecelerate();
      }
    }
    stopDecelerate() {
      this.animation.gotoAndPlay("stand");
      this.removeEventListener("tick", this._decelerating);
      this._decelerate = false;
      this.vx = this._arrow == "right" ? this.walkSpeedX : -this.walkSpeedX;
  
    }
    /**
     * 开始攻击
     * @param {number} type 攻击类型1，2为普通攻击，3为浮空攻击
     */
    startAttack(type = null) {
      if (this._attack && type == 3) { //如果攻击是方式3.立即结束其他攻击方式
        this.stopAttack();
      } else if (this.busy || this._attack) {
        return;
      }
      this.stop();
      if (type == 3) {
        this.animation.gotoAndPlay("attack3");
        this.busy = true;
      } else {
        if (Math.random() > 0.5) this.animation.gotoAndPlay("attack1");
        else this.animation.gotoAndPlay("attack2");
        this._attack = true;
      }
      var _this = this;
      this.addEventListener("tick", this._attacking = function () {
        _this.attacking();
      });
  
    }
    attacking() {
      if (this.animation.currentFrame == 0) {
        this.stopAttack();
      }
    }
    stopAttack() {
      this.animation.gotoAndPlay("stand");
      this.removeEventListener("tick", this._attacking);
      this._attack = false;
      this.busy = false;
    }
    /**
     * 跳跃
     */
    jump() {
      if (this.busy) {
        return;
      }
      this.animation.gotoAndPlay("jump");
      this.jumpY = this.y;
      var _this = this;
      this.t = 0;
      this.addEventListener("tick", this._jumping = function () {
        _this.jumping();
      });
      this._jump = true;
      this.busy = true;
    }
    jumping() {
      var list = this.animation.spriteSheet.getAnimation("jump").frames;
      if (this.animation.currentFrame == list[list.length - 1]) {
        this.t++;
        this.y = easing.circ.easeOut(this.t, this.jumpY, this._jumpHeight, 15);
        if (this.y >= this.jumpY) {
          this.y = this.jumpY;
          this.stopJump();
        }
      }
    }
    stopJump() {
      this.removeEventListener("tick", this._jumping);
      this.animation.gotoAndPlay("crouch");
      this.stop();
      this._jump = false;
      this.busy = false;
    }
  
    get arrow() {
      return this._arrow;
    }
    set arrow(val) {
      if (this._arrow != val) {
        this._arrow = val;
        this.animation.scaleX = this.animation.scaleX * -1;
      }
    }
  }
  
  /**
   * 弹道技能基类 所有弹道技能均继承与此类
   */
  //Barrage
  class Barrage extends createjs.Container {
    constructor(data) {
      super();
      this._arrow = "right";
      this.initData();
    }
    initData() {
      //override
    }
    setSpriteData(data) {
      if (this.animation) {
        if (this.animation.parent) {
          this.animation.parent.removeChild(this.animation);
        }
      }
      this.spriteSheet = new createjs.SpriteSheet(data);
      this.animation = new createjs.Sprite(this.spriteSheet);
      this.addChild(this.animation);
    }
    move(x, y) {
      this.x += x;
      this.y += y;
    }
    startRun(vx, vy, run = "run") {
      this.animation.gotoAndPlay(run);
      this.vx = vx;
      this.vy = vy;
      var _this = this;
      this.addEventListener("tick", this._runing = function () {
        _this.runing();
      });
    }
    runing() {
      this.move(this.vx, this.vy);
      if (this.x > 850 || this.x < -100 || this.y < -100 || this.y > 1206) {
        this.stopRun();
      }
    }
    stopRun() {
      this.removeEventListener("tick", this._runing);
      if (this.parent) this.parent.removeChild(this);
    }
    startHit() {
      this.changeStop();
      this.animation.gotoAndPlay("hit");
      var _this = this;
      this.addEventListener("tick", this_hitting = function () {
        _this.hitting();
      })
    }
    hitting() {
      var list = this.animation.spriteSheet.getAnimation("hit").frames;
      if (this.animation.currentFrame == list[list.length - 1]) {
        this.stopHit();
      }
    }
    stopHit() {
      this.removeEventListener("tick", this._hitting);
      if (this.parent) {
        this.parent.removeChild(this);
      }
    }
    changeStop() {
      this.removeEventListener("tick", this._runing);
      this.removeEventListener("tick", this._hitting);
    }
    get arrow() {
      return this._arrow;
    }
    set arrow(val) {
      if (this._arrow != val) {
        this._arrow = val;
        this.animation.scaleX = this.animation.scaleX * -1;
      }
    }
  
  }