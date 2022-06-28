DEFAULT_COMMAND_INTERVAL = 100;

class Context {
    constructor(hal) {
		this.logic = new Logic();
		this.executor = new CommandExecutor(this);
        this.commandIndex = 0;
        this.rawCommandArray = [];
        this.commands = [];
        this.eventHandler = hal.getEventTarget();
        this.init();
        this.hal = hal;
        this.variables = {};
    }

    init() {
        var thiz = this;
        this.eventHandler.addEventListener("message", function(event) {
            var message = event.data;
            if(message == "run_command") {
                if(thiz.commandIndex == thiz.commands.length) {
                    thiz.eventHandler.postMessage("all_over", '*');
                    return;
                }
                var currentCommand = thiz.commands[thiz.commandIndex];
                thiz.executor.execute(currentCommand, thiz);
            }
            else if(message == "all_over") {
                if(thiz.overCallback)
                    thiz.overCallback();
            }
        }, false);
    }
    

    reset() {
        this.commandIndex = 0;
        this.commands = [];
        this.logic = new Logic();
    }
    
    goto(index) {
    	this.commandIndex = index;
    	this.eventHandler.postMessage("run_command", '*');
    }
    
    next() {
    	this.commandIndex ++;
    	return this.commands[this.commandIndex];
    }
    
    runNext() {
    	this.commandIndex ++;
    	this.eventHandler.postMessage("run_command", '*');
    }
    
    runNextDelay(ms) {
    	this.commandIndex ++;
    	let thiz = this;
    	this.eventHandler.setTimeout(function() {
    		thiz.eventHandler.postMessage("run_command", '*');
    	}, ms);
    }
    
    run(commands, overCallback) {
    	this.commands = commands;
        this.overCallback = overCallback;
        this.eventHandler.postMessage("run_command", '*');
    }
}
