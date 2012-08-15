/*
*
*/

(function(namespace){

	var Control	= function(){
		this.initialize;
	}


	Control.prototype.initialize	= function(){

	}



	Control.prototype.drawControlBar	= function(){
		g	= new createjs.Graphics();
		g.beginFill('#fff');
		g.setStrokeStyle(3);
		g.beginStroke('#555');

		g.moveTo( 3, globals.STAGE_HEIGHT-3 );
		g.lineTo( globals.STAGE_WIDTH-3, globals.STAGE_HEIGHT-3 );
		g.lineTo( globals.STAGE_WIDTH-3, globals.STAGE_HEIGHT-30 );
		g.lineTo( globals.STAGE_WIDTH/2, globals.STAGE_HEIGHT-3 );
		g.lineTo( 3, globals.STAGE_HEIGHT-30 );

		g.closePath();
		s	= new createjs.Shape(g);
		s.alpha	= 0.7;
		return s;
	}


	namespace.Control	= Control;

}(game || (game	= {})));
var game;