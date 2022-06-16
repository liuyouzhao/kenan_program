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
        this.scopeFactory = new ScopeFactory();
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
		var errorLine = -1;
		commands.forEach(cmd => {
			if(this.isLeft(cmd)) {
				top ++;
				errorLine = cmd.line;
			}
			else if(this.isRight(cmd)) {
				top --;
				errorLine = cmd.line;
			}
		})
		if(top != 0) {
			return new CodeError(errorLine - 1, "Logic start and end not match");
		}
		return null;
	}

    stepIn(index, commands, args) {
    
    	if(this.currentScope && this.currentScope.begin == index) {
    		return;
    	}
    
    	var scope = this.scopeFactory.build(commands[index].cmd, index, UNKNOWN, args);
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
    	if(this.scopeStacks.length == 0) {
    		this.currentScope = null;
    	}
    	else {
    		this.currentScope = this.scopeStacks[this.scopeStacks.length - 1];
    	}
    	return popped.end;
    }
    
    getEndIndex() {
    	return this.currentScope.end;
    }
    
    getBeginIndex() {
    	return this.currentScope.begin;
    }
    
    consumeScope() {
    	return this.currentScope.tick();
    }
    
    clear() {
    	this.logicStack = [];
    }
    
}
