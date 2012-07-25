/*
*
*	Example: prototyping - namespaces
*
*/


$(document).ready( function (){

	// alert('fut');
	var testBubble	= new game.Bubble( 30, 30, game.common.getRandomColor() );

});

// initialize the namespace
// var game = game || {};


// this "outer/empty" function is needed becuase the inner functions, variables shouldn't generate into global namespace
(function (namespace) {

	var Bubble	= function ( inX, inY, inColor ){
		this.initialize( inX, inY, inColor );
	}

	var p	= Bubble.prototype;

	p.x		= null;
	p.y		= null;
	p.color	= null;

	p.initialize	= function( x, y, color ){
		this.x	= x;
		this.y	= y;
		this.color	= color;

		// alert(this.color);
	}


	p.create	= function (){

	}



// connect the Bubble to the game namespace
game.Bubble	= Bubble;

}
// This line will generate the game namespace if it doesn't exists.
(game || (game	= {})));
var game;

