	
/*
* Global variables
*/
	
	// Bubble parameters
	var DEFAULT_BUBBLE_X		= 150;
	var DEFAULT_BUBBLE_Y		= 150;
	var DEFAULT_BUBBLE_RADIUS	= 30;
	
	// Layers, stages
	var layerCloud;		// normal cloud layer
	var layerBgCloud;	// background layer
	var stage;
	
	var STAGE_WIDTH				= 900;
	var STAGE_HEIGHT			= 400;
	var CLOUD_COLOR_CONTOUR		= "#D8EDF2";
	var CLOUD_COLOR_FILL		= "lightgray";
	
	// Cloud parameters
	var cloudArr				= new Array();
	var cloudCount				= 3;
	
	// Bubbles
	var bubbleArr				= new Array();
	
	// development (temporary) parameters
	var	sebesseg_oszto			= 2;
	var	irany_szorzo			= 1;
	
	var programStartDate		= new Date;
	var programStartTime		= programStartDate.getTime();
	var lastLogT				= programStartTime;
	
	// for measuring FPS
	var currDateFPS				= new Date;
	var currTimeFPS				= currDateFPS.getTime();
	

/*
*	the main function
*/
$(document).ready( function() {

	/* Get the canvas and set the its size.
	*		(The size setting works only this way. why??)
	*/
	var canvas		= $('#container').get(0);
	canvas.width	= STAGE_WIDTH;
	canvas.height	= STAGE_HEIGHT;
//	$('#container').css('width','900px');	// this solution would be nice but the size setting from css is buggy
//	$('#container').css('height','300px');

	/* A stage is the root level Container for a display list. Each time its tick method is called, it will render its display list to its target canvas. */
	stage		= new createjs.Stage(canvas);
	layerCloud	= new createjs.Container();

	game.main.initClouds();
	// stage.enableMouseOver();

	var sun	= new game.Sun();
	stage.addChild(sun.shape);


	game.main.havacska();

	// BubbleTest
	bubbleArr[0]	= new game.Bubble( 30, 30, game.common.getRandomColor() );
	// the test bubble is ellipsoid a bit ...
	bubbleArr[0].bmpAnimation.scaleX	= 0.7;

	var	i	= 0;
    stage.addChild(bubbleArr[i].bmpAnimation);


	// set the global ticker which used by tween.js and easeljs animations
	createjs.Ticker.setFPS(30);
	createjs.Ticker.addListener(tick);

}
)


//function called by the Tick instance at a set interval
function tick()
{

	$('#FPS').val('FPS: '+ createjs.Ticker.getMeasuredFPS() );

	var	i	= 0;

    // Hit testing the screen width, otherwise our sprite would disappear
    if (bubbleArr[i].bmpAnimation.x >= STAGE_WIDTH - 16) {
        // We've reached the right side of our screen
        // We need to walk left now to go back to our initial position
        bubbleArr[i].bmpAnimation.direction = -90;
    }

    if (bubbleArr[i].bmpAnimation.x < 16) {
        // We've reached the left side of our screen
        // We need to walk right now
        bubbleArr[i].bmpAnimation.direction = 90;
    }

    // Moving the sprite based on the direction & the speed
    if (bubbleArr[i].bmpAnimation.direction == 90) {
        bubbleArr[i].bmpAnimation.x += bubbleArr[i].bmpAnimation.vX;
    } else {
        bubbleArr[i].bmpAnimation.x -= bubbleArr[i].bmpAnimation.vX;
    }


	//re-render the stage
	stage.update();
}




/*
*	The main object
*/


(function(namespace){
	var main	= new Object;

	/*
	*	first time cloud generating
	*/
	main.initClouds	= function (){

		var offset	= cloudArr.length;

		// generate (draw) clouds from cloudArr
		for(var i=offset;i<(cloudCount+offset);i++){
			x			= Math.round( STAGE_WIDTH/cloudCount )*i;	// x position (equal cloud distance)
			y			= Math.round( (Math.random()-0.5)*40 );		// random y position (offset)
			color		= game.common.getRandomColor();							// generate random color
			alpha		= Math.random();							// alpha
			scaleRnd	= (Math.random())/2+0.5;					// random scaling - maximum +-25%

			var cloud 	= new game.Cloud( x, y, color, alpha, scaleRnd );

			// cloud.shape	= cloud.create();
			cloud.addShadow();

			layerCloud.addChild(cloud.shape);

			//store clouds in a global array too
			cloudArr[i]	= cloud;
	//		cloud.show();
		}

		// start the effects on every cloud
		var tweenArr	= Array();
		var tmpX,tmpY		= 0;
		for(var i=offset;i<(cloudCount+offset);i++){
			tmpX		= Math.round((Math.random())*1000)-200;
			tmpY		= Math.round((Math.random()-0.2)*10);
			tmpAlpha	= Math.random();
			tweenArr[i] = createjs.Tween.get( cloudArr[i].shape );
			tweenArr[i].to({x:170,y:50,alpha:0.1},4000, createjs.Ease.elasticInOut ).to({x:tmpX, y:tmpY, alpha:0.9},4000, createjs.Ease.bounceInOut).to( {rotation:360}, 4000, createjs.Ease.elasticInOut );


			// show information about cloud
			cloudArr[i].shape.onClick	= function(mouseEvent){ 
					tmpStr	= " x:" + Math.round(this.x) + " y:" + Math.round(this.y) +
								" \n skewX:" + this.skewX  + "  skewY:" + this.skewY +
								" \n regX:" + this.regX  + "  regY:" + this.regY + 
								" \n alpha: " + this.alpha + 
								" \n color: "
								;
					alert( tmpStr ) 
				};




			// add simple drag'n drop to every cloud shape
			(function (target){
				cloudArr[i].shape.onPress	= function(evt){
					var offset = {x:target.x-evt.stageX, y:target.y-evt.stageY};

					// add a handler to the event object's onMouseMove callback
					// this will be active until the user releases the mouse button:
					evt.onMouseMove = function(ev) {
						target.x = ev.stageX+offset.x;
						target.y = ev.stageY+offset.y;
						// indicate that the stage should be updated on the next tick:
						update = true;
					}
				}
				cloudArr[i].shape.onMouseOver = function() {
					target.scaleX = target.scaleY = target.scale*1.2;
					update = true;
				}
				cloudArr[i].shape.onMouseOut = function() {
					target.scaleX = target.scaleY = target.scale;
					update = true;
				}
			})(cloudArr[i].shape)

		}

		stage.addChild(layerCloud);

		stage.update();

	}	// end main.initClouds



	main.havacska	= function(){
		for(var i=0;i<100;i++){

			var g		= new createjs.Graphics;
			var x		= Math.round(Math.random()*1000);
			// var y		= Math.round(Math.random()*500);
			var y		= -10;
			var size	= Math.round(Math.random()*10)+1;
			var wait	= Math.round(Math.random()*3000);
			var time	= Math.round( 10000/(size/2) );		// minel nagyobb, annal gyorsabban essen le

			var randomYOffset	= Math.round(Math.random()*-30);


			g.beginFill( createjs.Graphics.getRGB( '0xFFFFFF', 1/size ) );
			g.setStrokeStyle(1);
			g.beginStroke('#fff');
			g.drawCircle( 0, 0, size );
			g.endStroke();


			var s	= new createjs.Shape(g);
			s.x	= x;
			s.y	= y;
			s.cache(-1*size,-1*size,size*2,size*2);

			tween = createjs.Tween.get( s );
			tween.wait(wait).to({y:(400+randomYOffset)},time, createjs.Ease.bounceOut );

			tween.loop=true;

			stage.addChild(s);
		}
	}



	/*
	*	Cache testing:
	*	Add cache to every cloud shape;
	*	Comment: The caching will be slow if the cached graphic is too big. 
	*/
	main.turnOnCache	= function( sizeX, sizeY ){
		// set the defult size
		if (sizeX==0){
			sizeX=300;
			sizeY=180;
		}

		for  ( var i=0; i<cloudArr.length; i++){
			//turn on the cache
			cloudArr[i].shape.cache(130,110,sizeX,sizeY);					// NA EZÉRT SZÍVÁS A DEFAULT FELHŐ OFFSET
		}
	}


	main.turnOffCache	= function(){

		for  ( var i=0; i<cloudArr.length; i++){
			//turn on the cache
			cloudArr[i].shape.uncache();
		}
	}


namespace.main	= main;
}(game || (game = {})));
var game;