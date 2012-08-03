/*
*	tick = Easeljs timer
*/


//function called by the Tick instance at a set interval
function tick()
{

	// FPS measurement for testing
	$('#FPS').val('FPS: '+ createjs.Ticker.getMeasuredFPS() );

	if (!globals.STOP_TICK_DRAW){

		/*
		*	1. simple background transition
		*/
		if (createjs.Ticker.getTicks()%30 == 0){
			globals.bgGraphics	= globals.gStageBgGradient;
			bgColors	= globals.gStageBgGradient;
			var color	= createjs.Graphics.getRGB( bgColors.colorR, bgColors.colorG, bgColors.colorB, 0.1 );

		    // change stage background color
			globals.bgGraphics.beginFill( color );
			globals.bgGraphics.rect(0,0,globals.STAGE_WIDTH, globals.STAGE_HEIGHT);
			globals.bgGraphics.endStroke();
		}

		/*
		*	2. Grass effects
		*/
		// grass bend
		if (createjs.Ticker.getTicks() % 3 == 0){
			// game.Common.log( "tick: Grass draw start" );	// time measurement START
			globals.grassArr[1].bend();
		}
		if (createjs.Ticker.getTicks() % 6 == 0){
			globals.grassArr[0].bend();
		}

		// grass rotation
		if (createjs.Ticker.getTicks() % 3 == 0){
			// console.log(grassJsonDataArr[i]["quadraticCurveTo"][0]["x"]);
			globals.grassArr[1].offsetX	+= 1;
		}

		// the draw is needed only on tick/3
		if (createjs.Ticker.getTicks() % 3 == 0){
			globals.grassArr[0].draw();
			globals.grassArr[1].draw();
			// game.Common.log( "tick: Grass draw end" );	// time measurement END
		}


		/*
		* Background cloud "rotation"
		*/
		if ( createjs.Ticker.getTicks() % 1 == 0 ){
			for( var i=0;i<globals.bgCloudArr.length; i++){
				var cloudShape	= globals.bgCloudArr[i].shape;
				var cloud		= globals.bgCloudArr[i];
				var offsetScale	= cloud.maxX;//  cloudShape.scaleX
				if ( (cloud.shape.x - (cloud.getCurrentWidth()/2)) < globals.STAGE_WIDTH ){
					cloudShape.x += 2;
				} else {
					// console.log( cloud.getCurrentX()+ " W:" +cloud.getCurrentWidth() + " xxx " +cloudShape.x +","+ cloudShape.regX + " XXX " +(0 - cloud.maxX+cloud.minX) );
					cloudShape.x = 0 - (cloud.maxX+cloud.minX) + ((cloud.maxX+cloud.minX)-cloud.getCurrentWidth())/2;
					// console.log( "X" + cloudShape.x );
				}

			}
		}


		/*
		*	Bubble movement
		*/
		if (createjs.Ticker.getTicks() % 1 == 0){		// slow down
			for( var i=0; i<globals.bubbleArr.length; i++){
				var bubble	= globals.bubbleArr[i];
			    // Hit testing the screen width, otherwise our sprite would disappear
			    if (bubble.shape.y < 0) {
					// We've reached the right side of our screen
					// We need to walk left now to go back to our initial position
					bubble.directionAngle	= 80;
					// alert("FENT");
			    }

			    if (bubble.shape.y > globals.STAGE_HEIGHT) {
					// We've reached the left side of our screen
					// We need to walk right now
					bubble.directionAngle	= 290;
			    }

				// shape bubble movevement
				bubble.speed = 1;
				bubble.move();
				bubble.shape.rotation += 5;
			}
		}
		// end bubble movement


		// check it on every 10th tick
		if ( createjs.Ticker.getTicks() % 10 == 0 ){
			collision.RadiusTest();
		}


		//re-render the stage
		globals.stage.update();
	}
}

