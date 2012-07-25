/*
*	Dev branch test
*/

(function(namespace){

	var Sun	= function(){
		this.initialize();
	}
	

	Sun.shape	= null;


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



		// add effects to sun
		var tween	= createjs.Tween.get( this.shape );

		var timeline = new createjs.Timeline();
		timeline.addTween(
					tween.to({rotation:360,x:300,y:0,alpha:0.4},4000, createjs.Ease.linearOut )
					.to({rotation:0, x:600,y:0,alpha:0.8},4000, createjs.Ease.linearOut )
					.to({rotation:360, x:1000,y:100,alpha:1},4000, createjs.Ease.linearOut )
			);

		tween.loop	= true;
	};



	namespace.Sun	= Sun;

}(game || (game	= {})));
var game;