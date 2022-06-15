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

    constructor(command, begin, end, conditions, args) {
    	super(command, begin, end);
    	this.conditions = conditions;
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
