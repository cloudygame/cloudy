
//function called by the Tick instance at a set interval
function tick()
{
    // change stage background color
	gStageBackground.beginFill( createjs.Graphics.getRGB( game.Common.getRandomColor(), 1 ) );
	gStageBackground.setStrokeStyle(3);
	gStageBackground.beginStroke('#fff');
	// gStageBackground.rect(0,0,STAGE_WIDTH, STAGE_HEIGHT);
	gStageBackground.endStroke();

	// FPS measurement for testing
	$('#FPS').val('FPS: '+ createjs.Ticker.getMeasuredFPS() );

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

	//re-render the stage
	if (!STOP_TICK_DRAW){
		stage.update();
	}
}


