var FPS = {};
FPS.time = 0;
FPS.FPS = 0;
FPS.startFPS = function (stage)
{
    FPS.txt=new createjs.Text("0","32px Microsoft YaHei","#030303");
    stage.addChild(FPS.txt);
    FPS.txt.x=6;
    FPS.txt.y=100;
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
    FPS.txt.text = "FPS: "+FPS.FPS;
}
