window.onload = function () {
    "use strict";
    /*************游戏入口*****/
    var g = new GFrame('canvas');
    //直接加载游戏方式
    // g.adapt(true); //可加true参数在pc端高度自适应
    // g.preload(); //参数为具体游戏
    /***********fps********** */
    // FPS.startFPS(stage);
    window.onclick1 = function (a) {
        let pro_con1 = document.getElementById("pro_con1");
        if (pro_con1.style.display === "none") {
            pro_con1.style.display = "block";
            a.textContent = "收缩>"
        } else {
            pro_con1.style.display = "none";
            a.textContent = "更多>";
        }
    }
    window.onclick2 = function (a) {
        let pro_con2 = document.getElementById("pro_con2");
        if (pro_con2.style.display === "none") {
            pro_con2.style.display = "block";
            a.textContent = "收缩>"
        } else {
            pro_con2.style.display = "none";
            a.textContent = "更多>";
        }
    }
    window.pclick = function (a) {
        let main = document.getElementById("main");
        let dome = document.getElementById("dome");
        let game=document.getElementById("game");
        game.style.width = "100%";
        main.style.opacity = "0.3";
        main.style.filter = "alpha(opacity=30)";
        dome.style.visibility = "visible";
        document.getElementsByTagName('body')[0].setAttribute('style', 'position:fixed; width:100%;');
        g.adapt();
        g.preload(eval(a.title));
    }
    window.dclose = function (a) {
        let main = document.getElementById("main");
        main.style.opacity = "1";
        main.style.filter = "alpha(opacity=100)";
        a.parentNode.style.visibility = "hidden";
        document.getElementsByTagName('body')[0].setAttribute('style', 'position:relative;');
        g.clear();
    }
    

}