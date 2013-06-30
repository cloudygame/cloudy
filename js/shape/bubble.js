/*
 *
 *	Example: prototyping - cloudys
 *
 */

var game = game || {};

// this "outer/empty" function is needed becuase the inner functions, variables shouldn't generate into global cloudy
(function (cloudy) {

    var Bubble = function (initX, initY) {
        this.Container_initialize();

        this.boundingPolygon = null; // a Polygon object that bounds the Cloud. Used for collision detection

        this.spriteImg = null;
        this.bmpAnimation = null;

        this._initX = initX;
        this._initY = initY;

        // animation data
        this.directionAngle = null;
        this.speed = null;
        this.color = null;
        this.speed = null;

        this.shape = new createjs.Shape(new createjs.Graphics());
        this.addChild(this.shape);

        //bubble_sprite_test:
        //    this.initSprite();

        this.initBubble();

        this._addBoundingPoligon(this.x, this.y, this.scaleX);
        this.reDraw();
    }


    var p = Bubble.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;

    p.initBubble = function () {
        // set the direction for the movement
        this.speed = 3;
        this.x = this._initX;
        this.y = this._initY;

        this.scaledRadius = 30;

        this.alpha = 0.8;
        this.scaleX = 1;
        this.scaleY = 1;
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

        var d = this._calculateDirection(this.directionAngle) ;

        var i = this.speed;

        var vectorLength = Math.sqrt((d.fromX - d.toX) * (d.fromX - d.toX) + (d.fromY - d.toY) * (d.fromY - d.toY));
        var moveToX = Math.round(d.fromX + (d.toX - d.fromX) * i / vectorLength);
        var moveToY = Math.round(d.fromY + (d.toY - d.fromY) * i / vectorLength);

//        game.Common.log( moveX + "--" + moveY + " - -" + this.directionStep +" Ax"+ Ax + '--' +Ay + 'ttt' + Bx + '--' + By);

        this.x = moveToX;
        this.y = moveToY;

        this.boundingPolygon.move(new Point(this.x, this.y));
    }

    // set the angle, target points and store the start points for the movement line
    p.setDirectionAngle = function (angle) {
        this.directionAngle = angle;

        if (globals.DEBUG_BUBBLE) {
            var direction = this._calculateDirection(angle) ;
            var graphics = this.shape.graphics;
            graphics.setStrokeStyle(1);
            graphics.beginStroke('#fff');
            graphics.moveTo(direction.fromX, direction.fromY);
            graphics.lineTo(direction.toX, direction.toY);
        }
    }

    p._calculateDirection = function(angle){
        var direction = {};
        var radian = angle * 0.0174533;		// (Math.PI/180)
        var radius = globals.STAGE_WIDTH;
        direction.toX = Math.round(Math.cos(radian) * radius) + this.x;
        direction.toY = Math.round(Math.sin(radian) * radius) + this.y;
        direction.fromX = this.x;
        direction.fromY = this.y;
        return direction;
    }


    // creates a sprite bubble
    p.initSprite = function () {
        this.spriteImg = new Image();
        this.bmpAnimation = new createjs.BitmapAnimation(this.spriteSheet);

        this.spriteImg.onload = function (e) {
            this.addChild(this.bmpAnimation);
        };
        this.spriteImg.onerror = function (e) {
            alert("Error Loading Image (possible HTTP 404): " + e.target.src);
        };
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

        // start playing the first sequence:
        this.bmpAnimation.gotoAndPlay("spin"); //animate

        // set up a shadow. Note that shadows are ridiculously expensive. You could display hundreds
        // of animated rats if you disabled the shadow.
        this.bmpAnimation.shadow = new createjs.Shadow("#454", 33, 125, 41);

        this.bmpAnimation.name = "BubbleSprite";

        this.bmpAnimation.currentFrame = 0;
        this.bmpAnimation.alpha = 0.6;

        // the test bubble image is ellipsoid a bit ... khmm
        this.bmpAnimation.scaleX = 0.7;
    }


    p._addBoundingPoligon = function (x, y, scale) {
        var pCenter = new Point(x, y);
        var polygon = this.boundingPolygon = new Polygon(pCenter);
        polygon.addPoint(new Point(x - scale, y));
        polygon.addPoint(new Point(x - (scale * 0.707), y - (scale * 0.707)));
        polygon.addPoint(new Point(x, y - scale));
        polygon.addPoint(new Point(x + (scale * 0.707), y - (scale * 0.707)));
        polygon.addPoint(new Point(x + scale, y));
        polygon.addPoint(new Point(x + (scale * 0.707), y + (scale * 0.707)));
        polygon.addPoint(new Point(x, y + scale));
        polygon.addPoint(new Point(x - (scale * 0.707), y + (scale * 0.707)));

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

        createjs.Tween.get(this)
            .to({scaleX: 3, scaleY: 3, alpha: 0, y: this.y - 50}, 2000)
            .call(this._reinit);

    }

    p._reinit = function () {
        globals.bubbleArr.push(this);
        globals.prevBubbleDir	= 0;
        this.initBubble();
    }

    cloudy.Bubble = Bubble;

}(game));

