/*
*
*	Example: prototyping - namespaces
*
*/


// this "outer/empty" function is needed becuase the inner functions, variables shouldn't generate into global namespace
(function (namespace) {

	var Bubble	= function ( inX, inY, inColor ){
		this.x	= x;
		this.y	= y;
		this.color	= color;
		this.initSprite();
		this.initShape();
	}


	Bubble.shape	= null;
	Bubble.graphics	= null;

	Bubble.spriteImg	= null;
	Bubble.bmpAnimation	= null;


	var p	= Bubble.prototype;

	p.x		= null;
	p.y		= null;
	p.color	= null;


	// creates a simple circle bubble shape with gradient fill
	p.initShape	= function(){
		this.graphics	= new createjs.Graphics;
		this.graphics.beginRadialGradientFill(["#D1D8F2","#3A5BCB"], [0, 1], 20, 20, 0, 0, 0, 50);
		this.graphics.setStrokeStyle(3);
		this.graphics.beginLinearGradientStroke(["#8B9AE2","#E7EAF8"], [0, 1], 0, 0, 60, 60);
		this.graphics.drawCircle(30, 30, 30);


		this.shape	= new createjs.Shape(this.graphics);
		this.shape.x	= 20;
		this.shape.y	= 50;
		this.shape.alpha=0.6;

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
		
		this.bmpAnimation.name		= "monster1";
		this.bmpAnimation.direction	= 270;
		this.bmpAnimation.directionPi	= this.bmpAnimation.direction/180*Math.PI;	// degree to radian
		this.bmpAnimation.speed		= 1;
		this.bmpAnimation.x			= STAGE_WIDTH/2;
		this.bmpAnimation.y			= STAGE_HEIGHT;
	
		// have each monster start at a specific frame
		this.bmpAnimation.currentFrame = 0;
		this.bmpAnimation.alpha	= 0.6;
		
	}



	//called if there is an error loading the image (usually due to a 404)
	p.handleImageError	= function (e) {
		alert("Error Loading Image : " + e.target.src);
	}

	p.handleImageLoad	= function (e) {
	    this.show();
	}




// connect the Bubble to the game namespace
namespace.Bubble	= Bubble;

}
// This line will generate the game namespace if it doesn't exists.
(game || (game	= {})));
var game;

