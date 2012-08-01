	
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
	var layerBubble;
	var stage;
	
	var STAGE_WIDTH				= 900;
	var STAGE_HEIGHT			= 400;
	var CLOUD_COLOR_CONTOUR		= "#D8EDF2";
	var CLOUD_COLOR_FILL		= "lightgray";
	
	// Cloud parameters
	var cloudArr				= new Array();
	var bgCloudArr				= new Array();
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
	
	var canvas				= null;		// the Main canvas

	var dragAndDropStartX	= null;
	var dragAndDropStartY	= null;

	// stage background
	var gStageBgGradient;			// graphics obj of the gradient stage background 
	var sStageBgGradient;			// shape obj
	var StageBackgroundStars;


	var STOP_TICK_DRAW			= false;	// it stops drawing in tick() (CPU heat)


	var	grassArr		= new Array();


/*
*	the Main function
*/
$(document).ready( function() {

	/* Get the canvas and set the its size.
	*		(The size setting works only this way. why??)
	*/
	canvas		= $('#container').get(0);
	canvas.width	= STAGE_WIDTH;
	canvas.height	= STAGE_HEIGHT;
	//	$('#container').css('width','900px');	// this solution would be nice but the size setting from css is buggy
	//	$('#container').css('height','300px');

	/* A stage is the root level Container for a display list. Each time its tick method is called, it will render its display list to its target canvas. */
	stage		= new createjs.Stage(canvas);


	/*
	* Create layers in proper order
	*/

	// *** Create main layers ***
	layerBackground	= new createjs.Container();
	stage.addChild(layerBackground);

	layerBubble	= new createjs.Container();
	stage.addChild(layerBubble);

	layerCloud	= new createjs.Container();
	stage.addChild(layerCloud);


	// *** Fill the layers ***

	// ** Background **
	sStageBgGradient	= game.Main.initStageBgGradient();
	layerBackground.addChild( sStageBgGradient );

	// stars
    var StageBackgroundStars	= new game.Star();
    layerBackground.addChild(StageBackgroundStars.shape);

	var starsTween = createjs.Tween.get( StageBackgroundStars.shape );
	starsTween.to({alpha:1},6000).to({alpha:1,rotation:17},20000);

	// background clouds
	game.Main.initBgCloud();

	// sun
	var sun	= new game.Sun();
	layerBackground.addChild(sun.shape);

	// draw grass
	grassArr[0]	= new game.Grass( 0, STAGE_HEIGHT-60);
	grassArr[0].shape.alpha = 0.6;
	layerBackground.addChild(grassArr[0].shape);

	grassArr[1]	= new game.Grass( 0, STAGE_HEIGHT-40);
	layerBackground.addChild(grassArr[1].shape);


	// ** initialize clouds into layerCloud **
	game.Main.initClouds();



	// ** sprite and shape Bubble Test **
	var	i	= 0;
	bubbleArr[i]	= new game.Bubble( 30, 30, game.Common.getRandomColor() );
	// the test bubble image is ellipsoid a bit ... khmm
	bubbleArr[i].bmpAnimation.scaleX	= 0.7;
    layerBubble.addChild(bubbleArr[i].bmpAnimation);
    // the shape isn't
	layerBubble.addChild(bubbleArr[i].shape);


	/*
	*	Other neccessary settings
	*/

	// set the global ticker which used by tween.js and easeljs animations
	createjs.Ticker.setFPS(30);
	createjs.Ticker.addListener(tick);


	// it stops automatically drawing if the user will leave the browser window
	$(window).bind("blur",function(){
		createjs.Ticker.setPaused(true);
		// STOP_TICK_DRAW	= true;
	});
	$(window).bind("focus",function(){
		// STOP_TICK_DRAW	= false;
		createjs.Ticker.setPaused(false);
	});


	// ONLY FOR TESTING!! this is a performance killer line
	stage.enableMouseOver(10);

	stage.update();

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

		var offset	= cloudArr.length;

		// generate (draw) clouds from cloudArr
		for(var i=offset;i<(cloudCount+offset);i++){
			x			= Math.round( STAGE_WIDTH/cloudCount )*i;	// x position (equal cloud distance)
			y			= Math.round( (Math.random()-0.5)*40 );		// random y position (offset)
			color		= game.Common.getRandomColor();							// generate random color
			alpha		= Math.random();							// alpha
			scaleRnd	= (Math.random())/2+0.5;					// random scaling - maximum +-25%
alpha	=1;
			var cloud 	= new game.Cloud( x, y, color, alpha, scaleRnd );

			cloud.addShadow();

			layerCloud.addChild(cloud.shape);

			cloudArr[i]	= cloud;				//store clouds in a global array too

		}

		// start the tween effects on every new cloud
		var tweenArr	= Array();
		var tmpX,tmpY		= 0;
		for(var i=offset;i<(cloudCount+offset);i++){
			tmpX		= Math.round((Math.random())*1000)-200;
			tmpY		= Math.round((Math.random()-0.2)*10);
			tmpAlpha	= Math.random();
			tweenArr[i] = createjs.Tween.get( cloudArr[i].shape );

			// complex movement for tests
			// tweenArr[i].to({x:170,y:50,alpha:0.1},4000, createjs.Ease.elasticInOut ).to({x:tmpX, y:tmpY, alpha:0.9},4000, createjs.Ease.bounceInOut).to( {rotation:360}, 4000, createjs.Ease.elasticInOut );
			// tweenArr[i].to({alpha:1},1000);

			// add simple drag'n drop to every cloud shape
			Main.addShapeDragAndDrop( cloudArr[i].shape );
		}


	}	// end Main.initClouds



	Main.initBgCloud	= function(){


		var offset	= bgCloudArr.length;

		// generate (draw) clouds from cloudArr
		for(var i=offset;i<(cloudCount+offset);i++){
			x			= Math.round( STAGE_WIDTH/cloudCount )*i;	// x position (equal cloud distance)
			y			= Math.round( (Math.random()-0.5)*30 );		// random y position (offset)
			color		= "0xffffff";							// generate random color
			alpha		= 0.3;							// alpha
			scaleRnd	= (Math.random())/2+0.2;					// random scaling - maximum +-25%

			var cloud 	= new game.Cloud( x, y, color, alpha, scaleRnd );

			layerBackground.addChild(cloud.shape);

			bgCloudArr[i]	= cloud;				//store clouds in a global array too

		}

}


	Main.initStageBgGradient	= function(){
		// create background gradient
	    gStageBgGradient	= new createjs.Graphics();
		gStageBgGradient.colorR	= 80;
		gStageBgGradient.colorG	= 80;
		gStageBgGradient.colorB	= 150;

		sStageBgGradient	= new createjs.Shape(gStageBgGradient);
		return sStageBgGradient;
	}

	// add DnD to a given target shape
	Main.addShapeDragAndDrop	= function( shape ){

		shape.onPress	= function(evt){

			// store the start position
			dragAndDropStartX	= shape.x;
			dragAndDropStartY	= shape.y;

			var offset = {x:shape.x-evt.stageX, y:shape.y-evt.stageY};

			// add a handler to the event object's onMouseMove callback
			// this will be active until the user releases the mouse button:
			evt.onMouseMove = function(ev) {
				shape.x = ev.stageX+offset.x;
				shape.y = ev.stageY+offset.y;
			}
			evt.onMouseUp	= function(){
				tween	= createjs.Tween.get(shape);
				tween.to({x:dragAndDropStartX,y:dragAndDropStartY},2000,createjs.Ease.elasticOut);
			}
		}
		shape.onMouseOver = function() {
			// shape.scaleX = shape.scaleY =1.2;
				tween	= createjs.Tween.get(shape);
				tween.to({scaleX:shape.scaleX+0.1,scaleY:shape.scaleY+0.1},300,createjs.Ease.linearOut);
		}
		shape.onMouseOut = function() {
				tween	= createjs.Tween.get(shape);
				tween.to({scaleX:shape.scaleX-0.1,scaleY:shape.scaleY-0.1},300,createjs.Ease.linearOut);
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

			stage.addChild(s);
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

		for  ( var i=0; i<cloudArr.length; i++){
			//turn on the cache
			cloudArr[i].shape.cache(130,110,sizeX,sizeY);					// NA EZÉRT SZÍVÁS A DEFAULT FELHŐ OFFSET
		}
	}


	Main.turnOffCache	= function(){

		for  ( var i=0; i<cloudArr.length; i++){
			//turn on the cache
			cloudArr[i].shape.uncache();
		}
	}


namespace.Main	= Main;
}(game || (game = {})));
var game;