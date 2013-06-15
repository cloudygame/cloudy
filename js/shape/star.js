/*
*
*/

(function(namespace){

	var Star	= function(){
		this.scaleX		= 2;
		this.scaleY		= 1.3;

		this.maxX	= 0;
		this.maxY	= 0;
		this.minX	= 1000;
		this.minY	= 1000;

		this.starArr	= new Array();

		// generate shapes
		game.Common.log( "Start star drawing" );
		this.starShape	= this.drawStars();
		game.Common.log( "end star drawing - start constellation line" );

		game.Common.log( "end star drawing - start constellation line" );
		this.consShape			= this.drawConstellationLines();
		this.consShape.alpha	= 0;
		game.Common.log( "end constellation line drawing" );

		this.moonShape	= this.drawMoon();


		var starBoxWidth	= (this.maxX-this.minX);
		game.Common.log( "max X:Y=" + this.maxX + ":" + this.maxY + " min X:Y= " + this.minX + ":" + this.minY +"::" + ((this.maxX-this.minX)/2) + "-----" + starBoxWidth);

		// add shapes to a new container
		this.container		= new createjs.Container();
		this.container.addChild(this.starShape);
		this.container.addChild(this.consShape);
		this.container.addChild(this.moonShape);
		this.container.x		= starBoxWidth/2-this.minX+(globals.STAGE_WIDTH-starBoxWidth) + 500;	// the value 500 is the "this.container rotation correction"
		this.container.y		= 3000-120;
		this.container.regX	= starBoxWidth/2 + this.minX;
		this.container.regY	= 3000;

		this.container.rotation	= -12;		//-2*Math.PI/360*30;
		this.container.alpha	= 0;


		// cache testing
		// shape.cache( this.minX, this.minY, this.maxX, this.maxY );


	}
	

	Star.starArr	= null;
	Star.starShape	= null;
	Star.consShape	= null;
	Star.moonShape	= null;
	Star.container	= null;
	Star.scaleX		= null;
	Star.scaleY		= null;
	Star.maxX		= null;
	Star.maxY		= null;
	Star.minX		= null;
	Star.minY		= null;


	Star.prototype.drawStars = function() {
		var g		= new createjs.Graphics;

		g.beginFill( createjs.Graphics.getRGB( '0xFFFF64', 1 ) );

		for ( i=0; i<starCoordsArr.length;i++){
			var x		= Number(starCoordsArr[i].x)*Number(this.scaleX);
			var y		= Number(starCoordsArr[i].y)*Number(this.scaleY);
			var size	= Number(starCoordsArr[i].size);
			this.maxX	= this.maxX < x ? x : this.maxX;
			this.maxY	= this.maxY < y ? y : this.maxY;
			this.minX	= this.minX > x ? x : this.minX;
			this.minY	= this.minY > y ? y : this.minY;

			angle	= Math.round( Math.random()*360 );
			g.drawPolyStar (  x, y , size*2 , 7 , 2 , 0 );

		}

		var shape	= new createjs.Shape(g);

		return shape;

	};



	Star.prototype.drawConstellationLines	= function(){

		var g			= new createjs.Graphics();

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

		var shape	= new createjs.Shape(g);
		return shape;
	}


	Star.prototype.drawMoon	= function(){

		var g			= new createjs.Graphics();

		g.setStrokeStyle(2);
		g.beginStroke('#ff0');
		g.beginFill( createjs.Graphics.getRGB( '0xFFFF00', 1 ) );

		var x = 1200;
		var y = 100;

		var moonJSON	= {"fillColor":"blue","alpha":"0.5","strokeStyle":6,"moveTo":{"x":105,"y":220},"quadraticCurveTo":[{"ref_x":7,"ref_y":163,"x":102,"y":98},{"ref_x":69,"ref_y":166,"x":107,"y":220}]};
		moonJSON	= game.Common.getAdjustedQuadraticJson( moonJSON );
		game.Common.drawQuadraticJson( g, moonJSON, x,y)

		var shape	= new createjs.Shape(g);
		shape.scaleX	= 0.8;
		shape.scaleY	= 0.8;

		return shape;

	}


	namespace.Star	= Star;

}(game || (game	= {})));
var game;