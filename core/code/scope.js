class ScopeFactory {

	constructor() {
		this.template = {
			"LOOP": function(c, b, e, a) {
				return new Loop(c, b, e, a);
			}
		}
	}

	build(command, begin, end, args) {
		return this.template[command](command, begin, end, args);
	}
}

class Scope {
    constructor(command, begin, end) {
    	this.command = command;
        this.begin = begin;
        this.end = end;
    }
    
    tick() {
    	return true;
    }
}


class Loop extends Scope {

    constructor(command, begin, end, args) {
    	super(command, begin, end);
    	this.times = args[0];
    	this.current = 0;
    }
    
	tick() {
		this.current ++;
		if(this.current == this.times) {
			return true;
		}
		return false;
	}
    
}
