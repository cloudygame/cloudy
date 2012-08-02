

var collision	= new Object;

/*
*	Bubble - Cloud collision tester function
*
*	- test every bubble with every cloud
*	- the simpliest and fastest way is the radius testing(two circle collision)
*/
collision.RadiusTest = function (){
	for ( var i=0; i<globals.cloudArr.length; i++ ){
		for ( var j=0; j<globals.bubbleArr.length; j++){ 
			var currCloud	= globals.cloudArr[i];
			var currBubble	= globals.bubbleArr[j];
			var cx	= currCloud.shape.x;
			var cy	= currCloud.shape.y;
			var bx	= currBubble.shape.x;
			var by	= currBubble.shape.y;
			// calculate distance:
			distance	= Math.sqrt( (cx-bx)*(cx-bx) + (cy-by)*(cy-by) ); 
			if( distance<(currCloud.scaledRadius+currBubble.scaledRadius)){
				console.log("Collision:   Bubble:" + j + " Cloud:" + i);
			}
				// console.log(" cx:" + cx + " cy:" + cy + " bx:" + bx +  " by:" + by +  " dist:"+distance + " cloud R:" + Math.round(currCloud.scaledRadius) +" bubble R:"+currBubble.scaledRadius);
		}
	}
}

