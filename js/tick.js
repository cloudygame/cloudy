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
		*	0. Control
		*/
		if ((createjs.Ticker.getTicks()%5 == 0) && globals.stage.mouseInBounds ){
			game.Common.log( globals.stage.mouseInBounds + '-' + globals.stage.mouseX + '-' + globals.stage.mouseY );

			// the mouse is over the control bar
			if( globals.stage.mouseY > globals.STAGE_HEIGHT-60 ){
				var direction	= Math.round((globals.stage.mouseX - (globals.STAGE_WIDTH/2))/(globals.BubbleDirGranularity*10));
				var angleChange	= (globals.prevBubbleDir - direction)*(globals.BubbleDirGranularity);


				for( var i=0; i<globals.bubbleArr.length; i++){
					var bubble	= globals.bubbleArr[i];

					// convert direction to angle
					bubble.setDirectionAngle(bubble.directionAngle + angleChange);
				game.Common.log( 'tick Bubble prev direction: ' + bubble.directionAngle + ' Current direction: ' + direction + ' angleChange:' + angleChange);
				}
				globals.prevBubbleDir	= direction;
			}
		}



		/*
		*	1. simple background transition (~70sec now)
		*/
/*

		MUST FIX!!!! -> brutal performance loss

		if (createjs.Ticker.getTicks()%10 == 0){
			globals.bgGraphics	= globals.gStageBgGradient;
			bgColors		= globals.gStageBgGradient;
			var tmpAlpha	= 0.03;

			// game day hour check
			var elapsedTime	= createjs.Ticker.getTime()/(100*globals.effectTimeMultiplier);
			if ( elapsedTime % 70 > 30 ){		// evening
				var color	= createjs.Graphics.getRGB( '0x000000', tmpAlpha );
				// game.Common.log("go to midnight");
			}else if(elapsedTime % 70 > 15 ){	// lunchtime:)
				var color	= createjs.Graphics.getRGB( '0x000088', tmpAlpha );
				// game.Common.log("go to evening");
			}else if(elapsedTime % 70 > 0 ){	// morning
				var color	= createjs.Graphics.getRGB( '0xffffff', tmpAlpha );
				// game.Common.log("go to lunch :)");
			}


		    // change stage background color
			globals.bgGraphics.beginFill( color );
			globals.bgGraphics.rect(0,0,globals.STAGE_WIDTH, globals.STAGE_HEIGHT);
			globals.bgGraphics.endStroke();
		}
*/
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
				if( globals.bgCloudArr[i].direction=="right" ){
					if ( (cloud.shape.x - (cloud.getCurrentWidth()/2)) < globals.STAGE_WIDTH ){
						cloudShape.x += globals.bgCloudArr[i].speed;
					} else {
						// console.log( cloud.getCurrentX()+ " W:" +cloud.getCurrentWidth() + " xxx " +cloudShape.x +","+ cloudShape.regX + " XXX " +(0 - cloud.maxX+cloud.minX) );
						cloudShape.x = 0 - cloud.getCurrentWidth()/2;

						// randomize cloud
						cloudShape.x += Math.random()*200;
						cloudShape.y += ((Math.random()/2)-0.5)*50;
						var rndScale	= (Math.random()/3+0.1);
						cloudShape.scaleX	= rndScale;
						cloudShape.scaleY	= rndScale;
						globals.bgCloudArr[i].speed	= Math.round((Math.random()+0.33)*2);
						// console.log( "X" + cloudShape.x );
					}
				}else{
					if ( (cloud.shape.x + cloud.getCurrentWidth()/2) > 0){
						cloudShape.x -= 2;
					} else {
						// randomize cloud
						cloudShape.x += -1*Math.random()*200;
						cloudShape.y += ((Math.random()/2)-0.5)*50;
						var rndScale	= (Math.random()/3+0.1);
						cloudShape.scaleY	= rndScale;
						cloudShape.scaleX	= rndScale;
						globals.bgCloudArr[i].speed	= Math.round((Math.random()+0.33)*2);

						// set the start position
						// console.log( cloud.getCurrentX()+ " W:" +cloud.getCurrentWidth() + " xxx " +cloudShape.x +","+ cloudShape.regX + " XXX " +(0 - cloud.maxX+cloud.minX) );
						cloudShape.x = globals.STAGE_WIDTH + cloud.getCurrentWidth()/2;
					}
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
					// We've reached the top of our screen
					// We need to go back
					bubble.setDirectionAngle(90);
					globals.prevBubbleDir	= 0;
			    }

			    if (bubble.shape.y > globals.STAGE_HEIGHT) {
					// We've reached the bottom of our screen
					// We need to go back
					bubble.setDirectionAngle(270);
					globals.prevBubbleDir	= 0;
			    }

				// shape bubble movevement
				// bubble.speed = 1;
				bubble.move();
				bubble.shape.rotation += 5;
			}
		}
		// end bubble movement


		// check it on every 10th tick
		if ( createjs.Ticker.getTicks() % 50 == 0 ){
			collision.RadiusTest();
		}


		//re-render the stage
		globals.stage.update();
	}
}

