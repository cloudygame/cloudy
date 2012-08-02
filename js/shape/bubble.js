/*
*
*	Example: prototyping - namespaces
*
*/


// this "outer/empty" function is needed becuase the inner functions, variables shouldn't generate into global namespace
(function (namespace) {

	var Bubble	= function ( inX, inY, inColor ){
		this.x				= inX;
		this.y				= inY;
		this.color			= color;
		this.directionAngle	= 270;			// default
		this.speed			= 1;

		
		var graphics		= new createjs.Graphics;
		this.shape			= new createjs.Shape(graphics);

		this.scaledRadius	= 30;

		// bubble sprite test:
		// this.initSprite();

		this.initShape();
	}


	Bubble.scaledRadius	= null;
	Bubble.shape		= null;
	Bubble.graphics		= null;
	
	Bubble.spriteImg	= null;
	Bubble.bmpAnimation	= null;
	Bubble.directionAngle= null;
	Bubble.speed		= null;


	var p	= Bubble.prototype;

	p.x		= null;
	p.y		= null;
	p.color	= null;


	// creates a simple circle bubble shape with gradient fill
	p.initShape	= function(){
		var graphics	= this.shape.graphics;
		graphics.beginRadialGradientFill(["#D1D8F2","#3A5BCB"], [0, 1], 20, 20, 0, 0, 0, 50);
		graphics.setStrokeStyle(3);
		graphics.beginLinearGradientStroke(["#8B9AE2","#E7EAF8"], [0, 1], 0, 0, 60, 60);
		graphics.drawCircle(0, 0, this.scaledRadius);

		this.shape.alpha	= 0.5;
		this.shape.x		= globals.STAGE_WIDTH/2-200;
		this.shape.y		= globals.STAGE_HEIGHT-20;

	}


	p.move	= function(){
	    // calculate the offset vector
		var radian	= this.directionAngle * 0.0174533;		// (Math.PI/180)
		var radius	= this.speed*4;
		var moveX	= Math.round(Math.cos(radian) * radius);
		var moveY	= Math.round(Math.sin(radian) * radius);

		this.shape.x		+= moveX;
		this.shape.y		+= moveY;
	}


	// creates a sprite bubble
	p.initSprite	= function(){
		this.spriteImg	= new Image();
		this.spriteImg.onload	= p.handleImageLoad;
		this.spriteImg.onerror	= p.handleImageError;
		this.spriteImg.src		= "img/bubbletest2.png";

		// create spritesheet and assign the associated data.

		this.spriteSheet = new createjs.SpriteSheet({
			// image to use
			images: [this.spriteImg],
			// width, height & registration point of each sprite
			frames: {width: 92, height: 60, regX: 32, regY: 32}, 
			animations: {

				spin: { 
						frames:[0,1,2,3,4,5,6],
						next:'respin',
						frequency: 2		// set the animation speed
					},
				// test only - revert spin
				respin: { 
						frames:[6,5,4,5,6],
						next:'spin',
						frequency: 2		// set the animation speed
					}
			},
		});


		// create a BitmapAnimation instance to display and play back the sprite sheet:
		this.bmpAnimation = new createjs.BitmapAnimation(this.spriteSheet);
		
		// start playing the first sequence:
		this.bmpAnimation.gotoAndPlay("spin"); //animate
		
		// set up a shadow. Note that shadows are ridiculously expensive. You could display hundreds
		// of animated rats if you disabled the shadow.
		this.bmpAnimation.shadow = new createjs.Shadow("#454", 33, 125, 41);
		
		this.bmpAnimation.name	= "monster1";
		this.bmpAnimation.x		= globals.STAGE_WIDTH/2;
		this.bmpAnimation.y		= globals.STAGE_HEIGHT;
	
		// have each monster start at a specific frame
		this.bmpAnimation.currentFrame = 0;
		this.bmpAnimation.alpha	= 0.6;
		
		// the test bubble image is ellipsoid a bit ... khmm
		this.bmpAnimation.scaleX	= 0.7;
	}



	//called if there is an error loading the image (usually due to a 404)
	p.handleImageError	= function (e) {
		alert("Error Loading Image : " + e.target.src);
	}

	p.handleImageLoad	= function (e) {
	    this.show();
	}


	// p.getCenterX	= function(){
	// 	var centerX = this.shape.x+this.scaledRadius;
	// 	return centerX;
	// }

	// p.getCenterY	= function(){
	// 	var centerY = this.shape.y+this.scaledRadius;
	// 	return centerY;
	// }



// connect the Bubble to the game namespace
namespace.Bubble	= Bubble;

}
// This line will generate the game namespace if it doesn't exists.
(game || (game	= {})));
var game;

