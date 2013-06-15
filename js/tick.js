/*
*	tick = Easeljs timer
*/


//function called by the Tick instance at a set interval
function tick()
{

	// FPS measurement for testing

	if (!globals.STOP_TICK_DRAW){
		
		if ((createjs.Ticker.getTicks()%30 == 0)){ 
			$('#FPS').val('FPS: '+ Math.round(createjs.Ticker.getMeasuredFPS()) );
		}

		/*
		*	0. Control
		*/
		if ((createjs.Ticker.getTicks()%5 == 0) && globals.stage.mouseInBounds ){
			game.TickEvents.bubbleControl();
		}



		/*
		*	1. simple background transition (~70sec now)
		*/

		if (createjs.Ticker.getTicks()%10 == 0){
			game.TickEvents.dayNightBgEffect();
		}
		// grass bend and rotate
		// tick_grass_effects();


		/*
		* Background cloud "rotation"
		*/
		if ( createjs.Ticker.getTicks() % 1 == 0 ){
			game.TickEvents.bgCloudMove();
		}


		/*
		*	Bubble movement
		*/
		if (createjs.Ticker.getTicks() % 1 == 0){		// slow down
			game.TickEvents.bubbleMove();
		}
		// end bubble movement


		// check it on every 10th tick
		if ( createjs.Ticker.getTicks() % 10 == 0 ){
			game.TickEvents.collisionTest();
		}


		//re-render the stage
		globals.stage.update();
	}
}



