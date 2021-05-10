class Hal_Animation {
    constructor(paint, cursor) {
        this.paint = paint;
        this.cursor = cursor;
        this.pace = 5;
        this.paceAngle = 0.1;
        this.currentFrame = 0;
        this.allFrame = 0;
        this.compensation = 0;
    }

    prepareFramesLine(distance) {
        this.compensation = 0;
        this.currentFrame = 0;
        this.allFrame = Math.floor(distance / this.pace) + 1;
        this.compensation = distance % this.pace;
    }

    prepareFrameAngle(angle) {
        this.compensation = 0;
        this.currentFrame = 0;
        this.allFrame = Math.floor(angle / this.paceAngle) + 1;
        this.compensation = angle % this.paceAngle;
    }

    startFrames(executor, finishCallback) {
        var thiz = this;
        var interval = window.setInterval(function() {
            try {
                executor(thiz, thiz.currentFrame, thiz.allFrame);
                thiz.currentFrame ++;

                if(thiz.currentFrame == thiz.allFrame) {
                    window.clearInterval(interval);
                    finishCallback();
                }
            }
            catch(e) {
                console.log(e);
                window.clearInterval(interval);
            }

        }, 20);
    }

    __ani_fd__(arg, cb) {
        this.prepareFramesLine(arg);
        this.startFrames(function(thiz, cf, af) {
            if(thiz.currentFrame == thiz.allFrame - 1) {
                thiz.cursor.setSpeed(thiz.compensation);
            }
            else {
                thiz.cursor.setSpeed(thiz.pace);
            }
            var fx = thiz.cursor.x; var fy = thiz.cursor.y;
            thiz.cursor.moveForward();
            var tx = thiz.cursor.x; var ty = thiz.cursor.y;

            thiz.paint.drawLine(fx, fy, tx, ty);
            thiz.paint.drawCursor(thiz.cursor);
        }, cb);
    }

    __ani_bk__(arg, cb) {
        this.prepareFramesLine(arg);
        this.startFrames(function(thiz, cf, af) {
            if(thiz.currentFrame == thiz.allFrame - 1) {
                thiz.cursor.setSpeed(thiz.compensation);
            }
            else {
                thiz.cursor.setSpeed(thiz.pace);
            }
            var fx = thiz.cursor.x; var fy = thiz.cursor.y;
            thiz.cursor.moveBackward();
            var tx = thiz.cursor.x; var ty = thiz.cursor.y;

            thiz.paint.drawLine(fx, fy, tx, ty);
            thiz.paint.drawCursor(thiz.cursor);
        }, cb);
    }

    __ani_lt__(arg, cb) {
        this.prepareFrameAngle(arg);
        this.startFrames(function(thiz, cf, af) {
            if(thiz.currentFrame == thiz.allFrame - 1) {
                thiz.cursor.setDirection(thiz.cursor.dir - thiz.compensation)
            }
            else {
                thiz.cursor.setDirection(thiz.cursor.dir - thiz.paceAngle)
            }
            thiz.paint.drawCursor(thiz.cursor);
        }, cb);
    }
    __ani_rt__(arg, cb) {
        this.prepareFrameAngle(arg);
        this.startFrames(function(thiz, cf, af) {
            if(thiz.currentFrame == thiz.allFrame - 1) {
                thiz.cursor.setDirection(thiz.cursor.dir + thiz.compensation)
            }
            else {
                thiz.cursor.setDirection(thiz.cursor.dir + thiz.paceAngle)
            }
            thiz.paint.drawCursor(thiz.cursor);
        }, cb);
    }
}

class Hal {
    constructor(paint, cursor) {
        this.paint = paint;
        this.cursor = cursor;
        this.hal_animation = new Hal_Animation(paint, cursor);
    }

    __fd__(arg, cb) {
        this.hal_animation.__ani_fd__(arg, cb);
    }

    __bk__(arg, cb) {
        this.hal_animation.__ani_bk__(arg, cb);
    }

    __lt__(arg, cb) {
        this.hal_animation.__ani_lt__(arg / 180.0 * Math.PI, cb);
    }

    __rt__(arg, cb) {
        this.hal_animation.__ani_rt__(arg / 180.0 * Math.PI, cb);
    }

    __co__(arg, cb) {
        this.paint.setLineColor(arg);
        cb();
    }

    __sw__(arg, cb) {
        this.paint.setLineWidth(arg);
        cb();
    }
}
