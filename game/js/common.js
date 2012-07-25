/*
*	Common used functions
*/
(function(namespace){

var common	= new Object;


/*
*	random color generator for testing
*/
common.getRandomColor	= function ( type ) {
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
common.log	= function ( text ){
	var currD	= new Date;
	var currT	= currD.getTime();
	var elapsedTimePrgStart	= (currT-programStartTime)/1000;
	var elapsedTimeLastLog	= (currT-lastLogT)/1000;
	var callerFunctionName	= arguments.callee.caller.name.toString();

	console.log( elapsedTimePrgStart + 's: ' + callerFunctionName + ' -- ' + text + ' -- Elõzõ log óta eltelt: ' + elapsedTimeLastLog +'s');

	lastLogT	= currT;
}


namespace.common	= common;
}
(game || (game = {})));
var game;