(function(window) {
ma = function() {
	this.initialize();
}
ma._SpriteSheet = new createjs.SpriteSheet({images: ["assets/move/ma.png"], frames: [[525,459,468,225,0,-39.5,-6.05],[519,1397,405,225,0,-39.5,-6.05],[520,1156,397,241,0,-37.5,-9.05],[520,917,402,239,0,-33.5,-8.05],[525,684,430,233,0,-23.5,-14.05],[520,231,465,228,0,-7.5,-22.05],[0,1558,479,228,0,-8.5,-24.05],[0,908,500,224,0,-2.5,-26.05],[520,0,508,231,0,-5.5,-20.05],[0,238,515,232,0,-9.5,-17.05],[0,0,520,238,0,-12.5,-11.05],[0,689,521,219,0,-18.5,-11.05],[0,470,525,219,0,-18.5,-11.05],[0,1345,519,213,0,-28.5,-10.05],[0,1132,520,213,0,-28.5,-10.05]],
animations:{
	run:[0,14,"run",0.4]//在末帧停止："run"改为""
}});
var ma_p = ma.prototype = new createjs.Sprite();
ma_p.Sprite_initialize = ma_p.initialize;
ma_p.initialize = function() {
	this.Sprite_initialize(ma._SpriteSheet);//改
	this.paused = false;
}
window.ma = ma;
}(window));

