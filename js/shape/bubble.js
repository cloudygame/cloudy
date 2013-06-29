/*
 *
 *	Example: prototyping - cloudys
 *
 */

var game = game || {};

// this "outer/empty" function is needed becuase the inner functions, variables shouldn't generate into global cloudy
(function (cloudy) {

    var Bubble = function (inX, inY) {


        this.scaledRadius = null;
        this.container = null;
        this.shape = null;
        this.debugShape = null;
        this.boundingPolygon = null; // a Polygon object that bounds the Cloud. Used for collision detection

        this.spriteImg = null;
        this.bmpAnimation = null;

        // animation data
        this.directionAngle = null;
        this.directionToX = null;
        this.directionToY = null;
        this.directionFromX = null;
        this.directionFromY = null;
        this.directionStep = null;
        this.speed = null;
        this.color = null;
        this.prevBubbleDir = null;

        this.speed = null;
        this.shapeAlpha = null;

        this.shape = new createjs.Shape(new createjs.Graphics());

        this.debugShape = new createjs.Shape(new createjs.Graphics());

        this.container = new createjs.Container();
        this.container.addChild(this.shape);
        this.container.addChild(this.debugShape);

        //bubble_sprite_test:
        //    this.initSprite();

        this.initBubble();

        this._addBoundingPoligon(this.shape.x, this.shape.y, this.scaledRadius);
        this.reDraw();
    }


    var p = Bubble.prototype;

    p.initBubble = function () {
        // set the direction for the movement
        this.speed = 3;
        this.shapeAlpha = 0.8;
        this.shape.x = globals.STAGE_WIDTH / 2 - 200;
        this.shape.y = globals.STAGE_HEIGHT - 20;

        this.scaledRadius = 30;
        this.directionStep = 0;
        this.prevBubbleDir = 0;

        this.shape.alpha = this.shapeAlpha;
        this.shape.scaleX = 1;
        this.shape.scaleY = 1;
        this.shape.graphics.clear();
        this.setDirectionAngle(270);			// default
        this.reDraw();
    }

    p.reDraw = function () {
        // creates a simple circle bubble shape with gradient fill
        var graphics = this.shape.graphics;
        graphics.beginRadialGradientFill(["#E7EAF8", "#3A5BCB"], [0, 1], 20, 20, 0, 0, 0, 50);
        graphics.setStrokeStyle(1);
        graphics.beginLinearGradientStroke(["#9AA7E4", "#F4F5FD"], [0, 1], -1 * this.scaledRadius, -1 * this.scaledRadius, this.scaledRadius, this.scaledRadius);
        graphics.drawCircle(0, 0, this.scaledRadius);
    }


    // We have to move the bubble on a calculated line to the target direction X and Y because the current angle*speed = always 1/0 when the speed is low.
    p.move = function () {
        // calculate the offset vector with angle * speed - WRONG
        // var radian	= this.directionAngle * 0.0174533;		// (Math.PI/180)
        // var radius	= this.speed;
        // var moveX	= Math.round(Math.cos(radian) * radius);
        // var moveY	= Math.round(Math.sin(radian) * radius);

        // this.directionStep	+= this.speed+1;
        this.directionStep += this.speed;

        var Ax = this.directionFromX;
        var Ay = this.directionFromY;
        var Bx = this.directionToX;
        var By = this.directionToY;
        var i = this.directionStep;

        var lineLength = Math.sqrt((Ax - Bx) * (Ax - Bx) + (Ay - By) * (Ay - By));
        var moveX = Math.round(Ax + (Bx - Ax) * i / lineLength);
        var moveY = Math.round(Ay + (By - Ay) * i / lineLength);

        // game.Common.log( moveX + "--" + moveY + " - -" + this.directionStep +" Ax"+ Ax + '--' +Ay + 'ttt' + Bx + '--' + By);

        this.shape.x = moveX;
        this.shape.y = moveY;

        this.boundingPolygon.move(new Point(this.shape.x, this.shape.y));
    }

    // set the angle, target points and store the start points for the movement line
    p.setDirectionAngle = function (angle) {
        this.directionAngle = angle;
        this.directionStep = 0;
        var radian = angle * 0.0174533;		// (Math.PI/180)
        var radius = globals.STAGE_WIDTH;
        this.directionToX = Math.round(Math.cos(radian) * radius) + this.shape.x;
        this.directionToY = Math.round(Math.sin(radian) * radius) + this.shape.y;
        this.directionFromX = this.shape.x;
        this.directionFromY = this.shape.y;

//		game.Common.log('Bubble.setDirectionAngle: angle=' + angle + ' from x:y=' + this.directionFromX + ':' + this.directionFromY + ' to x:y=' + this.directionToX + ':' + this.directionToY );
        if (globals.DEBUG_BUBBLE) {
            this.debugShape.graphics.setStrokeStyle(1);
            this.debugShape.graphics.beginStroke('#fff');
            this.debugShape.graphics.moveTo(this.directionFromX, this.directionFromY);
            this.debugShape.graphics.lineTo(this.directionToX, this.directionToY);
            // this.debugShape.graphics.lineTo( this.shape.regX, this.shape.regY );
            // this.debugShape.graphics.lineTo( this.shape.x, this.shape.y );
        }
    }


    // creates a sprite bubble
    p.initSprite = function () {
        this.spriteImg = new Image();
        this.spriteImg.onload = p.handleImageLoad;
        this.spriteImg.onerror = p.handleImageError;
        this.spriteImg.src = "img/bubbletest2.png";

        // create spritesheet and assign the associated data.

        this.spriteSheet = new createjs.SpriteSheet({
            // image to use
            images: [this.spriteImg],
            // width, height & registration point of each sprite
            frames: {width: 92, height: 60, regX: 32, regY: 32},
            animations: {

                spin: {
                    frames: [0, 1, 2, 3, 4, 5, 6],
                    next: 'respin',
                    frequency: 2		// set the animation speed
                },
                // test only - revert spin
                respin: {
                    frames: [6, 5, 4, 5, 6],
                    next: 'spin',
                    frequency: 2		// set the animation speed
                }
            },
        });


        // create a BitmapAnimation instance to display and play back the sprite sheet:
        this.bmpAnimation = new createjs.BitmapAnimation(this.spriteSheet);

        // start playing the first sequence:
        this.bmpAnimation.gotoAndPlay("spin"); //animate

        // set up a shadow. Note that shadows are ridiculously expensive. You could display hundreds
        // of animated rats if you disabled the shadow.
        this.bmpAnimation.shadow = new createjs.Shadow("#454", 33, 125, 41);

        this.bmpAnimation.name = "monster1";
        this.bmpAnimation.x = globals.STAGE_WIDTH / 2;
        this.bmpAnimation.y = globals.STAGE_HEIGHT;

        // have each monster start at a specific frame
        this.bmpAnimation.currentFrame = 0;
        this.bmpAnimation.alpha = 0.6;

        // the test bubble image is ellipsoid a bit ... khmm
        this.bmpAnimation.scaleX = 0.7;
    }

    //called if there is an error loading the image (usually due to a 404)
    p.handleImageError = function (e) {
        alert("Error Loading Image : " + e.target.src);
    }


    p.handleImageLoad = function (e) {
        this.show();
    }

    // p.getCenterX	= function(){
    // 	var centerX = this.shape.x+this.scaledRadius;
    // 	return centerX;
    // }

    // p.getCenterY	= function(){
    // 	var centerY = this.shape.y+this.scaledRadius;
    // 	return centerY;
    // }

    p._addBoundingPoligon = function (x, y, scaledRadius) {
        var pCenter = new Point(x, y);
        this.boundingPolygon = new Polygon(pCenter);
        this.boundingPolygon.addPoint(new Point(x - scaledRadius, y));
        this.boundingPolygon.addPoint(new Point(x - (scaledRadius * 0.707), y - (scaledRadius * 0.707)));
        this.boundingPolygon.addPoint(new Point(x, y - scaledRadius));
        this.boundingPolygon.addPoint(new Point(x + (scaledRadius * 0.707), y - (scaledRadius * 0.707)));
        this.boundingPolygon.addPoint(new Point(x + scaledRadius, y));
        this.boundingPolygon.addPoint(new Point(x + (scaledRadius * 0.707), y + (scaledRadius * 0.707)));
        this.boundingPolygon.addPoint(new Point(x, y + scaledRadius));
        this.boundingPolygon.addPoint(new Point(x - (scaledRadius * 0.707), y + (scaledRadius * 0.707)));

        if (globals.DEBUG_COLLISION) {
            this.drawBoundingPolygon();
        }
    }


    p.drawBoundingPolygon = function () {
        cloudy.collision.drawBoundingPolygon(this.shape.graphics, this.boundingPolygon, globals.COLOUR_BOUNDING_POLYGON_NON_INTERSECT);
    }


    /**
     * bumm:
     * - remove bubble
     * - start bumm effect
     * - change the collided cloud status
     */
    p.bumm = function () {
        // remove temorary in order to turn off collision detection
        var index = globals.bubbleArr.indexOf(this);
        globals.bubbleArr.splice(index, 1);

        var graphics = this.shape.graphics;
        var rndX = 0;
        var rndY = 0;
        var rndRadius = 40;
        graphics.clear();
        for (var i = 0; i < 5; i++) {
            tmpAlpha = Math.random();
            graphics.beginFill(createjs.Graphics.getRGB(game.Common.getRandomColor(), tmpAlpha));
            graphics.setStrokeStyle(1);
            graphics.beginStroke('#fff');
            rndX = -rndRadius / 2 + Math.random() * rndRadius;
            rndY = -rndRadius / 2 + Math.random() * rndRadius;
            graphics.drawCircle(rndX, rndY, 2);
        }

        var bubble = this;
        createjs.Tween.get(this.shape)
            .to({scaleX: 3, scaleY: 3, alpha: 0, y:this.shape.y-50}, 2000)
            .call(function(){
                bubble._reinit(bubble);
            });

    }

    p._reinit = function(bubble){

//        globals.bubbleArr[0]	= new game.Bubble( 30, 30 );
//        globals.layerBubble.addChild(globals.bubbleArr[i].container);
//        globals.layerBubble.removeChild(this);

        globals.bubbleArr.push(bubble);
        bubble.initBubble();
    }

// connect the Bubble to the game cloudy
    cloudy.Bubble = Bubble;

}(game));

