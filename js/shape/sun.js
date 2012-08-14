/*
*
*/

(function(namespace){

	var Sun	= function(){
		this.initialize();
	}
	

	Sun.shape		= null;
	Sun.container	= null;


	Sun.prototype.initialize = function() {
		var g		= new createjs.Graphics;
		var x		= 50;
		var y		= 50;

		g.beginFill( createjs.Graphics.getRGB( '0xFFF946', 1 ) );
		g.setStrokeStyle(3);
		g.beginStroke('#fff');
		g.drawCircle( 0, 0, 30 );
		g.endStroke();


		var numberOfLines	= 12;
		var radianOffset	= 2 * Math.PI / numberOfLines;
		var radius			= 40;
		for(var i=0;i<=numberOfLines;i++){
			x	= Math.round(Math.cos(i*radianOffset) * radius);
			y	= Math.round(Math.sin(i*radianOffset) * radius);
			g.drawCircle( x, y, 3 );
			x	= Math.round(Math.cos(i*radianOffset) * (radius+10));
			y	= Math.round(Math.sin(i*radianOffset) * (radius+10));
			g.drawCircle( x, y, 3 );
			x	= Math.round(Math.cos(i*radianOffset) * (radius+20));
			y	= Math.round(Math.sin(i*radianOffset) * (radius+20));
			g.drawCircle( x, y, 3 );
		}

		this.shape	= new createjs.Shape(g);
		this.shape.x	= -20;
		this.shape.y	= 50;

		// add default rotation effect to sun
		var sunTween	= createjs.Tween.get( this.shape );
		sunTween.to({rotation:360},6000).to({rotation:-360},0);
		sunTween.loop	= true;

		// we need a container with offsetted regY for movement (day-night)
		this.container	= new createjs.Container();
		this.container.addChild(this.shape);
		this.container.regY=1000;
		this.container.y=950;
		this.container.rotation=-30;
		this.container.x=globals.STAGE_WIDTH/2;

	};



	namespace.Sun	= Sun;

}(game || (game	= {})));
var game;