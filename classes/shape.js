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