class Cursor {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.offsetWidth = w / 2;
        this.offsetHeight = h / 2;
        this.speed = 0;
        this.dir = 0;
    }

    setSpeed(s) {
        this.speed = s;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    setDirection(dir) {
        this.dir = dir;
    }

    moveForward() {
        this.x += this.speed * Math.sin(this.dir);
        this.y -= this.speed * Math.cos(this.dir);
    }

    moveBackward() {
        this.x -= this.speed * Math.sin(this.dir);
        this.y += this.speed * Math.cos(this.dir);
    }

    reset(ox, oy) {
        var x = ox;
        var y = oy;
        this.setPosition(x, y);
        this.setDirection(0);
    }
}

class Paint {
    constructor(canvas, canvasCar, cursor) {
        this.cursorImage = new Image();
        this.cursorImage.src = "resource/car.png"
        this.cursorWidth = 20;
        this.cursorHeight = 30;
        this.cursorOffsetWidth = 10;
        this.cursorOffsetHeight = 15;
        this.cursor = cursor;
        var thiz = this;
        this.cursorImage.onload = function() {
            thiz.reset(thiz.cursor);
        }
        this.canvasCar = canvasCar;
        this.contextCar = canvasCar.getContext("2d");
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.lastRect = {};
        this.lastRect.x = 0;
        this.lastRect.y = 0;
        this.lastRect.size = 60;
        this.defaultLineWidths = [4, 8, 12, 16, 20];
    }

    graphicImageReady() {
        this.contextCar.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.lineWidth = this.defaultLineWidths[0];
        this.context.strokeStyle = "white";
        this.context.lineCap = "round";
    }

    drawCursor(cursor) {
        this.INNER__drawCursor(this.contextCar, cursor.x, cursor.y, cursor.width, cursor.height, cursor.offsetWidth, cursor.offsetHeight, cursor.dir);
    }

    INNER__drawCursor(ctx, x, y, w, h, sw, sh, dir) {
        ctx.clearRect(this.lastRect.x, this.lastRect.y, this.lastRect.size, this.lastRect.size);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(dir);
        ctx.drawImage(this.cursorImage, 0, 0, this.cursorImage.width, this.cursorImage.height, -sw, -sh, w, h);
        ctx.restore();

        this.lastRect.x = x - this.cursorWidth - this.cursorOffsetWidth;
        this.lastRect.y = y - this.cursorHeight - this.cursorOffsetHeight;
    }

    reset(cursor) {
        this.graphicImageReady();
        if(cursor) {
            cursor.reset(this.canvasCar.width / 2 - this.cursorOffsetWidth, this.canvasCar.height / 2 - this.cursorOffsetHeight);
            this.drawCursor(cursor);
        }
    }

	resetCursor(cursor) {
        if(cursor) {
            cursor.reset(this.canvasCar.width / 2 - this.cursorOffsetWidth, this.canvasCar.height / 2 - this.cursorOffsetHeight);
            this.drawCursor(cursor);
        }
	}

    /***
        Line attribute functions
    */
    setLineWidth(lineWidth) {
        this.context.lineWidth = this.defaultLineWidths[lineWidth];
    }

    setLineColor(color) {
        this.context.strokeStyle = color;
    }

    /**
        Line drawing functions
    */
    drawLine(fx, fy, tx, ty) {
        this.context.beginPath();
        this.context.moveTo(fx, fy);
        this.context.lineTo(tx, ty);
        this.context.stroke();
    }
}
