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
				// console.log(grassJsonDataArr[i]["quadraticCurveTo"][0]["x"]);
				globals.grassArr[1].bend();
		}
		if (createjs.Ticker.getTicks() % 6 == 0){
				// console.log(grassJsonDataArr[i]["quadraticCurveTo"][0]["x"]);
				globals.grassArr[0].bend();
		}

		// grass rotation
		if (createjs.Ticker.getTicks() % 3 == 0){
				// console.log(grassJsonDataArr[i]["quadraticCurveTo"][0]["x"]);
				globals.grassArr[1].offsetX	+= 1;
		}

		globals.grassArr[0].draw();
		globals.grassArr[1].draw();


		/*
		* Background cloud "rotation"
		*/
		if ( createjs.Ticker.getTicks() % 1 == 0 ){
			for( var i=0;i<globals.bgCloudArr.length; i++){
				var cloudShape	= globals.bgCloudArr[i].shape;
				var cloud		= globals.bgCloudArr[i];
				var offsetScale	= cloud.maxX;//  cloudShape.scaleX
				if ( cloud.getCurrentX() < globals.STAGE_WIDTH ){
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
		if (createjs.Ticker.getTicks() % 2 == 0){		// slow down
			for( var i=0; i<globals.bubbleArr.length; i++){
				var bmpAnimation	= globals.bubbleArr[i].bmpAnimation;
			    // Hit testing the screen width, otherwise our sprite would disappear
			    if (bmpAnimation.y < 0) {
					// We've reached the right side of our screen
					// We need to walk left now to go back to our initial position
					bmpAnimation.direction	= 90;
					// alert("FENT");
			    }

			    if (bmpAnimation.y > globals.STAGE_HEIGHT) {
					// We've reached the left side of our screen
					// We need to walk right now
					bmpAnimation.direction	= 270;
					// alert("LENT");
			    }

			    // calculate the offset vector
				var angle	= bmpAnimation.direction*0.0174533;		// (Math.PI/180)
				var radius	= bmpAnimation.speed*4;
				var x	= Math.round(Math.cos(angle) * radius);
				var y	= Math.round(Math.sin(angle) * radius);

				// console.log( "Y" + y );

				// image bubble movevement
				bmpAnimation.y	+= y;
				bmpAnimation.x	+= x;

				// shape bubble movevement
				globals.bubbleArr[i].shape.y	+= y;
				globals.bubbleArr[i].shape.x	+= x;
			}
		}
		// end bubble movement


		// 
		collisionTest();


		//re-render the stage
		globals.stage.update();
	}
}



/*
*	Bubble - Cloud collision tester function
*
*	- test every bubble with every cloud
*	- the simpliest and fastest way is the radius testing(two circle collision)
*/
function collisionTest(){
	for ( var i=0; i<globals.cloudArr.length; i++ ){
		for ( var j=0; j<globals.bubbleArr.length; j++){ 
			var currCloud	= globals.cloudArr[i];
			var currBubble	= globals.bubbleArr[j];
			var cx	= currCloud.getCenterX();
			var cy	= currCloud.getCenterY();
			var bx	= currBubble.getCenterX();
			var by	= currBubble.getCenterY();
			// calculate distance:
			distance	= Math.sqrt( (cx-bx)*(cx-bx) + (cy-by)*(cy-by) ); 
			if( distance<(currCloud.radius+currBubble.radius)){
				console.log("dist:"+distance + " clR:" +currCloud.radius +" curr bubble R:"+currBubble.radius);
			}
		}
	}
}

