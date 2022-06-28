class Compiler {

	constructor() {
        this.commands = {
           "FD": 		[this.isNumeric],
           "BK": 		[this.isNumeric],
           "LT": 		[this.isNumeric],
           "RT": 		[this.isNumeric],
       	   "JP": 		[this.isNumeric],
       	   "RST":		[],	
           "SLEEP": 	[this.isNumeric],
 
           "LOOP": 		[this.isNumericOrNull], 
           "END": 		[], 
           "BRK":		[],
           
           "CO":		[this.isColor],
           "LW": 		[this.isLineWidth],
           "SPEED": 	[this.isNumeric],
           
           "__EQUATION__": [this.isValidEquation]
      	};
      	
      	this.variables = {};
	}

    compile(rawCode) {
    	let parser = new Parser();
    	let logic = new Logic();
    	
    	/* Append new line on the end */
    	rawCode = rawCode + "\n"
    	
		/* replace comments */
		var pureCode = this.removeComments(rawCode);
		
    	/* Command name check */
    	let errors = parser.check(pureCode);
        let parsedCommandArray = parser.parse(pureCode);
        
        let thiz = this;
        /* Command arguments check */
        parsedCommandArray.forEach(cmd => {
    		var i = 0;
    		if(!thiz.isValidCommand(cmd.cmd)) {
    			errors.push(new CodeError(cmd.lineNumber, "Command not valid"));
    		}
    		else {
	        	thiz.commands[cmd.cmd].forEach(ck => {
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
        var compiledObject = {};
        compiledObject.commands = parsedCommandArray;
        compiledObject.variables = this.variables;
        compiledObject.errors = errors;
		return compiledObject;
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
    
    
	/**
		Validation Functions
	*/
	isValidCommand(commandName) {
		if(this.commands[commandName]) {
			return true;
		}
		return false;
	}
	
	isNumeric(str) {
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
             !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }
    
    isNumericOrNull(str) {
    	if(str == null)
    		return true;
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
             !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }
    
    isColor(str) {
        var colors = {
        "aqua":1, "black":1, "blue":1, "fuchsia":1,
        "gray":1, "green":1, "lime":1, "maroon":1,
        "navy":1, "olive":1, "purple":1, "red":1,
        "silver":1, "teal":1, "white":1, "yellow":1, "orange":1, "pink":1};

        if(colors[str.toLowerCase()] == 1) {
            return true;
        }
        return false;
    }

    isLineWidth(str) {
        try {
            return parseInt(str) <= 4 && parseInt(str) >= 0;
        }
        catch(ex) {
            console.log(ex);
            return false;
        }
    }
    
    maybeEquation(str) {
    
    }
    
    isValidEquation(str) {
    	
    }
    
	checkReservationNames(name) {
		switch(name) {
			case "PI":
			case "E":
			case "LN10":
			case "LN2":
			case "LOG10E":
			case "LOG2E":
			case "SQRT1_2":
			case "SQRT2":
				throw name + " is used as an existing constant. Please use another name as variable";
			default:
				break;
		}
		if(this.commands[name]) {
			throw name + " is a command, please use another name as variable";
		}
	}
}
