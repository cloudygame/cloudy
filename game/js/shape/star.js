/*
*
*/

(function(namespace){

	var Star	= function(){
		this.scaleX		= 1.8;
		this.scaleY		= 1.4;
		this.starArr	= new Array();
		this.initialize();
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

		for ( i=0; i<starCoordsArr.length;i++){
			var x		= Number(starCoordsArr[i].x)*Number(this.scaleX);
			var y		= Number(starCoordsArr[i].y)*Number(this.scaleY);
			var size	= Number(starCoordsArr[i].size);
			maxX	= maxX < x ? x : maxX;
			maxY	= maxY < y ? y : maxX;
			minX	= minX > x ? x : minX;
			minY	= minY > y ? y : minY;

			angle	= Math.round( Math.random()*360 );
			g.beginFill( createjs.Graphics.getRGB( '0xFFFF64', 1 ) );
			// g.setStrokeStyle(1);
			// g.beginStroke('#fff');
			g.drawPolyStar (  x, y , size*2 , 7 , 2 , 0 );

			g.endStroke();
		}

		var starBoxWidth	= (maxX-minX);
		// console.log( maxX + ":" + maxY + " : " + minX + ":" + minY +"::" + ((maxX-minX)/2) + "-----" + starBoxWidth);

		this.shape	= new createjs.Shape(g);
		shape		= this.shape;
		shape.x		= starBoxWidth/2-minX+(STAGE_WIDTH-starBoxWidth) + 500;	// the value 500 is the "shape rotation correction"
		shape.y		= 2000-200;
		shape.regX	= starBoxWidth/2 + minX;
		shape.regY	= 2000;


		console.log( this.shape.regX, this.shape.regY );
		shape.rotation	= -20;		//-2*Math.PI/360*30;
		shape.alpha		= 0;
		// shape.cache( minX, minY, maxX, maxY );

	};



	namespace.Star	= Star;

}(game || (game	= {})));
var game;