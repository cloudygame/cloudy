/*
*	Common used functions
*/
(function(namespace){

var Common	= new Object;


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
	var currD	= new Date;
	var currT	= currD.getTime();
	var elapsedTimePrgStart	= (currT-programStartTime)/1000;
	var elapsedTimeLastLog	= (currT-lastLogT)/1000;
	var callerFunctionName	= arguments.callee.caller.name.toString();

	console.log( elapsedTimePrgStart + 's: ' + callerFunctionName + ' -- ' + text + ' -- Elõzõ log óta eltelt: ' + elapsedTimeLastLog +'s');

	lastLogT	= currT;
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
*/
Common.drawQuadraticJson	= function( graphics, inJson ){

		graphics.moveTo(inJson["moveTo"]["x"], inJson["moveTo"]["y"]);

		for (var i=0; i<inJson.quadraticCurveTo.length; i++){
			graphics.quadraticCurveTo( 
				inJson["quadraticCurveTo"][i]["x"],
				inJson["quadraticCurveTo"][i]["y"],
				inJson["quadraticCurveTo"][i]["ref_x"],
				inJson["quadraticCurveTo"][i]["ref_y"]
				);
		}

		// if (inJson.closepath==true || !("closepath" in inJson ){
			graphics.closePath();
		// }
		return graphics;
}



namespace.Common	= Common;
}
(game || (game = {})));
var game;