class BasePeople extends createjs.Container {
  constructor(data) {
    super();
    this._arrow = "right";
    this.walkSpeedX = 2;
    this.walkSpeedY = 2;
    this.runSpeedX = 5;
    this._vx = 0;
    this._vy = 0;
    this.leftTic = 0;
    this.rightTic = 0;
    this.walkHeight = 80;
    this.runJumpHeight = 120;
    this._jumpheight = this.walkHeight;
    this.animation = this.standing;
    if(data) this.initData(data);
  }
  initData(data) {
    this.spriteSheet = new createjs.SpriteSheet(data);
    this.sprite = new createjs.Sprite(this.spriteSheet, "stand");
    this.addChild(this.sprite);
  }
  setSpriteData(data) {
    if (this.sprite) {
      if (this.sprite.parent) {
        this.sprite=this.standing;
        this.sprite.gotoAndPlay("stand");
        this.sprite.parent.removeChild(this.sprite);
      }
    }
    this.spriteSheet = new createjs.SpriteSheet(data);
    this.sprite = new createjs.Sprite(this.spriteSheet, "stand");
    this.addChild(this.sprite);
  }
  standing() {

  }
  //移动
  moving() {
    if (!this.leftKeyDown && !this.rightKeyDown && !this.upKeyDown && !this.downKeyDown) {
      if (!this.busy) {
        this.animation = this.standing;
        this.sprite.gotoAndPlay("stand");
      }
      return;
    }
    if (this.leftKeyDown || this.rightKeyDown) {
      this.x += this._vx;
    }
    if (this.upKeyDown || this.downKeyDown) {
      this.y += this._vy;
    }
  }
  startWalk() {
    if (!this.jump) {
      this._jumpheight = this.walkHeight;
    }
    this._vx = this.walkSpeedX;
    if (!this.busy) {
      this.animation = this.moving;
      this.sprite.gotoAndPlay("walk");
    }
    this.leftTic++;
    setTimeout(() => {
      if (this.leftTic >= 2) {
        this.startRun();
      }
      this.leftTic = 0;
    }, 200);
  }
  startWalkUp(val) {
    if (!this.busy) {
      if (val) {
        this._vy = -this.walkSpeedY;
      } else {
        this._vy = this.walkSpeedY;
      }
      this.animation = this.moving;
      this.sprite.gotoAndPlay("walk");
    }
  }
  startRun() {
    if (!this.jump) {
      this._jumpheight = this.runJumpHeight;
    }
    this._vx = this.runSpeedX;
    if (!this.busy) {
      this.animation = this.moving;
      this.sprite.gotoAndPlay("run");
    }
  }
  startRoll() {
    if (!this.busy) {
      this.sprite.gotoAndPlay("roll");
      this.animation = this.rolling;
    }
  }
  rolling() {
    if (this.rightKeyDown || this.leftKeyDown) {
      this.moving();
    }
    if (this.sprite.currentFrame == 0) {
      this.animation = this.standing;
    }
  }
  startJump() {
    if (!this.busy) {
      this.busy = true;
      this.jump = true;
      this.sprite.gotoAndPlay("jump");
      this._ypos = this.y;
      this._t = 0;
      this.animation = this.jumping;
    }
  }
  jumping() {
    var list = this.sprite.spriteSheet.getAnimation("jump").frames;
    if (this.sprite.currentFrame == list[list.length - 1]) {
      if (this.rightKeyDown || this.leftKeyDown) {
        this.moving();
      }
      this._t++;
      this.y = easing.circ.easeOut(this._t, this._ypos, -this._jumpheight, 15);
      if (this.y >= this._ypos) {
        this.y = this._ypos;
        this.stopJump();
      }
    }
  }
  stopJump() {
    this.animation = this.standing;
    this.sprite.gotoAndPlay("crouch");
    this.busy = false;
    this.jump = false;
    this._jumpheight = this.walkHeight;
  }
  //普通攻击，可中断
  startAttack1() {
    if (!this.busy) {
      this.busy = true;
      this.attack1 = true;
      if (Math.random() > 0.5) {
        this.sprite.gotoAndPlay("attack1");
      } else {
        this.sprite.gotoAndPlay("attack2");
      }
      this.animation = this.attacking;
    }
  }
  attacking() {
    if (this.sprite.currentFrame == 0) {
      this.stopAttack();
    }
  }
  stopAttack() {
    this.animation = this.standing;
    this.busy = false;
    this.attack1 = false;
    this.attack2 = false;
  }
  //不可中断攻击
  startAttack2() {
    if (this.attack2) {
      return;
    }
    if (!this.busy || this.attack1) {
      this.busy = true;
      this.attack2 = true;
      this.sprite.gotoAndPlay("attack3");
      this.animation = this.attacking;
    }
  }

  get arrow() {
    return this._arrow;
  }
  set arrow(val) {
    if (this._arrow != val) {
      this._arrow = val;
      this.sprite.scaleX = this.sprite.scaleX * -1;
      this.walkSpeedX = this.walkSpeedX * -1;
      this.runSpeedX = this.runSpeedX * -1;
    }
  }
}
/**
 * 弹道技能基类 所有弹道技能均继承与此类
 */
class Barrage extends createjs.Container {
  constructor(data) {
    super();
    this._arrow = "right";
    this.vx=0;
    this.vy=0;
    this.animation=this.standing;
    this.listener=this.on('tick',()=> {
      this.animation();
    });
    if(data) this.initData(data);
  }
  initData(data) {
    this.spriteSheet = new createjs.SpriteSheet(data);
    this.sprite = new createjs.Sprite(this.spriteSheet);
    this.addChild(this.sprite);
  }
  setSpriteData(data) {
    if (this.sprite) {
      if (this.sprite.parent) {
        this.sprite.parent.removeChild(this.sprite);
      }
    }
    this.spriteSheet = new createjs.SpriteSheet(data);
    this.sprite = new createjs.Sprite(this.spriteSheet);
    this.addChild(this.sprite);
  }
  standing(){

  }
  moving() {
    this.x+=this.vx;
    this.y+=this.vy;
    if (this.x > 850 || this.x < -100 || this.y < -100 || this.y > 1306) {
      this.stopRun();
    }
  }
  startRun(vx,vy,run) {
    this.vx=vx;
    this.vy=vy;
    this.sprite.gotoAndPlay(run);
    this.animation=this.moving;
  }

  stopRun() {
    this.off("tick",this.listener);
    if (this.parent) this.parent.removeChild(this);
  }
  startHit() {
    this.sprite.gotoAndPlay("hit");
    this.animation=this.hitting;
  }
  hitting() {
    var list = this.sprite.spriteSheet.getAnimation("hit").frames;
    if (this.sprite.currentFrame == list[list.length - 1]) {
      this.stopHit();
    }
  }
  stopHit() {
    this.off("tick",this.listener);
    if (this.parent)  this.parent.removeChild(this);
  }
  get arrow() {
    return this._arrow;
  }
  set arrow(val) {
    if (this._arrow != val) {
      this._arrow = val;
      this.sprite.scaleX = this.sprite.scaleX * -1;
      this.speed=-this.speed;
    }
  }
}