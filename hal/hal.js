
class Hal {
    constructor(paint, cursor) {
        this.paint = paint;
        this.cursor = cursor;
        this.hal_animation = new Hal_Animation(paint, cursor);
        this.platform = new Platform();
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
        this.paint.setLineColor(arg.toLowerCase());
        cb();
    }

    __sw__(arg, cb) {
        this.paint.setLineWidth(arg);
        cb();
    }
    __jp__(arg, cb) {
        this.hal_animation.__ani_jp__(arg, cb);
    }
    __speed__(arg, cb) {
    	this.hal_animation.__ani_speed__(arg, cb);
    }
    
    __rst__(arg, cb) {
    	this.paint.resetCursor(this.cursor);
    	cb();
    }
    
    getEventTarget() {
    	return this.platform.getEventTarget();
    }
}
