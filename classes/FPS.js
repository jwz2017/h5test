var FPS = {};
FPS.time = 0;
FPS.FPS = 0;
FPS.startFPS = function (stage){
    FPS.shape = new createjs.Shape();
    FPS.shape.graphics.beginFill("#000000").drawRect(0, 0, 200, 70);
    stage.addChild(FPS.shape);
    FPS.txt =new createjs.Text("", "30px Arial", "#ffffff");
    stage.addChild(FPS.txt);
    createjs.Ticker.addEventListener("tick", FPS.TickerFPS);
//    setInterval(FPS.TickerFPS,18)
}
FPS.TickerFPS = function (event)
{
    FPS.date = new Date();
    FPS.currentTime = FPS.date.getTime();
    if(FPS.time!=0)
    {
        FPS.FPS = Math.ceil(1000/(FPS.currentTime -  FPS.time));
    }
    FPS.time = FPS.currentTime;
    FPS.txt.text = "FPS: "+FPS.FPS + "\n" + "COUNT:2000";
}
FPS.startFPS2 = function (stage)
{
    FPS.txt = document.getElementById("fps");
    let txt = new createjs.DOMElement(FPS.txt);
    FPS.txt.style.display = "block";
    stage.addChild(txt);
    txt.x=txt.y=370;
    createjs.Ticker.addEventListener("tick", FPS.TickerFPS2);
}
FPS.TickerFPS2 = function (event)
{
    FPS.date = new Date();
    FPS.currentTime = FPS.date.getTime();
    if(FPS.time!=0)
    {
        FPS.FPS = Math.ceil(1000/(FPS.currentTime -  FPS.time));
    }
    FPS.time = FPS.currentTime;
    FPS.txt.innerText = "FPS: "+FPS.FPS;
}