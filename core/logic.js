UNKNOWN = -1

class Logic {
    constructor() {
        this.scopeStacks = []
        this.leftValues = { 
        	"LOOP" : "END", 
        	"IF" : "END" 		
        };
    	this.rightValues = {	
        	"END" : true		
        };
        this.currentScope = null;
    }
    
    isLeft(cmd) {
    	if(this.leftValues[cmd.cmd]) {
    		return true;
    	}
    	return false;
    }
    
    isRight(cmd) {
    	if(this.rightValues[cmd.cmd]) {
    		return true;
    	}
    	return false;
    }
    
	validateLogicScope(commands) {
		var top = 0;
		commands.forEach(cmd => {
			if(this.isLeft(cmd))
				top ++;
			else if(this.isRight(cmd))
				top --;
		})
		return top == 0;
	}

    stepIn(index, commands) {
    
    	if(this.currentScope && this.currentScope.begin == index) {
    		return;
    	}
    
    	var scope = new Scope(commands[i], index, UNKNOWN);
    	var top = 0;
    	
    	for(var i = index; i < commands.length; i ++) {
    		var cmd = commands[i];
    		
    		if(this.isLeft(cmd)) {
    			top ++;
    		}
    		else if(this.isRight(cmd)) {
    			top --;
    		}
    		
    		if(top == 0) {
    			scope.end = i;
    			break;
    		}
    	}
    	this.currentScope = scope;
    	this.scopeStacks.push(scope);
    }
    
    stepOut() {
    	var popped = this.scopeStacks.pop();
    	return popped.end;
    }
    
    getEndIndex() {
    	return this.currentScope.end;
    }
    
    getBeginIndex() {
    	return this.currentScope.begin;
    }  
    
    clear() {
    	this.logicStack = [];
    }
    
}
