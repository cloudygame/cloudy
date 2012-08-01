/*
*	This file contains the shape creating and effecting functions.
*/

/*********************************************************************
*
*		OBJECTS
*
*/


(function (namespace) {

	/*
	*	the Cloud object and constructor
	*/
	var Cloud	= function( inX,inY, inFillColor, inAlpha, inScaleRnd ){
		// this.maxX		= 0;
		// this.maxY		= 0;
		// this.minX		= 1000;
		// this.minY		= 1000;	

		this.fillColor	= inFillColor;
		this.scaleRnd	= inScaleRnd;
		this.initialize( inX,inY, inFillColor, inAlpha, inScaleRnd );
	}

	// object variables
	Cloud.lastX			= null;		// last x position for drag n' drop
	Cloud.lastY			= null;		// last y position for drag n' drop
	Cloud.fillColor	= 0;
	// Cloud.alpha		= 0;
	Cloud.scaleRnd	= 0;			// to the scale for size randomizing
	Cloud.shape		= null;			// generated after the initialize()
	Cloud.maxX		= null;
	Cloud.maxY		= null;
	Cloud.minX		= null;
	Cloud.minY		= null;



	var	p	= Cloud.prototype; 

	/*
	*	draw a new cloud from JSON data and return with a Shape object
	*/
	p.initialize	= function ( inX,inY, inFillColor, inAlpha, inScaleRnd  ){

		// load data from JSON
		var jsonStr = '{"fillColor":"'+inFillColor+'","alpha":"'+inAlpha+'","strokeStyle":6,"moveTo":{"x":140,"y":200},"quadraticCurveTo":[{"x":135,"y":155,"ref_x":180,"ref_y":150},{"x":220,"y":110,"ref_x":260,"ref_y":130},{"x":300,"y":100,"ref_x":340,"ref_y":130},{"x":390,"y":125,"ref_x":400,"ref_y":170},{"x":440,"y":190,"ref_x":420,"ref_y":230},{"x":420,"y":270,"ref_x":380,"ref_y":270},{"x":340,"y":290,"ref_x":300,"ref_y":270},{"x":260,"y":290,"ref_x":220,"ref_y":270},{"x":185,"y":275,"ref_x":170,"ref_y":250},{"x":185,"y":275,"ref_x":170,"ref_y":250},{"x":130,"y":240,"ref_x":140,"ref_y":200}]}';
		var cloudData = jQuery.parseJSON(jsonStr);

		// adjust cloud to the upper left corner
		cloudData	= game.Common.getAdjustedQuadraticJson( cloudData );

		var cloudGraphics	= new createjs.Graphics();
		cloudGraphics	= this.drawQuadraticJson(cloudGraphics, cloudData);


		/*
		*	Doc: A Shape allows you to display vector art in the display list. It composites a Graphics instance which exposes all of the vector drawing methods. 
		*	The Graphics instance can be shared between multiple Shape instances to display the same vector graphics with different positions or transforms.
		*/

		// Peti: The graphics object exists only virtual. We cannot draw it onto the canvas in normal way. (It's possible but not a good idea.)
		// So we need to add it to a new createjs.Shape.
		var cloudShape	= new createjs.Shape(cloudGraphics);
		cloudShape.x	= inX;
		cloudShape.y	= inY;
		cloudShape.scaleX	= inScaleRnd;
		cloudShape.scaleY	= inScaleRnd;

		this.shape	= cloudShape;


		// ** TESTING: 
		this.addShadow();
		this.testGetDataOnDoubleClick();
		// Multiple drawing methods are possible in the same Graphics instance.
		// I added some random snow to the cloud graphics in this example:
		// cloudGraphics	= this.testDrawSnow(cloudGraphics);
		this.drawTestBoundBox();
	}



	/*
	*	this function generates shadow around the cloud shape
	*	in:		cloud shape
	*	return: -
	*/
	p.addShadow	= function (){
		var	shadow	= new createjs.Shadow( "gray", 10, 10, 3 );
		this.shape.shadow	= shadow;
	}



	/*
	*	universal quadratic curve drawer function
	*/
	p.drawQuadraticJson	= function( graphics, inJson ){
		// draw out
		// var graphics = new createjs.Graphics();

		// All drawing methods in Graphics return the Graphics instance, so they can be chained together.
		graphics.beginFill( createjs.Graphics.getRGB( inJson["fillColor"], inJson["alpha"]) ).setStrokeStyle(inJson["strokeStyle"]).beginLinearGradientStroke(["#000","#FFF"], [0, 1], 100, 100, 440, 300);

		graphics.moveTo(inJson["moveTo"]["x"], inJson["moveTo"]["y"]);

		for (var i=0; i<inJson.quadraticCurveTo.length; i++){
			graphics.quadraticCurveTo( 
				inJson["quadraticCurveTo"][i]["x"],
				inJson["quadraticCurveTo"][i]["y"],
				inJson["quadraticCurveTo"][i]["ref_x"],
				inJson["quadraticCurveTo"][i]["ref_y"]
				);
		}

		// set the min/max coords of the drawed cloud
		minXY	= game.Common.getMinXYPointQuadraticJson( inJson );
		maxXY	= game.Common.getMaxXYPointQuadraticJson( inJson );
		this.maxX	= maxXY.x;
		this.maxY	= maxXY.y;
		this.minX	= minXY.x;
		this.minY	= minXY.y;

console.log( game.Common.getMaxXYPointQuadraticJson(inJson));
console.log( game.Common.getMinXYPointQuadraticJson(inJson));

		graphics.closePath();
		return graphics;
	}



	// for testing show the outer box
	p.drawTestBoundBox	= function(){
		graphics	= this.shape.graphics;
		graphics.endFill();
		graphics.setStrokeStyle(1);
		graphics.beginStroke('#fff');
		graphics.rect( this.minX, this.minY, this.maxX, this.maxY);
		graphics.beginStroke('#f55');
		graphics.rect( 0, 0, this.maxX, this.maxY);
	}



	// for testing: draw "snow"
	p.testDrawSnow	= function( graphics ){
		var tmpX	= 0;
		var tmpY	= 0;
		for ( var i=0; i<5; i++ ){
			tmpX		= Math.round((Math.random())*400);
			tmpY		= Math.round((Math.random()-0.2)*100);
			tmpAlpha	= Math.random();
			graphics.beginFill( createjs.Graphics.getRGB( game.Common.getRandomColor(), tmpAlpha ) );
			graphics.setStrokeStyle(1);
			graphics.beginStroke('#fff');
			graphics.drawCircle( 135 + tmpX, 300 + tmpY, 5 );
		}

		return graphics;
	}


	// for testing: show information about cloud
	p.testGetDataOnDoubleClick	= function(){
		this.shape.onDoubleClick	= function(mouseEvent){ 

			var x = mouseEvent.stageX;
    		var y = mouseEvent.stageY;
			for (var i=0; i<cloudArr.length; i++){
				if (cloudArr[i].shape===this){
					tmpStr	= " x:" + Math.round(this.x) + " y:" + Math.round(this.y) +
						" \n skewX:"	+ this.skewX	+ "  skewY:" + this.skewY +
						" \n regX:"		+ this.regX		+ "  regY:" + this.regY + 
						" \n alpha: "	+ this.alpha	+ 
						" \n color: "	+ cloudArr[i].fillColor;
						;
				}
			}
			alert( tmpStr ) ;
		};
	}



namespace.Cloud	= Cloud;
}
(game || (game = {})));
var game;