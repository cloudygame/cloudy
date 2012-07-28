/*
*
*	Example: prototyping - namespaces
*
*/


// this "outer/empty" function is needed becuase the inner functions, variables shouldn't generate into global namespace
(function (namespace) {

	var Bubble	= function ( inX, inY, inColor ){
		this.initialize( inX, inY, inColor );
		this.spriteInit();
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

	Bubble.spriteImg	= null;
	Bubble.bmpAnimation	= null;


	// 92px széles
	p.spriteInit	= function(){
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
		
		this.bmpAnimation.name = "monster1";
		this.bmpAnimation.direction = 90;
		this.bmpAnimation.vX = 1;
		this.bmpAnimation.x = STAGE_WIDTH/2;
		this.bmpAnimation.y = STAGE_HEIGHT;
	
		// have each monster start at a specific frame
		this.bmpAnimation.currentFrame = 0;
		
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

