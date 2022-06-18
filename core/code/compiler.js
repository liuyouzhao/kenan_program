class Compiler {

    compile(rawCode, blueprint) {
    	let parser = new Parser();
    	let logic = new Logic();
    	
    	/* Append new line on the end */
    	rawCode = rawCode + "\n"
    	
		/* replace comments */
		let pureCode = this.removeComments(rawCode);
		
    	/* Command name check */
    	let errors = parser.check(pureCode);
        let parsedCommandArray = parser.parse(pureCode);
        
        /* Command arguments check */
        parsedCommandArray.forEach(cmd => {
    		var i = 0;
    		if(!blueprint.isValidCommand(cmd.cmd)) {
    			errors.push(new CodeError(cmd.lineNumber, "Command not valid"));
    		}
    		else {
	        	blueprint.get()[cmd.cmd].checker.forEach(ck => {
		    		if(!ck(cmd.args[i++])) {
		    			errors.push(new CodeError(cmd.lineNumber, "arguments check fail: " + ck + " :" + cmd.lineNumber))
		    		}
        		});
    		}
        })
        
    	var logicError = logic.validateLogicScope(parsedCommandArray);
        if(logicError != null) {
        	errors.push(logicError);
        }
        var result = {};
        result.commands = parsedCommandArray;
        result.errors = errors;
		return result;
    }
    
    removeComments(rawCommands) {
    	var result = "";
    	for( var i = 0; i < rawCommands.length - 1; i ++ ) {
    		// match /*
    		if(rawCommands.charAt(i) == '/') {
    			if(rawCommands.charAt(i + 1) == '*') {
    				var j = i + 2;
	    			for( ; j < rawCommands.length - 1; j ++ ) {
						if(rawCommands.charAt(j) == '*' && rawCommands.charAt(j + 1) == '/') {
							break;
						}
						if(rawCommands.charAt(j) == '\n') {
							result = result + '\n';
						}
    				}
    				i = j + 1;
    			}
    			else if (rawCommands.charAt(i + 1) == '/') {
    				var j = i + 2;
    				for( ; j < rawCommands.length - 1; j ++ ) {
    					if(rawCommands.charAt(j) == '\n') {
    						break;
    					}
    				}
    				result = result + '\n';
    				i = j;
    			}
    		}
			else {
				result = result + rawCommands.charAt(i); 
			}
    	}
    	return result;
    }
}
