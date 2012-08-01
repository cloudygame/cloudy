	
/*
* Global variables
*/
	var game	= {};
	var globals	= {};

	/*
	*	CONSTS
	*/
	globals.DEFAULT_BUBBLE_X		= 150;
	globals.DEFAULT_BUBBLE_Y		= 150;
	globals.DEFAULT_BUBBLE_RADIUS	= 30;
	
	globals.STAGE_WIDTH				= 900;
	globals.STAGE_HEIGHT			= 400;
	
	globals.STOP_TICK_DRAW			= false;	// it stops drawing in tick() (CPU cooling)

	/*
	*	GAME ABLES
	*/

	globals.canvas;		// the Main canvas
	globals.stage;						// Main stage


	// Layers
	globals.layerCloud;		// normal cloud layer
	globals.layerBgCloud;		// background layer
	globals.layerBubble;
	
	// Cloud parameters
	globals.cloudArr				= new Array();
	globals.bgCloudArr				= new Array();
	globals.cloudCount				= 3;
	
	// Bubbles
	globals.bubbleArr				= new Array();
	
	// Grass
	globals.grassArr		= new Array();


	// stage background
	globals.gStageBgGradient;			// graphics obj of the gradient stage background 
	globals.sStageBgGradient;			// shape obj
	globals.StageBackgroundStars;

	// start coordinates when drag occurs
	globals.dragAndDropStartX	= null;
	globals.dragAndDropStartY	= null;


	/*
	*	DEVELOPMENT VARIABLES
	*/	

	// Development: variables for code running time measurement	
	var programStartDate		= new Date;
	var programStartTime		= programStartDate.getTime();
	var lastLogT				= programStartTime;
	
	// for measuring FPS
	var currDateFPS				= new Date;
	var currTimeFPS				= currDateFPS.getTime();




/*
*	the Main function
*/
$(document).ready( function() {

	/* Get the globals.canvas and set the its size.
	*		(The size setting works only this way. why??)
	*/
	globals.canvas		= $('#container').get(0);
	globals.canvas.width	= globals.STAGE_WIDTH;
	globals.canvas.height	= globals.STAGE_HEIGHT;
	//	$('#container').css('width','900px');	// this solution would be nice but the size setting from css is buggy
	//	$('#container').css('height','300px');

	/* A stage is the root level Container for a display list. Each time its tick method is called, it will render its display list to its target globals.canvas. */
	globals.stage		= new createjs.Stage(globals.canvas);


	/*
	* Create layers in proper order
	*/

	// *** Create main layers ***
	globals.layerBackground	= new createjs.Container();
	globals.stage.addChild(globals.layerBackground);

	globals.layerBubble	= new createjs.Container();
	globals.stage.addChild(globals.layerBubble);

	globals.layerCloud	= new createjs.Container();
	globals.stage.addChild(globals.layerCloud);


	// *** Fill the layers ***

	// ** Background **
	globals.sStageBgGradient	= game.Main.initStageBgGradient();
	globals.layerBackground.addChild( globals.sStageBgGradient );

	// stars
    globals.StageBackgroundStars	= new game.Star();
    globals.layerBackground.addChild(globals.StageBackgroundStars.shape);

	var starsTween = createjs.Tween.get( globals.StageBackgroundStars.shape );
	starsTween.to({alpha:1},6000).to({alpha:1,rotation:17},20000);

	// background clouds
	game.Main.initBgCloud();

	// sun
	var sun	= new game.Sun();
	globals.layerBackground.addChild(sun.shape);

	// draw grass
	globals.grassArr[0]	= new game.Grass( 0, globals.STAGE_HEIGHT-60);
	globals.grassArr[0].shape.alpha = 0.6;
	globals.layerBackground.addChild(globals.grassArr[0].shape);

	globals.grassArr[1]	= new game.Grass( 0, globals.STAGE_HEIGHT-40);
	globals.layerBackground.addChild(globals.grassArr[1].shape);


	// ** initialize clouds into globals.layerCloud **
	game.Main.initClouds();



	// ** sprite and shape Bubble Test **
	var	i	= 0;
	globals.bubbleArr[i]	= new game.Bubble( 30, 30, game.Common.getRandomColor() );
	// the test bubble image is ellipsoid a bit ... khmm
	globals.bubbleArr[i].bmpAnimation.scaleX	= 0.7;
    globals.layerBubble.addChild(globals.bubbleArr[i].bmpAnimation);
    // the shape isn't
	globals.layerBubble.addChild(globals.bubbleArr[i].shape);


	/*
	*	Other neccessary settings
	*/

	// set the global ticker which used by tween.js and easeljs animations
	createjs.Ticker.setFPS(30);
	createjs.Ticker.addListener(tick);


	// it stops automatically drawing if the user will leave the browser window
	$(window).bind("blur",function(){
		createjs.Ticker.setPaused(true);
		// globals.STOP_TICK_DRAW	= true;
	});
	$(window).bind("focus",function(){
		// globals.STOP_TICK_DRAW	= false;
		createjs.Ticker.setPaused(false);
	});


	// ONLY FOR TESTING!! this is a performance killer line
	globals.stage.enableMouseOver(10);

	globals.stage.update();

}
);
// *** end $(document).ready function



/*
*	The Main object
*/

(function(namespace){
	var Main	= new Object;

	/*
	*	first time cloud generating
	*/
	Main.initClouds	= function (){

		var offset	= globals.cloudArr.length;

		// generate (draw) clouds 
		// add them to globals.cloudArr
		// draw them on canvas to equal distance
		for(var i=0;i<(globals.cloudCount);i++){
			x			= Math.round( globals.STAGE_WIDTH/(globals.cloudCount+1) )*(i+1)+ Math.round( (Math.random()-0.5)*50 );	// x position (equal cloud distance)
			y			= 50+Math.round( (Math.random()-0.5)*10 );		// random y position (offset)
			color		= game.Common.getRandomColor();				// generate random color
			alpha		= Math.random();							// alpha
			alpha		= 1;
			scaleRnd	= (Math.random())/2+0.3;					// random scaling - maximum +-25%
			var cloud 	= new game.Cloud( x, y, color, alpha, scaleRnd );
			cloud.shape.alpha	= 0;	// it's a different alpha than drawing alpha!

			globals.layerCloud.addChild(cloud.shape);

			globals.cloudArr[i+offset]	= cloud;		//store clouds in a global array too

		}

		// start the tween effects on every new cloud
		var tweenArr	= Array();
		var tmpX,tmpY		= 0;
		for(var i=offset;i<(globals.cloudArr.length);i++){
			tmpX		= Math.round((Math.random())*1000)-200;
			tmpY		= Math.round((Math.random()-0.2)*10);
			tmpAlpha	= Math.random();
			tweenArr[i] = createjs.Tween.get( globals.cloudArr[i].shape );

			// simple alpha effect:
			tweenArr[i].to({alpha:1},2000);
			// more complex movement test:
			// tweenArr[i].to({x:170,y:50,alpha:0.1},4000, createjs.Ease.elasticInOut ).to({x:tmpX, y:tmpY, alpha:0.9},4000, createjs.Ease.bounceInOut).to( {rotation:360}, 4000, createjs.Ease.elasticInOut );

			// add simple drag'n drop to every cloud shape
			Main.addShapeDragAndDrop( globals.cloudArr[i].shape );
		}

		globals.stage.update();
	}	// end Main.initClouds



	Main.initBgCloud	= function(){

		var offset	= globals.bgCloudArr.length;

		// generate (draw) clouds from globals.cloudArr
		for(var i=offset;i<(globals.cloudCount+offset);i++){
			x			= Math.round( globals.STAGE_WIDTH/(globals.cloudCount+1) )*(i)  + Math.round( (Math.random()-0.5)*200 );	// x position (equal cloud distance)
			y			= 100 + Math.round( (Math.random()-0.5)*20 );		// random y position (offset)
			color		= "0xffffff";								// generate random color
			alpha		= 0.3;										// alpha
			scaleRnd	= (Math.random())/2+0.2;					// random scaling - maximum +-25%

			var cloud 	= new game.Cloud( x, y, color, alpha, scaleRnd );

			globals.layerBackground.addChild(cloud.shape);

			globals.bgCloudArr[i]	= cloud;					//store clouds in a global array too
		}

	}


	Main.initStageBgGradient	= function(){
		// create background gradient
	    globals.gStageBgGradient	= new createjs.Graphics();
		globals.gStageBgGradient.colorR	= 80;
		globals.gStageBgGradient.colorG	= 80;
		globals.gStageBgGradient.colorB	= 150;

		globals.sStageBgGradient	= new createjs.Shape(globals.gStageBgGradient);
		return globals.sStageBgGradient;
	}

	// add DnD to a given target shape
	Main.addShapeDragAndDrop	= function( shape ){

		shape.onPress	= function(evt){

			// store the start position
			globals.dragAndDropStartX	= shape.x;
			globals.dragAndDropStartY	= shape.y;

			var offset = {x:shape.x-evt.stageX, y:shape.y-evt.stageY};

			// add a handler to the event object's onMouseMove callback
			// this will be active until the user releases the mouse button:
			evt.onMouseMove = function(ev) {
				shape.x = ev.stageX+offset.x;
				shape.y = ev.stageY+offset.y;
			}
			evt.onMouseUp	= function(){
				tween	= createjs.Tween.get(shape);
				tween.to({x:globals.dragAndDropStartX,y:globals.dragAndDropStartY},2000,createjs.Ease.elasticOut);
			}
		}
		shape.onMouseOver = function() {
			// shape.scaleX = shape.scaleY =1.2;
				tween	= createjs.Tween.get(shape);
				tween.to({alpha:.5},200,createjs.Ease.linearOut);
		}
		shape.onMouseOut = function() {
				tween	= createjs.Tween.get(shape);
				tween.to({alpha:1},300,createjs.Ease.linearOut);
		}
	
	}



	Main.havacska	= function(){
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

			globals.stage.addChild(s);
		}
	}



	/*
	*	Cache testing:
	*	Add cache to every cloud shape;
	*	Comment: The caching will be slow if the cached graphic is too big. 
	*/
	Main.turnOnCache	= function( sizeX, sizeY ){
		// set the defult size
		if (sizeX==0){
			sizeX=300;
			sizeY=180;
		}

		for  ( var i=0; i<globals.cloudArr.length; i++){
			//turn on the cache
			globals.cloudArr[i].shape.cache(0,0,sizeX,sizeY);					// NA EZÉRT SZÍVÁS A DEFAULT FELHŐ OFFSET
		}
	}


	Main.turnOffCache	= function(){

		for  ( var i=0; i<globals.cloudArr.length; i++){
			//turn on the cache
			globals.cloudArr[i].shape.uncache();
		}
	}


namespace.Main	= Main;
}(game || (game = {})));
var game;