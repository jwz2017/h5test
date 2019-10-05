(function(window) {
ma = function() {
	this.initialize();
}
ma._SpriteSheet = new createjs.SpriteSheet({images: ["ma.png"], frames: [[520,228,468,225,0,-39.5,-6.05],[520,1411,405,225,0,-39.5,-6.05],[520,1170,397,241,0,-37.5,-9.05],[521,931,402,239,0,-33.5,-8.05],[525,698,430,233,0,-23.5,-14.05],[520,0,465,228,0,-7.5,-22.05],[508,470,479,228,0,-8.5,-24.05],[0,1139,500,224,0,-2.5,-26.05],[0,470,508,231,0,-5.5,-20.05],[0,238,515,232,0,-9.5,-17.05],[0,0,520,238,0,-12.5,-11.05],[0,920,521,219,0,-18.5,-11.05],[0,701,525,219,0,-18.5,-11.05],[0,1576,519,213,0,-28.5,-10.05],[0,1363,520,213,0,-28.5,-10.05]],
animations:{
	run:[0,14,"run",0.3]
}});
var ma_p = ma.prototype = new createjs.Sprite();
ma_p.Sprite_initialize = ma_p.initialize;
ma_p.initialize = function() {
	this.Sprite_initialize(ma._SpriteSheet);
	this.paused = false;
}
window.ma = ma;
}(window));

