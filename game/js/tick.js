
//function called by the Tick instance at a set interval
function tick()
{

	// FPS measurement for testing
	$('#FPS').val('FPS: '+ createjs.Ticker.getMeasuredFPS() );

	if (!STOP_TICK_DRAW){

		/*
		*	1. simple background transition
		*/
		if (createjs.Ticker.getTicks()%30 == 0){
			bgGraphics	= gStageBackground;
			var color	= createjs.Graphics.getRGB( gStageBackground.colorR, gStageBackground.colorG, gStageBackground.colorB, 0.1 );

		    // change stage background color
			bgGraphics.beginFill( color );
			bgGraphics.setStrokeStyle(3);
			bgGraphics.beginStroke('#fff');
			bgGraphics.rect(0,0,STAGE_WIDTH, STAGE_HEIGHT);
			bgGraphics.endStroke();
		}

		// grass bend
		if (createjs.Ticker.getTicks() % 3 == 0){
			for( var i=0; i<grassArr.length; i++){
				// console.log(grassJsonDataArr[i]["quadraticCurveTo"][0]["x"]);
				grassArr[i].bend();
			}
		}


		// bubble movement start
		for( var i=0; i<bubbleArr.length; i++){
			var bmpAnimation	= bubbleArr[i].bmpAnimation;
		    // Hit testing the screen width, otherwise our sprite would disappear
		    if (bmpAnimation.y < 0) {
				// We've reached the right side of our screen
				// We need to walk left now to go back to our initial position
				bmpAnimation.direction	= 90;
				// alert("FENT");
		    }

		    if (bmpAnimation.y > STAGE_HEIGHT) {
				// We've reached the left side of our screen
				// We need to walk right now
				bmpAnimation.direction	= 270;
				// alert("LENT");
		    }

		    // calculate the offset vector
			var angle	= bmpAnimation.direction*0.0174533;		// (Math.PI/180)
			var radius	= bmpAnimation.speed*10;
			var x	= Math.round(Math.cos(angle) * radius);
			var y	= Math.round(Math.sin(angle) * radius);

			// image bubble movevement
			bmpAnimation.y	+= y;
			bmpAnimation.x	+= x;

			// shape bubble movevement
			bubbleArr[i].shape.y	+= y;
			bubbleArr[i].shape.x	+= x;
		}
		// end bubble movement

		//re-render the stage
		stage.update();
	}
}


