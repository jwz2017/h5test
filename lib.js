(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.webFontTxtInst = {}; 
var loadedTypekitCount = 0;
var loadedGoogleCount = 0;
var gFontsUpdateCacheList = [];
var tFontsUpdateCacheList = [];
lib.ssMetadata = [];



lib.updateListCache = function (cacheList) {		
	for(var i = 0; i < cacheList.length; i++) {		
		if(cacheList[i].cacheCanvas)		
			cacheList[i].updateCache();		
	}		
};		

lib.addElementsToCache = function (textInst, cacheList) {		
	var cur = textInst;		
	while(cur != null && cur != exportRoot) {		
		if(cacheList.indexOf(cur) != -1)		
			break;		
		cur = cur.parent;		
	}		
	if(cur != exportRoot) {		
		var cur2 = textInst;		
		var index = cacheList.indexOf(cur);		
		while(cur2 != null && cur2 != cur) {		
			cacheList.splice(index, 0, cur2);		
			cur2 = cur2.parent;		
			index++;		
		}		
	}		
	else {		
		cur = textInst;		
		while(cur != null && cur != exportRoot) {		
			cacheList.push(cur);		
			cur = cur.parent;		
		}		
	}		
};		

lib.gfontAvailable = function(family, totalGoogleCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], gFontsUpdateCacheList);		

	loadedGoogleCount++;		
	if(loadedGoogleCount == totalGoogleCount) {		
		lib.updateListCache(gFontsUpdateCacheList);		
	}		
};		

lib.tfontAvailable = function(family, totalTypekitCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], tFontsUpdateCacheList);		

	loadedTypekitCount++;		
	if(loadedTypekitCount == totalTypekitCount) {		
		lib.updateListCache(tFontsUpdateCacheList);		
	}		
};
// symbols:



(lib.Butterfly = function() {
	this.initialize(img.Butterfly);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,200,138);// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.btn = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// 图层 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AhxB0QAkgcARggQgZgOgRgHQAMgnALgsIgCAAQgNAAgLADIgKgJIAlAAQAKgrACgSIAYALIgKAFIgMAtIAgAAIAHgJIAQAOIgIAGQgLA7gOAjQATAKAEAFQAEAFAAAIIgBAKQAAABgBABQAAABAAAAQAAABgBAAQAAABAAAAQgDAAgFgJQgJgNgNgKQgZAlgmAUgAhZAhQASAHAPAGQAQgjAJg7IgiAAIgYBRgAAFBAIgBg6IAQAJIBBAAIAHgKIARAOIgIAGQAABIABAKIgPAIIAAgVIhDAAIAAARIgQAGIABg1gAAUBYIBDAAIAAhCIhDAAgAgKgcQAKgDANgYQANgXALgoIAWAPIgJAEQggA6gMANIBZgDQgKgSgSgTIADgDQApAcACAGQADAHAAAGQAAAHgEAFQgEAFgCAAQgBAAAAAAQgBgBAAAAQAAAAgBgBQAAgBAAgBIgGgOQgsADgWAEQgWAFgIAHg");
	this.shape.setTransform(112.6,19.4);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000000").s().p("AhyBvQAigVARgcQASgbAAgtIgnAAQgNAAgLADIgKgJIBJAAIAAhMIgZAAQgNAAgMADIgJgJICtAAIAPgPIAWAVIg7AAIAABMIAhAAIARgQIAWAWIhIAAIAABOQAAAUACASIgRAGIABg0IAAhGIg+AAQgCArgSAdQgSAdgrAXgAgdgQIA+AAIAAhMIg+AAg");
	this.shape_1.setTransform(86.9,19.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#000000").ss(1,1,1).p("AvnjHIfPAAIAAGPI/PAAg");
	this.shape_2.setTransform(100,20);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#33CC33").s().p("AvnDIIAAmPIfPAAIAAGPg");
	this.shape_3.setTransform(100,20);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#000000").s().p("AhxB0QAkgdARgfQgZgPgRgGQAMgnALgrIgCAAQgNAAgLADIgKgKIAlAAQAKgsACgSIAYALIgKAGIgMAtIAgAAIAHgJIAQANIgIAGQgLA9gOAiQATAKAEAFQAEAFAAAJIgBAJQgBABAAABQAAABAAAAQgBABAAAAQAAAAAAAAQgDAAgFgHQgJgOgNgKQgZAkgmAVgAhZAiQASAFAPAHQAQgjAJg6IgiAAIgYBRgAAFA/IgBg5IAQAKIBBAAIAHgLIARANIgIAIQAABGABAMIgPAHIAAgUIhDAAIAAAQIgQAGIABg2gAAUBZIBDAAIAAhEIhDAAgAgKgbQAKgEANgYQANgXALgoIAWAOIgJAFQggA5gMAPIBZgDQgKgUgSgSIADgDQApAbACAIQADAGAAAFQAAAIgEAFQgEAFgCAAQgCAAgBgEIgGgPQgsAEgWAEQgWAFgIAHg");
	this.shape_4.setTransform(113.1,19.9);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#000000").s().p("AhyBvQAigVARgcQARgbACgtIgpAAQgNAAgLADIgJgJIBKAAIAAhMIgaAAQgNAAgMADIgJgJICtAAIAPgPIAVAVIg5AAIAABMIAgAAIAQgQIAXAWIhHAAIAABOQgBAUACASIgSAGIABg0IAAhGIg+AAQgBArgSAdQgSAdgsAXgAgegQIA+AAIAAhMIg+AAg");
	this.shape_5.setTransform(87.4,20.3);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#006633").s().p("AvnDIIAAmPIfPAAIAAGPg");
	this.shape_6.setTransform(100,20);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#000000").s().p("AvnDIIAAmPIfPAAIAAGPg");
	this.shape_7.setTransform(100,20);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).to({state:[{t:this.shape_6},{t:this.shape_2},{t:this.shape_5},{t:this.shape_4}]},1).to({state:[{t:this.shape_7},{t:this.shape_2},{t:this.shape_5},{t:this.shape_4}]},1).to({state:[{t:this.shape_7},{t:this.shape_2},{t:this.shape_5},{t:this.shape_4}]},1).wait(1));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,202,42);


(lib.Crc = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// 图层 2
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFF00").s().p("ABECBIg/ifIhICfIgKAAIhQjSQgIgTgIgHQgHgHgRgEIAAgKIBpAAIAAAKQgOABgFAEQgEAFAAAHQAAAJAEALIA2CPIA2h0IgOgkQgHgRgLgGQgGgEgQgBIAAgKIB2AAIAAAKQgTABgJAHQgFADAAAKQAAAFACAGIA5CPIA1iKQAFgOAAgJQAAgFgFgEQgFgEgQgBIAAgKIBPAAIAAAKQgYAEgLAcIhUDXg");
	this.shape.setTransform(115.1,-30.1);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFF00").s().p("Am9G9Qi4i4AAkFQAAkEC4i5QC5i4EEAAQEFAAC4C4QC5C5AAEEQAAEFi5C4Qi4C5kFAAQkEAAi5i5g");
	this.shape_1.setTransform(-7,6.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(11));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-70,-69.8,207.7,138.9);


(lib.Title = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		this.stop();
		this.btn1.addEventListener("click", ()=> {
			console.log("click");	
			//this.dispatchEvent(GFrame.event.OK_BUTTON, false);
		});
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1));

	// 图层 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AjIA5QAAh2gChEIAgARIBrAAQASgyAHgsIiNAAQggAAgYAHIgUgUIG0AAIAjghIAoAuIkRAAIAgASIgUAGQgbAmgRAgIDVAAIAPgVIAjAaIgPAPQAADEADCDIgiAQIAAgsIlSAAIAAAeIggAQQAChNAAh3gABIDCIBgAAIAAkkIhgAAgAgvDCIBbAAIAAhhIhbAAgAiqDCIBfAAIAAkkIhfAAgAgvBUIBbAAIAAhWIhbAAgAgvgPIBbAAIAAhTIhbAAg");
	this.shape.setTransform(450.7,283.3);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AjoDyQBPgfAkgrQAkgqAHhpQhAA5htAaIgDgJQCRgwA7hqIhWAAIAAAPIgeANQACg2AAg2QAAg2gCg0IAjAUID9AAIARgWIAkAeIgWAQQAABgACA3IgfANIAAgWIhVAAQAnA0AwAVQAxAWBHAJIAAAGQgcAFgLAaQg5gUgugfQgtgfgfg7IgpAAQgfAwghAeIAuATIgRANQgPBpgtAjQgtAjhTAWgAAKhIIB2AAIAAhCIh2AAgAiEhIIByAAIAAhCIhyAAgAAKiXIB2AAIAAg9Ih2AAgAiEiXIByAAIAAg9IhyAAgAA+CEQAAg7gCgyIAuAUIgPAPQAAB6ACAzIghAPQACg3AAg7g");
	this.shape_1.setTransform(395.3,283.8);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("Aj0D6QBNg+AkhEQg2geglgOQAahWAYheIgEAAQgdAAgYAGIgTgTIBPAAQAVheAFgnIAyAYIgUAMQgIAdgSBEIBEAAIAPgTIAjAcIgSANQgYCCgeBKQAqAXAIALQAJAKAAASQAAAKgCAKQgCAKgDAAQgGAAgLgRQgUgdgagVQg3BPhQArgAjBBJQAnANAgANQAhhLAUiAIhIAAIg0CxgAALCJQAAhSgCgqIAgAUICNAAIAPgWIAlAcIgRAQQAACZACAYIghAPIAAgrIiRAAIAAAiIggAOQACghAAhSgAApC+ICRAAIAAiQIiRAAgAgXg8QAXgJAcgyQAbgzAXhVIAxAfIgUAKQhDB7gbAfIC+gHQgWgqgkgnIAGgGQBXA7AGAPQAGAQgBALQAAAOgJAMQgIALgEgBQgFAAgCgIIgNgfQhfAHgvAJQguALgSAPg");
	this.shape_2.setTransform(338.1,283);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("Aj2DwQBIgvAlg7QAmg6AChiIhWAAQgcAAgYAGIgUgTICeAAIAAikIg3AAQgcAAgYAHIgUgVIF1AAIAhggIAuAuIh9AAIAACkIBGAAIAjgjIAwAwIiZAAIAACpQAAAqACAnIglAOQAChCAAguIAAiYIiHAAQgCBdgnA/QgoA9hdAzgAhBgjICHAAIAAikIiHAAg");
	this.shape_3.setTransform(282.7,284);

	this.btn1 = new lib.btn();
	this.btn1.parent = this;
	this.btn1.setTransform(264.3,649.6);
	new cjs.ButtonHelper(this.btn1, 0, 1, 2, false, new lib.btn(), 3);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#666666").s().p("Eg6lBMkMAAAiZHMB1LAAAMAAACZHg");
	this.shape_4.setTransform(375,490);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_4},{t:this.btn1},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

}).prototype = getMCSymbolPrototype(lib.Title, new cjs.Rectangle(0,0,750,980), null);


// stage content:
(lib._lib = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = null;
// library properties:
lib.properties = {
	id: 'A81D833FE7C7754FB5395FF7A6EFA6E1',
	width: 750,
	height: 980,
	fps: 60,
	color: "#FFFFFF",
	opacity: 1.00,
	webfonts: {},
	manifest: [
		{src:"images/Butterfly.png", id:"Butterfly"},
		{src:"sounds/p.mp3", id:"p",data:"1"},
		{src:"sounds/woosh.mp3", id:"woosh"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['A81D833FE7C7754FB5395FF7A6EFA6E1'] = {
	getStage: function() { return exportRoot.getStage(); },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}



})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;