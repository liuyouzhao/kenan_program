DEFAULT_COMMAND_INTERVAL = 100;

class Command {
    constructor(hal) {
		this.logic = new Logic();
        this.commandTemplate = [
                   {cmd: "FD", ck: this.isNumeric, runner: this.INNER_FD},
                   {cmd: "BK", ck: this.isNumeric, runner: this.INNER_BK},
                   {cmd: "LT", ck: this.isNumeric, runner: this.INNER_LT},
                   {cmd: "RT", ck: this.isNumeric, runner: this.INNER_RT},
                   {cmd: "CO", ck: this.isColor, runner: this.INNER_CO},
                   {cmd: "SW", ck: this.isLineWidth, runner: this.INNER_SW},
                   {cmd: "JP", ck: this.isNumeric, runner: this.INNER_JP},
                   {cmd: "LOOP", ck: null, runner: this.INNER_LOOP},
                   {cmd: "END", ck: null, runner: this.INNER_END},
                   {cmd: "BRK", ck: null, runner: this.INNER_BRK},
                   {cmd: "SLEEP", ck: this.isNumeric, runner: this.INNER_SLEEP},
                   {cmd: "SPEED", ck: this.isNumeric, runner: this.INNER_SPEED}];

        this.parser = new Parser(this.commandTemplate);
        this.runnerHash = {};
        this.hal = hal;
        this.commandIndex = 0;
        this.parsedCommandArray = [];
        this.init();
    }

    init() {
        this.commandTemplate.forEach(ct => {
            this.runnerHash[ct.cmd] = ct.runner;
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

    checkCommand(commands) {
        return this.parser.check(commands);
    }

    runCommands(commands, overCallback) {
        this.parsedCommandArray = this.parser.parse(commands);
        this.overCallback = overCallback;
        
        if(!this.logic.validateLogicScope(this.parsedCommandArray)) {
        	throw "Logic Commands Error";
        }
        
        window.postMessage("run_command", '*');
    }

    isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
             !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }

    isColor(str) {
        var colors = [
        "aqua", "black", "blue", "fuchsia",
        "gray", "green", "lime", "maroon",
        "navy", "olive", "purple", "red",
        "silver", "teal", "white", "yellow", "orange", "pink"];
        var hash = {};
        colors.forEach(c => {
            hash[c] = true;
        });
        if(hash[str]) {
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
