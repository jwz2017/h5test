window.onload=function () {
    "use strict";
    var stage = new createjs.Stage("canvas");
    stage.canvas.style.display = "block"; //显示canvas
    stage.enableMouseOver(); //开启鼠标经过事件
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on("tick", (e) => {
        stage.update(); //创建全局舞台刷新
      });
    FPS.startFPS2(stage);
}