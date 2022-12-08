'use strict';

const BAT_MIN_SCALE = 0.1;
const BAT_MAX_SCALE = 1.2

class Bat extends TransitionSprite {

    constructor(areaCanvas, tile, x, y) {

        // tileOrImage, 
        // x = 0, 
        // y = 0, 
        // baseX = 0, 
        // baseY = 0, 
        // row = 1, 
        // col = 1,
        // alpha = 1.0, 
        // patternCount = 1, 
        // delayFrame = 1, 
        // startPattern = 0, 
        // roundTrip = false, 
        // reverse = false, 
        // repeat = 0, 
        // hideWhenFinish = false

        super(tile, x, y, 0, 0, 1, 1, 1, 20, 1, 0, true, false, 0, false);
        this.setBaseCenter();

    }
}