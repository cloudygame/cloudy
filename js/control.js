/*
*
*/

(function(namespace){

	var Control	= function(){
		this.initialize();
	}

	Control.shape	= null;


	Control.prototype.initialize	= function(){
		g	= new createjs.Graphics();
		s	= new createjs.Shape(g);
		this.shape	= s;
		s.alpha	= 1;

	}


	Control.prototype.drawControlBar	= function(){
		g	= this.shape.graphics;
		g.beginFill('#fff');
		g.setStrokeStyle(3);
		g.beginStroke('#555');

		g.moveTo( 3, globals.STAGE_HEIGHT-3 );
		g.lineTo( globals.STAGE_WIDTH-3, globals.STAGE_HEIGHT-3 );
		g.lineTo( globals.STAGE_WIDTH-3, globals.STAGE_HEIGHT-30 );
		g.lineTo( globals.STAGE_WIDTH/2, globals.STAGE_HEIGHT-3 );
		g.lineTo( 3, globals.STAGE_HEIGHT-30 );

		g.closePath();
	}

	// draw a vertical bar
	Control.prototype.draw2	= function( mouseX ){
		g	= this.shape.graphics;
		g.clear();
		g.beginFill('#fff');
		g.setStrokeStyle(2);
		g.beginStroke('#555');

		if ( mouseX<globals.STAGE_WIDTH/2 ){
			var toX	= 0;
		}else{
			var toX	= globals.STAGE_WIDTH;
		}
		
		g.beginLinearGradientFill([createjs.Graphics.getRGB('0x0000ff',0.2),createjs.Graphics.getRGB('0xff0000',0.8)], [0, 1], Math.round(globals.STAGE_WIDTH/2) , globals.STAGE_HEIGHT-5 , toX , globals.STAGE_HEIGHT-5  );
		g.rect( globals.STAGE_WIDTH/2,  globals.STAGE_HEIGHT-15, mouseX-globals.STAGE_WIDTH/2, globals.STAGE_HEIGHT-3 );

	}


	namespace.Control	= Control;

}(game || (game	= {})));
var game;