/*
*	Common used functions
*/
(function(namespace){

var Common	= new Object;

/*	Disallow user selection (very annoying when you use swipe)
	using: 
	// disable selection on #theDiv object
	$('#theDiv').disableSelection(); 
*/
jQuery.fn.extend({ 
        disableSelection : function() { 
                return this.each(function() { 
                        this.onselectstart = function() { return false; }; 
                        this.unselectable = "on"; 
                        jQuery(this).css('user-select', 'none'); 
                        jQuery(this).css('-o-user-select', 'none'); 
                        jQuery(this).css('-moz-user-select', 'none'); 
                        jQuery(this).css('-khtml-user-select', 'none'); 
                        jQuery(this).css('-webkit-user-select', 'none'); 
                }); 
        } 
}); 
	

/*
*	random color generator for testing
*/
Common.getRandomColor	= function ( type ) {
	var letters = '0123456789ABCDEF'.split('');

	if (type=="HTML"){
		var color = '#';		// return with HTML format
	}else{
		var color = '0x';		// return with RGB format
	}
	for (var i = 0; i < 6; i++ ) {
	color += letters[Math.round(Math.random() * 15)];
	}
	return color;
}


/*
*	log text to console
*/
Common.log	= function ( text ){
	if(globals.DEBUG){
		var currD	= new Date;
		var currT	= currD.getTime();
		var elapsedTimePrgStart	= (currT-programStartTime)/1000;
		var elapsedTimeLastLog	= (currT-lastLogT)/1000;

		console.log( elapsedTimePrgStart + 's: ' + text + ' -- Elõzõ log óta eltelt: ' + elapsedTimeLastLog +'s');

		lastLogT	= currT;
	}
}



/* It draws quadratic only lines from input JSON into the given easel Graphics
*
*	JSON format:
*	- moveTo: start point
*	- quadraticCurveTo: quadratic point
*		* x
*		* y
*		* ref_x
*		* ref_y
*	- closepath: true/false (true by default)
*
*	offsetX: optional
*/
Common.drawQuadraticJson	= function( graphics, inJson, inOffsetX, inOffsetY ){

		var offsetX	= (typeof inOffsetX=="undefined") ? 0 : inOffsetX;
		var offsetY	= (typeof inOffsetY=="undefined") ? 0 : inOffsetY;

		graphics.moveTo(inJson["moveTo"]["x"]+offsetX, inJson["moveTo"]["y"]+offsetY);

		for (var i=0; i<inJson.quadraticCurveTo.length; i++){
			graphics.quadraticCurveTo( 
				inJson["quadraticCurveTo"][i]["ref_x"]+offsetX,
				inJson["quadraticCurveTo"][i]["ref_y"]+offsetY,
				inJson["quadraticCurveTo"][i]["x"]+offsetX,
				inJson["quadraticCurveTo"][i]["y"]+offsetY
				);
		}

		if (inJson["closepath"]==true || !("closepath" in inJson )){
			graphics.closePath();
		}
		return graphics;
}


/* 
*	adjust the shape to the upper left corner (remove whitespace)
*/
Common.getAdjustedQuadraticJson	= function( inJson ){

		upperLeftPoint	= this.getMinXYPointQuadraticJson( inJson );

		inJson["moveTo"]["x"]	= inJson["moveTo"]["x"] - upperLeftPoint.x;
		inJson["moveTo"]["y"]	= inJson["moveTo"]["y"] - upperLeftPoint.y;

		for (var i=0; i<inJson.quadraticCurveTo.length; i++){
			inJson["quadraticCurveTo"][i]["ref_x"]		= inJson["quadraticCurveTo"][i]["ref_x"] - upperLeftPoint.x;
			inJson["quadraticCurveTo"][i]["ref_y"]		= inJson["quadraticCurveTo"][i]["ref_y"] - upperLeftPoint.y;
			inJson["quadraticCurveTo"][i]["x"]			= inJson["quadraticCurveTo"][i]["x"] - upperLeftPoint.x;
			inJson["quadraticCurveTo"][i]["y"]			= inJson["quadraticCurveTo"][i]["y"] - upperLeftPoint.y;
		}

		return inJson;
}


/*
*	returns the upper left point from the json coords
*/
Common.getMinXYPointQuadraticJson	= function( inJson ){

		var minX	= inJson["moveTo"]["x"];
		var maxX	= inJson["moveTo"]["x"];
		var minY	= inJson["moveTo"]["y"];
		var maxY	= inJson["moveTo"]["y"];

		for (var i=0; i<inJson.quadraticCurveTo.length; i++){
			var x		= Number(inJson["quadraticCurveTo"][i]["x"]);
			var y		= Number(inJson["quadraticCurveTo"][i]["y"]);
			maxX	= maxX < x ? x : maxX;
			maxY	= maxY < y ? y : maxY;
			minX	= minX > x ? x : minX;
			minY	= minY > y ? y : minY;
		}

		var upperLeftPoint	= new createjs.Point( minX, minY );
		return upperLeftPoint;
}

/*
*	returns the bottom right point from the json coords
*/
Common.getMaxXYPointQuadraticJson	= function( inJson ){

		var minX	= inJson["moveTo"]["x"];
		var maxX	= inJson["moveTo"]["x"];
		var minY	= inJson["moveTo"]["y"];
		var maxY	= inJson["moveTo"]["y"];

		for (var i=0; i<inJson.quadraticCurveTo.length; i++){
			var x		= Number(inJson["quadraticCurveTo"][i]["x"]);
			var y		= Number(inJson["quadraticCurveTo"][i]["y"]);
			maxX	= maxX < x ? x : maxX;
			maxY	= maxY < y ? y : maxY;
			minX	= minX > x ? x : minX;
			minY	= minY > y ? y : minY;
		}

		var bottomRightPoint	= new createjs.Point( maxX, maxY );
		return bottomRightPoint;
}


namespace.Common	= Common;
}
(game || (game = {})));
var game;