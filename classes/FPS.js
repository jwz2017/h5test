var FPS = {};
FPS.time = 0;
FPS.FPS = 0;
FPS.startFPS = function (stage)
{
    FPS.txt = document.getElementById("fps");
    let txt = new createjs.DOMElement(FPS.txt);
    FPS.txt.style.display = "block";
    stage.addChild(txt);
    txt.x=txt.y=10;
    createjs.Ticker.addEventListener("tick", FPS.TickerFPS);
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
    FPS.txt.innerText = "FPS: "+FPS.FPS;
}