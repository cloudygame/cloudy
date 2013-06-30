this.game = this.game || {};

var collision = new Object;
this.game.collision = collision;

/*
 *	Bubble - Cloud collision tester function
 *
 *	- test every bubble with every cloud
 *	- the simpliest and fastest way is the radius testing(two circle collision)
 */
/*
 collision.RadiusTest = function () {
 for (var j = 0; j < globals.bubbleArr.length; j++) {
 var currBubble = globals.bubbleArr[j];
 currBubble.boundingPolygon.move(new Point(currBubble.shape.x, currBubble.shape.y));
 for (var i = 0; i < globals.cloudArr.length; i++) {
 var currCloud = globals.cloudArr[i];
 var cx = currCloud.shape.x;
 var cy = currCloud.shape.y;
 var bx = currBubble.shape.x;
 var by = currBubble.shape.y;
 // calculate distance:
 distance = Math.sqrt((cx - bx) * (cx - bx) + (cy - by) * (cy - by));
 if (distance < (currCloud.scaledRadius + currBubble.scaledRadius)) {
 game.Common.log("Collision:   Bubble:" + j + " Cloud:" + i);
 return true;
 }
 // console.log(" cx:" + cx + " cy:" + cy + " bx:" + bx + " by:" + by + " dist:" + distance + " cloud R:" + Math.round(currCloud.scaledRadius) + " bubble R:" + currBubble.scaledRadius);
 }
 }
 return false;
 }
 */
/**
 *
 *
 */
collision.PolygonTest = function () {
    var colliding = false;
    for (var j = 0; j < globals.bubbleArr.length; j++) {
        var currBubble = globals.bubbleArr[j];
        var newCenter = new Point(currBubble.x, currBubble.y);
        currBubble.boundingPolygon.move(newCenter);
        for (var i = 0; i < globals.cloudArr.length; i++) {
            var currCloud = globals.cloudArr[i];
            colliding = currBubble.boundingPolygon.intersectsWith(currCloud.boundingPolygon);

            if (globals.DEBUG_COLLISION && colliding) {
                currBubble.drawBoundingPolygon(globals.COLOUR_BOUNDING_POLYGON_INTERSECT);
            } else {
                currBubble.drawBoundingPolygon(globals.COLOUR_BOUNDING_POLYGON_NON_INTERSECT);
            }

            if (colliding) {
                // Return on the first collision
                currBubble.bumm();
                currCloud.addBumm();
                return colliding;
            }
        }
    }
    return colliding;
}


collision.drawBoundingPolygon = function (graphics, boundingPolygon, colour) {
    //graphics.clear();
    graphics.endFill();
    graphics.setStrokeStyle(1);
    graphics.beginStroke(colour);
    for (var ixSide = 0; ixSide < boundingPolygon.getNumberOfSides(); ixSide++) {
        if (ixSide == 0) {
            graphics.moveTo(boundingPolygon.center.x - boundingPolygon.points[ixSide].x, boundingPolygon.center.y - boundingPolygon.points[ixSide].y);
        } else {
            graphics.lineTo(boundingPolygon.center.x - boundingPolygon.points[ixSide].x, boundingPolygon.center.y - boundingPolygon.points[ixSide].y);
        }
    }
    graphics.closePath();
}
