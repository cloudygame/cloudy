/*
 *	This file contains the shape creating and effecting functions.
 */

/*********************************************************************
 *
 *        OBJECTS
 *
 */


(function (namespace) {
    "use strict"

    /*
     *	the Cloud object and constructor
     */
    var Cloud = function (inX, inY, inFillColor, inAlpha, inScale, strokeColor) {
        this.Container_initialize();

        this.lastX = null; // last x position for drag n' drop
        this.lastY = null; // last y position for drag n' drop
        this.maxX = null; // unscaled maxX from JSON
        this.maxY = null;
        this.minX = null;
        this.minY = null;
        this.boundingPolygon = null; // a Polygon object that bounds the Cloud. Used for collision detection
        this.strokeColorFrom = "#eee";
        this.strokeColorTo = "#000";

        var graphics = new createjs.Graphics();
        this.cloudShape = new createjs.Shape(graphics);
        this.addChild(this.cloudShape);

        this.initCloud(inX, inY, inFillColor, inAlpha, inScale);

        this.reDraw();

        this._drawDebugShapes();
    }


    var p = Cloud.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    /*
     *	draw a new cloud from JSON data and return with a Shape object
     */
    p.initCloud = function (inX, inY, inFillColor, inAlpha, inScale) {

        this.cloudData = this.loadCloudData(inFillColor, inAlpha);

        /*
         *	Doc: A Shape allows you to display vector art in the display list. It composites a Graphics instance which exposes all of the vector drawing methods.
         *	The Graphics instance can be shared between multiple Shape instances to display the same vector graphics with different positions or transforms.
         */

        // The graphics object exists only virtual. We cannot draw it onto the canvas in normal way. (It's possible but not a good idea.)
        // So we need to add it to a new createjs.Shape.
        this.regX = (this.maxX - this.minX) / 2; // set the reg points to the center
        this.regY = (this.maxY - this.minY) / 2;
        this.x = inX;
        this.y = inY;
        this.scaleX = inScale;
        this.scaleY = inScale;

    }

    p.addBumm = function () {
        var shape = this;
        var newScale = shape.scaleX * 0.7;
        var newAlpha = shape.alpha * 0.4;
        createjs.Tween.get(this).to({alpha: newAlpha, scaleX: newScale, scaleY: newScale}, 2000, createjs.Ease.bounceInOut);
    }

    // return with the current, scaled unscaledWidth
    p.getCurrentWidth = function () {
        var currWidth = (this.maxX) * this.scaleX;
        return currWidth;
    }

    p.generateCloudData = function (inFillColor, inAlpha) {
        var jsonStr = '{"fillColor":"' + inFillColor + '","alpha":"' + inAlpha + '","strokeStyle":6,"moveTo":{"x":140,"y":200},"quadraticCurveTo":[{"x":135,"y":155,"ref_x":180,"ref_y":150},{"x":220,"y":110,"ref_x":260,"ref_y":130},{"x":300,"y":100,"ref_x":340,"ref_y":130},{"x":390,"y":125,"ref_x":400,"ref_y":170},{"x":440,"y":190,"ref_x":420,"ref_y":230},{"x":420,"y":270,"ref_x":380,"ref_y":270},{"x":340,"y":290,"ref_x":300,"ref_y":270},{"x":260,"y":290,"ref_x":220,"ref_y":270},{"x":185,"y":275,"ref_x":170,"ref_y":250},{"x":185,"y":275,"ref_x":170,"ref_y":250},{"x":130,"y":240,"ref_x":140,"ref_y":200}]}';
        var cloudData = jQuery.parseJSON(jsonStr);
        return cloudData;
    }


    /*
     *	this function generates shadow around the cloud shape
     *	in:		cloud shape
     *	return: -
     */
    p.addShadow = function () {
        var shadow = new createjs.Shadow("gray", 10, 10, 3);
        this.shadow = shadow;
    }

    p.setStrokeColor = function (from, to) {
        this.strokeColorFrom = from;
        this.strokeColorTo = to;
        this.reDraw();
    }

    p.changeColor = function (inFillColor, inAlpha) {
//        this._drawQuadraticJson(this.cloudShape.graphics, this.cloudData);
        // re-generate the whole cloud data with the new color
        this.cloudData = this.generateCloudData(inFillColor, inAlpha);
        this.reDraw();
    }


    p.reDraw = function () {
        this._drawQuadraticJson(this.cloudShape.graphics, this.cloudData);
    }

    /*
     *	universal quadratic curve drawer function
     */
    p._drawQuadraticJson = function (graphics, inJson) {
        graphics.clear();
        graphics.beginFill(createjs.Graphics.getRGB(inJson["fillColor"], inJson["alpha"]))
            .setStrokeStyle(inJson["strokeStyle"]).beginLinearGradientStroke([this.strokeColorFrom, this.strokeColorTo], [0, 1], 100, 100, 440, 300);

        graphics.moveTo(inJson["moveTo"]["x"], inJson["moveTo"]["y"]);
        var pMoveTo = new Point(this.x + inJson["moveTo"]["x"], this.y + inJson["moveTo"]["y"]);
        this.boundingPolygon = new Polygon(pMoveTo);
        this.boundingPolygon.addPoint(pMoveTo);

        for (var i = 0; i < inJson.quadraticCurveTo.length; i++) {
            graphics.quadraticCurveTo(
                inJson["quadraticCurveTo"][i]["x"], inJson["quadraticCurveTo"][i]["y"], inJson["quadraticCurveTo"][i]["ref_x"], inJson["quadraticCurveTo"][i]["ref_y"]);
            var pCurr = new Point(this.x + inJson["quadraticCurveTo"][i]["x"], this.y + inJson["quadraticCurveTo"][i]["y"]);
            var pCurrRef = new Point(this.x + inJson["quadraticCurveTo"][i]["ref_x"], this.y + inJson["quadraticCurveTo"][i]["ref_y"]);
            this.boundingPolygon.addPoint(pCurr);
            this.boundingPolygon.addPoint(pCurrRef);
        }

        // set the min/max coords of the drawed cloud
        var minXY = game.Common.getMinXYPointQuadraticJson(inJson);
        var maxXY = game.Common.getMaxXYPointQuadraticJson(inJson);
        this.maxX = maxXY.x;
        this.maxY = maxXY.y;
        this.minX = minXY.x;
        this.minY = minXY.y;

        // console.log( game.Common.getMaxXYPointQuadraticJson(inJson));
        // console.log( game.Common.getMinXYPointQuadraticJson(inJson));
        graphics.closePath();
        return graphics;
    }


    // for testing show the outer box
    p._drawTestBoundBox = function () {
        var graphics = this.cloudShape.graphics;
        graphics.endFill();
        graphics.setStrokeStyle(1);
        graphics.beginStroke('#fff');
        graphics.rect(this.minX, this.minY, this.maxX, this.maxY);
        graphics.beginStroke('#f55');
        graphics.rect(0, 0, this.maxX, this.maxY);
    }


    p._drawBoundingPolygon = function (colour) {
        var graphics = this.cloudShape.graphics;
        graphics.endFill();
        graphics.setStrokeStyle(1);
        graphics.beginStroke(colour);
        for (var ixSide = 0; ixSide < this.boundingPolygon.getNumberOfSides(); ixSide++) {
            if (ixSide == 0) {
                graphics.moveTo(this.boundingPolygon.center.x - this.x, this.boundingPolygon.center.y - this.y);
            } else {
                graphics.lineTo(this.boundingPolygon.points[ixSide].x - this.x, this.boundingPolygon.points[ixSide].y - this.y);
            }
        }
        graphics.closePath();
    }

    // for testing: draw "snow"
    p.addRain = function (graphics) {
        var graphics = new createjs.Graphics();
        var tmpAlpha;

        var tmpX = 0;
        var tmpY = 0;
        for (var i = 0; i < 5; i++) {
            tmpX = Math.round((Math.random()) * 400);
            tmpY = Math.round((Math.random() - 0.2) * 100);
            tmpAlpha = Math.random();
            graphics.beginFill(createjs.Graphics.getRGB(game.Common.getRandomColor(), tmpAlpha));
            graphics.setStrokeStyle(1);
            graphics.beginStroke('#fff');
            graphics.drawCircle(135 + tmpX, 300 + tmpY, 5);
        }

    }


    /**
     * load data from JSON and adjust cloud to the upper left corner
     */
    p.loadCloudData = function (inFillColor, inAlpha) {
        var rawCloudData = this.generateCloudData(inFillColor, inAlpha);
        var cloudData = game.Common.getAdjustedQuadraticJson(rawCloudData);
        return cloudData;
    }

    p._drawDebugShapes = function () {
        // ** TESTING:
        // Multiple drawing methods are possible in the same Graphics instance.
        // I added some random snow to the cloud graphics in this example:
        // cloudGraphics	= this.testDrawSnow(cloudGraphics);
        if (globals.DEBUG) {
            // this.addShadow();
            if (globals.DEBUG_CLOUD) {
//                this.testGetDataOnDoubleClick();
                this._drawTestBoundBox();
//                this.drawTestBoundCircle();
            }
            if (globals.DEBUG_COLLISION) {
                this._drawBoundingPolygon(globals.COLOUR_BOUNDING_POLYGON_NON_INTERSECT);
            }
        }
    }

    namespace.Cloud = Cloud;
}
    (game || (game = {})));
var game;