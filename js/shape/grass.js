/*
*	Grass generator
*/
(function(namespace){

	var Grass	= function( offsetX, offsetY ){
		this.grassJsonDataArr	= new Array();	// blade of this array
		this.grassStartColor	= '#487A12';
		this.grassEndColor		= '#7BEF5F';
		this.shape				= null;
		this.graphics			= null;
		this.bending			= 0;			// bending of the grass (hajlás)
		this.bendingDirection	= 1;			// bending of the grass (hajlás)
		this.bladeDistance		= 10;
		this.offsetX			= 0;			// offset in pixel
		this.numberOfBlades	=91;
		
		this.initialize();
		this.shape.x	= (typeof offsetX == "undefined") ? 0 : offsetX;	// set default value
		this.shape.y	= (typeof offsetY == "undefined") ? 0 : offsetY;	// set default value
	}

	var p	=	Grass.prototype;

	/*
	* automatically generated grass
	*/
	p.initialize	= function(){

		this.graphics	= new createjs.Graphics();
	
		var offsetX	= 0;
		
		// generate the grass json arr
		for ( var i=0;i<this.numberOfBlades;i++){
			offsetX	= i*10;
			this.grassJsonDataArr[i]	= this.getRandomBladeOfGrassJSON( offsetX,6 );
		}

		this.shape	= new createjs.Shape(this.graphics);
		this.shape.x	= 0;
		this.shape.y	= globals.STAGE_HEIGHT;
		this.shape.scaleX	= 1;
		this.shape.scaleY	= 1;

//		this.shape.cache(0, 0, globals.STAGE_WIDTH, globals.STAGE_HEIGHT);
		this.draw();

	}



	// bending effect: redraw the grass with offseted edge
	// e.g. when wind blows
	p.bend	= function(){

		var	bendingLimit	= 10;
		var jsonArr			= this.grassJsonDataArr;
		var numberOfBlades	= this.numberOfBlades;

		// set the direction
		if (this.bending > bendingLimit) {
			this.bendingDirection = -1;
		} else if (this.bending < (-1*bendingLimit) ) {
			this.bendingDirection = 1;
		} else {}

		this.bending	+= this.bendingDirection;
	
		// change every blade-s edge coord
		for ( var i=0;i<numberOfBlades;i++){
			jsonArr[i]["quadraticCurveTo"][0]["x"] += this.bendingDirection;
		}

	}


	p.draw	= function (){
		var shape			= this.shape;
		var numberOfBlades	= this.numberOfBlades;
		var	lastBlade		= numberOfBlades - Math.floor(this.offsetX/this.bladeDistance);

		shape.graphics.clear();
		shape.graphics.setStrokeStyle(1).beginLinearGradientStroke(["#000","#FFF"], [0, 1], 100, 100, 440, 300);

		for ( var i=0;i<numberOfBlades;i++){
			if (i>=lastBlade) {
				tmpOffsetX	= this.offsetX - this.numberOfBlades*this.bladeDistance;
			}else{
				tmpOffsetX	= this.offsetX;
			}
			gradientOffsetX	= i*this.bladeDistance+tmpOffsetX;

			shape.graphics.beginLinearGradientFill( [this.grassStartColor,this.grassEndColor], [0.3,1], 0+gradientOffsetX,100, 30+gradientOffsetX,0 );
			shape.graphics	= game.Common.drawQuadraticJson(this.graphics, this.grassJsonDataArr[i], tmpOffsetX);
		}

		console.log("grass draw");
		//this.shape.updateCache(0, 0, globals.STAGE_WIDTH, globals.STAGE_HEIGHT);
	}


	/*
	* generate the coordinates of one blade of grass and return data in json
	*/
	p.getRandomBladeOfGrassJSON	= function( offsetX, width ){
		width	= (typeof width == "undefined") ? 4 : width;	// set default value

		var rndHeight		= (Math.random()-0.5)*2;			// to randomize grass height
		var rndTopEdgeX		= Math.random()*2;					// 
		var rndRefOffset	= Math.random()+1;				// to randomize grass curve by offseting reference points

		var rndDirection	= (Math.random()<0.5)?-1:1;			// to the left or right

		// console.log("rndTopEdgeX:" + rndTopEdgeX + "  rndDirection:" + rndDirection + " rndRefOffset:" + rndRefOffset);

		var jsonStr = {"fillColor":"0xffffff",
							"alpha":"1",
							"closepath":"false",
							"strokeStyle":1,
							"moveTo":{"x":0+offsetX,"y":50},		// the start point is fix
							"quadraticCurveTo": [{
								"x": (width*2)*rndTopEdgeX*rndDirection+offsetX,			// upper edge
								"y": 0-25*rndHeight,
								"ref_x": -10*rndRefOffset*rndDirection+offsetX,
								"ref_y": 25
							}, {
								"x": rndDirection*(width+rndTopEdgeX*2)+offsetX,
								"y": 50,					// fix -> the same as the start point
								"ref_x": -3*rndRefOffset*rndDirection+offsetX,
								"ref_y": 25
							}]
						};
		// var jsonData = jQuery.parseJSON(jsonStr);
		return jsonStr;
	}

namespace.Grass	= Grass;
}
(game || (game = {})));
var game;
