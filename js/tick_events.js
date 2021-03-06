/*
*	tick = Easeljs timer
*/
game.TickEvents = {


	grassEffects : function(){
			if (createjs.Ticker.getTicks() % 3 == 0){
				// game.Common.log( "tick: Grass draw start" );	// time measurement START
				globals.grassArr[1].bend();
				globals.grassArr[1].draw();
			}
			if (createjs.Ticker.getTicks() % 6 == 0){
				globals.grassArr[0].bend();
				globals.grassArr[0].draw();
			}

			// grass rotation
			if (createjs.Ticker.getTicks() % 3 == 0){
				// console.log(grassJsonDataArr[i]["quadraticCurveTo"][0]["x"]);
				globals.grassArr[1].offsetX	+= 1;
			}

	},


	collisionTest : function (){
		//collision.RadiusTest();
		var colliding = collision.PolygonTest();
		if (colliding != globals.colliding) {
			if (colliding != false) {
				game.Common.log('colliding TRUE');
			} else {
			}
		}
		globals.colliding = colliding;

	},


	bubbleMove : function (){
		for( var i=0; i<globals.bubbleArr.length; i++){
			var bubble	= globals.bubbleArr[i];
		    // Hit testing the screen width, otherwise our sprite would disappear
		    if (bubble.y < 0) {
				// We've reached the top of our screen
				// We need to go back
				bubble.setDirectionAngle(90);
				globals.prevBubbleDir	= 0;
		    }

		    if (bubble.y > globals.STAGE_HEIGHT) {
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
	},

	bgCloudMove : function (){
		for( var i=0;i<globals.bgCloudArr.length; i++){
			var cloud	= globals.bgCloudArr[i];
			var offsetScale	= cloud.maxX;//  cloud.scaleX
			if( globals.bgCloudArr[i].direction=="right" ){
				if ( (cloud.x - (cloud.getCurrentWidth()/2)) < globals.STAGE_WIDTH ){
					cloud.x += globals.bgCloudArr[i].speed;
				} else {
                    // randomize cloud pos
					cloud.x = 0 - cloud.getCurrentWidth()/2 + Math.random()*200;
					cloud.y += ((Math.random()/2)-0.5)*50;

					var rndScale	= (Math.random()/3+0.1);
					cloud.scaleX	= rndScale;
					cloud.scaleY	= rndScale;
					globals.bgCloudArr[i].speed	= Math.round((Math.random()+0.33)*2);
					// console.log( "X" + cloud.x );
				}
			}else{
				if ( (cloud.x + cloud.getCurrentWidth()) > 0){
					cloud.x -= 2;
				} else {
					// randomize cloud
					cloud.x += -1*Math.random()*200;
					cloud.y += ((Math.random()/2)-0.5)*50;
					var rndScale	= (Math.random()/3+0.1);
					cloud.scaleY	= rndScale;
					cloud.scaleX	= rndScale;
					globals.bgCloudArr[i].speed	= Math.round((Math.random()+0.33)*2);

					// set the start position
					// console.log( cloud.getCurrentX()+ " W:" +cloud.getCurrentWidth() + " xxx " +cloud.x +","+ cloud.regX + " XXX " +(0 - cloud.maxX+cloud.minX) );
					cloud.x = globals.STAGE_WIDTH + cloud.getCurrentWidth()/2;
				}
			}

		}	
	},

	bubbleControl : function(){

		// the mouse is over the control bar
		if( globals.stage.mouseY > globals.STAGE_HEIGHT-100 ){
			var direction	= Math.round((globals.stage.mouseX - (globals.STAGE_WIDTH/2))/(globals.BubbleDirGranularity*10));
			globals.controlBar.draw2( globals.stage.mouseX );

			for( var i=0; i<globals.bubbleArr.length; i++){
				var bubble	= globals.bubbleArr[i];
                var angleChange	= (globals.prevBubbleDir - direction)*(globals.BubbleDirGranularity);

				// convert direction to angle
				bubble.setDirectionAngle(bubble.directionAngle + angleChange);
                globals.prevBubbleDir	= direction;
            }
		}

	},


	dayNightBgEffect : function(){
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
	    globals.bgGraphics.clear();
		globals.bgGraphics.beginFill( color );
		globals.bgGraphics.rect(0,0,globals.STAGE_WIDTH, globals.STAGE_HEIGHT);
		globals.bgGraphics.endStroke();
	}

}

