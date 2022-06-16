DEFAULT_COMMAND_INTERVAL = 100;

class Command {
    constructor(hal) {
		this.logic = new Logic();
        this.commandTemplate = [
                   {cmd: "FD", ckr: [this.isNumeric], runner: this.INNER_FD},
                   {cmd: "BK", ckr: [this.isNumeric], runner: this.INNER_BK},
                   {cmd: "LT", ckr: [this.isNumeric], runner: this.INNER_LT},
                   {cmd: "RT", ckr: [this.isNumeric], runner: this.INNER_RT},
                   {cmd: "CO", ckr: [this.isColor], runner: this.INNER_CO},
                   {cmd: "SW", ckr: [this.isLineWidth], runner: this.INNER_SW},
                   {cmd: "JP", ckr: [this.isNumeric], runner: this.INNER_JP},
                   {cmd: "LOOP", ckr: [this.isNumericOrNull], runner: this.INNER_LOOP},
                   {cmd: "END", ckr: [], runner: this.INNER_END},
                   {cmd: "BRK", ckr: [], runner: this.INNER_BRK},
                   {cmd: "SLEEP", ckr: [this.isNumeric], runner: this.INNER_SLEEP},
                   {cmd: "SPEED", ckr: [this.isNumeric], runner: this.INNER_SPEED}];
		
        this.parser = new Parser(this.commandTemplate);
        this.runnerHash = {};
        this.checkerHash = {};
        this.hal = hal;
        this.commandIndex = 0;
        this.rawCommandArray = [];
        this.parsedCommandArray = [];
        this.init();
    }

    init() {
        this.commandTemplate.forEach(ct => {
            this.runnerHash[ct.cmd] = ct.runner;
            this.checkerHash[ct.cmd] = ct.ckr;
        });

        var thiz = this;
        window.addEventListener("message", function(event) {
            var message = event.data;
            if(message == "run_command") {
                if(thiz.commandIndex == thiz.parsedCommandArray.length) {
                    window.postMessage("all_over", '*');
                    return;
                }
                console.log(message, thiz.commandIndex, thiz.parsedCommandArray)
                var currentCommand = thiz.parsedCommandArray[thiz.commandIndex];
                thiz.runnerHash[currentCommand.cmd](thiz, currentCommand.args);
            }
            else if(message == "all_over") {
                if(thiz.overCallback)
                    thiz.overCallback();
            }
        }, false);
    }

    reset() {
        this.commandIndex = 0;
        this.parsedCommandArray = [];
        this.logic = new Logic();
    }
    
    goto(index) {
    	this.commandIndex = index;
    	window.postMessage("run_command", '*');
    }
    
    next() {
    	this.commandIndex ++;
    	return this.parsedCommandArray[this.commandIndex];
    }
    
    runNext() {
    	this.commandIndex ++;
    	window.postMessage("run_command", '*');
    }
    
    runNextDelay(ms) {
    	this.commandIndex ++;
    	window.setTimeout(function() {
    		window.postMessage("run_command", '*');
    	}, ms);
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

    compile(commands) {
   
		/* replace comments */
		commands = this.removeComments(commands);
		
		console.log(commands);
		
    	/* Command name check */
    	var errors = this.parser.check(commands);
        this.parsedCommandArray = this.parser.parse(commands);
        
        /* Command arguments check */
        let ct = this.checkerHash;
        this.parsedCommandArray.forEach(cmd => {
    		var i = 0;
        	ct[cmd.cmd].forEach(ck => {
        		if(!ck(cmd.args[i++])) {
        			errors.push(new CodeError(cmd.line - 1, "arguments check fail: " + ck))
        		}
        	})
        })
        
    	var logicError = this.logic.validateLogicScope(this.parsedCommandArray);
        if(logicError != null) {
        	errors.push(logicError);
        }
        return errors;
    }

    run(commands, overCallback) {
        this.overCallback = overCallback;
        window.postMessage("run_command", '*');
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

    /**
        COMMAND EXECUTOR
    */
    INNER_FD(thiz, args) {
        thiz.hal.__fd__(args[0], function() {
        	thiz.runNext();
        });
    }

    INNER_BK(thiz, args) {
        thiz.hal.__bk__(args[0], function() {
        	thiz.runNext();
        });
    }

    INNER_LT(thiz, args) {
        thiz.hal.__lt__(args[0], function() {
        	thiz.runNext();
        });
    }

    INNER_RT(thiz, args) {
        thiz.hal.__rt__(args[0], function() {
        	thiz.runNext();
        });
    }

    INNER_CO(thiz, args) {
        thiz.hal.__co__(args[0], function() {
        	thiz.runNext();
        });
    }

    INNER_SW(thiz, args) {
        thiz.hal.__sw__(args[0], function() {
        	thiz.runNext();
        });
    }

    INNER_JP(thiz, args) {
        thiz.hal.__jp__(args[0], function() {
        	thiz.runNext();
        });
    }
    
    INNER_LOOP(thiz, args) {
    	thiz.logic.stepIn(thiz.commandIndex, thiz.parsedCommandArray, args);
    	thiz.runNext();
    }
    
    INNER_END(thiz, args, cb) {
		var ended = thiz.logic.consumeScope();
		if(ended) {
			thiz.goto(thiz.logic.stepOut() + 1);
		}
		else {
			thiz.goto(thiz.logic.getBeginIndex());
		}
    }
    
    INNER_BRK(thiz, args, cb) {
    	thiz.goto(thiz.logic.stepOut() + 1);
    }
    
    INNER_SLEEP(thiz, args, cb) {
    	thiz.runNextDelay(args[0]);
    }
    
    INNER_SPEED(thiz, args, cb) {
    	thiz.hal.__speed__(args[0], function() {
    		thiz.runNext();
    	})
    }
}
