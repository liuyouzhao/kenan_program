DEFAULT_COMMAND_INTERVAL = 100;

class Context {
    constructor(hal) {
		this.logic = new Logic();
		this.lineExecutor = new CommandExecutor(this);
        this.commandIndex = 0;
        this.rawCommandArray = [];
        this.commands = [];
        this.eventHandler = hal.getEventTarget();
        this.init();
        this.hal = hal;
        Commands.init(this.lineExecutor);
        Commands.select(Commands.BLUEPRINT_V1);
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
                console.log(message, thiz.commandIndex, thiz.commands)
                var currentCommand = thiz.commands[thiz.commandIndex];
                thiz.lineExecutor.execute(currentCommand, thiz.getBlueprint()[currentCommand.cmd].runner, thiz);
            }
            else if(message == "all_over") {
                if(thiz.overCallback)
                    thiz.overCallback();
            }
        }, false);
    }
    
    getBlueprint() {
    	return Commands.selectedBlueprint;
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
