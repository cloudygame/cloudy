/*
*
*/

(function(namespace){

	var Star	= function(){
		this.scaleX		= 1.8;
		this.scaleY		= 1.4;
		this.starArr	= new Array();
		this.initialize();
		this.drawConstellationLines();
	}
	

	Star.starArr	= null;
	Star.shape		= null;
	Star.scaleX		= null;
	Star.scaleY		= null;


	Star.prototype.initialize = function() {
		var g		= new createjs.Graphics;
		var maxX	= 0;
		var maxY	= 0;
		var minX	= 1000;
		var minY	= 1000;

		game.Common.log( "Start star drawing" );
		g.beginFill( createjs.Graphics.getRGB( '0xFFFF64', 1 ) );

		for ( i=0; i<starCoordsArr.length;i++){
			var x		= Number(starCoordsArr[i].x)*Number(this.scaleX);
			var y		= Number(starCoordsArr[i].y)*Number(this.scaleY);
			var size	= Number(starCoordsArr[i].size);
			maxX	= maxX < x ? x : maxX;
			maxY	= maxY < y ? y : maxX;
			minX	= minX > x ? x : minX;
			minY	= minY > y ? y : minY;

			angle	= Math.round( Math.random()*360 );
			// g.setStrokeStyle(1);
			// g.beginStroke('#fff');
			g.drawPolyStar (  x, y , size*2 , 7 , 2 , 0 );

			// g.endStroke();
		}

		var starBoxWidth	= (maxX-minX);
		// console.log( maxX + ":" + maxY + " : " + minX + ":" + minY +"::" + ((maxX-minX)/2) + "-----" + starBoxWidth);

		this.shape	= new createjs.Shape(g);
		shape		= this.shape;
		shape.x		= starBoxWidth/2-minX+(globals.STAGE_WIDTH-starBoxWidth) + 500;	// the value 500 is the "shape rotation correction"
		shape.y		= 2000-200;
		shape.regX	= starBoxWidth/2 + minX;
		shape.regY	= 2000;


		game.Common.log( "end star drawing" );
		shape.rotation	= -20;		//-2*Math.PI/360*30;
		shape.alpha		= 0;
		// shape.cache( minX, minY, maxX, maxY );

	};



	Star.prototype.drawConstellationLines	= function(){
		var g		= this.shape.graphics;

		game.Common.log( "Start star Line drawing" );

		g.setStrokeStyle(1);
		g.beginStroke('#fff');

		for ( i=0; i<starLineCoordsArr.length;i++){
			var x1		= (starLineCoordsArr[i].x1)*(this.scaleX);
			var y1		= (starLineCoordsArr[i].y1)*(this.scaleY);
			var x2		= (starLineCoordsArr[i].x2)*(this.scaleX);
			var y2		= (starLineCoordsArr[i].y2)*(this.scaleY);

			g.moveTo( x1, y1 );
			g.lineTo( x2,y2 );

			// g.endStroke();
		}

		game.Common.log( "End star Line drawing" );
	}


	namespace.Star	= Star;

}(game || (game	= {})));
var game;