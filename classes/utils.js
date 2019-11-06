var utils = {};
/**
 * Returns a color in the format: '#RRGGBB', or as a hex number if specified.
 * @param {number|string} color
 * @param {boolean}      toNumber=false  Return color as a hex number.
 * @return {string|number}
 */
utils.parseColor = function (color, toNumber) {
    if (toNumber === true) {
        if (typeof color === 'number') {
            return (color | 0); //chop off decimal
        }
        if (typeof color === 'string' && color[0] === '#') {
            color = color.slice(1);
        }
        return window.parseInt(color, 16);
    } else {
        if (typeof color === 'number') {
            color = '#' + ('00000' + (color | 0).toString(16)).substr(-6); //pad
        }
        return color;
    }
};
/**
 * 随机颜色
 */
utils.randomColor = function () {
    return "rgb(" + Math.floor(Math.random() * 256) + "," +
        Math.floor(Math.random() * 256) + "," +
        Math.floor(Math.random() * 256) + ")";
};
/**
 * 边界检测返弹
 * @param {number} left 
 * @param {number} top 
 * @param {number} right 
 * @param {number} bottom 
 * @param {object} obj 被检测对象
 * @param {number} bounce 反弹系数
 */
utils.checkBounds = function (obj, left = 0, top = 0, right = 750, bottom = 980, bounce = -0.7) {
    let o = obj.getBounds();
    if (obj.x + o.x < left) {
        obj.x = left - o.x;
        obj.vx *= bounce;

    } else if (obj.x + o.x + o.width > right) {
        obj.x = right - o.x - o.width;
        obj.vx *= bounce;
    }
    if (obj.y + o.y < top) {
        obj.y = top - o.y;
        obj.vy *= bounce;
    } else if (obj.y + o.y + o.height > bottom) {
        obj.y = bottom - o.y - o.height;
        obj.vy *= bounce;
    }
}
/**旋转坐标(逆)
 * 
 * @param {*} xpos 
 * @param {*} ypos 
 * @param {*} cos 
 * @param {*} sin 
 */
utils.rotateP1 = function (xpos, ypos, cos, sin) {
    return {
        x: cos * xpos + sin * ypos,
        y: cos * ypos - sin * xpos
    };
}
/**旋转回去（顺）
 * 
 * @param {}} xpos 
 * @param {*} ypos 
 * @param {*} cos 
 * @param {*} sin 
 */
utils.rotateP2 = function (xpos, ypos, cos, sin) {
    return {
        x: cos * xpos - sin * ypos,
        y: cos * ypos + sin * xpos
    };
}
/**
 * 绘制图形
 * @param {*} g 
 * @param {*} mat 
 * @param {*} points 
 */
utils.drawPoints = function (g, mat, points) {
    points.forEach((point, i) => {
        const p = mat.transformPoint(point[0], point[1])
        p.x = Math.ceil(p.x);
        p.y = Math.ceil(p.y)
        if (i == 0) {
            g.moveTo(p.x, p.y)
        } else {
            g.lineTo(p.x, p.y)
        }
    })
}
/**
 * Array随机排序
 */
utils.randomArray=function(array){
    if (!Array.prototype.derangedArray) {
        Array.prototype.derangedArray = function () {
            for (var j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
            return this;
        };
    }
    array=array.derangedArray();
}