window.onload = function () {
    "use strict";
    /*************游戏入口*****/
    var g = new GFrame('canvas');

    //收缩，展开
    var genduo1 = document.getElementById("genduo1"),
        genduo2=document.getElementById("genduo2"),
        pro_con1 = document.getElementById("pro_con1"),
        pro_con2 = document.getElementById("pro_con2");
    genduo1.onclick = function (e) {
        genduo(e, pro_con1);
    };
    genduo2.onclick = function (e) {
        genduo(e, pro_con2);
    }
    function genduo(e, pro_con1) {
        if (pro_con1.style.display === "none") {
            pro_con1.style.display = "block";
            e.target.textContent = "收缩>"
        } else {
            pro_con1.style.display = "none";
            e.target.textContent = "更多>";
        }
    }

    //练习内容点击
    window.productClick=function (a) {
        let main = document.getElementById("main");
        let dome = document.getElementById("dome");
        let game = document.getElementById("game");
        game.style.width = "100%";
        main.style.opacity = "0.3";
        main.style.filter = "alpha(opacity=30)";
        dome.style.display = "block";
        //禁止滚动
        document.getElementsByTagName('body')[0].setAttribute('style', 'position:fixed; width:100%;');
        g.adapt();
        g.preload(eval(a.title));
    }
    //关闭按钮点击
    var close = document.getElementById("close");
    close.onclick = function (e) {
        let main = document.getElementById("main"),
            a = e.target;
        let input=document.getElementById("inputText");
        let p=document.getElementById("testTxt");
        input.style.display="none";
        p.style.display="none";
        main.style.opacity = "1";
        main.style.filter = "alpha(opacity=100)";
        a.parentNode.style.display = "none";
        a.style.visibility = "hidden";
        g.clear();
        //应许滚动
        document.getElementsByTagName('body')[0].setAttribute('style', 'position:relative;');
    }


}