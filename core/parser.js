class Parser {
    constructor(commandTemplate) {
        this.commandHash = this.loadCommandTemplate(commandTemplate);
    }

    loadCommandTemplate(ct) {
        var hash = {};
        ct.forEach(c => {
            hash[c.cmd] = true;
        });
        return hash;
    }
    
    doParseLine(lineUpperCase) {
    	var cmd = null;
    	var args = [];
    	var argsIndex = 0;
		for (var i = 0; i < lineUpperCase.length; i++) {
			var ch = lineUpperCase.charAt(i);
			if(cmd == null && (ch == ' ' || ch == '\t' || i == lineUpperCase.length - 1)) {
				cmd = lineUpperCase.substring(0, i + 1);
				cmd = cmd.replace(/\s/g, "")
				argsIndex = i + 1;
				break;
			}
		}
		
		var argsStr = lineUpperCase.substring(argsIndex);
		argsStr = argsStr.replace(/\s/g, "");
		argsStr = argsStr.replace(/\t/g, "");
		args = argsStr.split(",");
		
		if(args.length == 1 && args[0] == "") {
			args = [];
		}
		
		for (var i = 0; i < args.length; i ++) {
			if(Number(args[i]) != NaN) {
				args[i] = Number(args[i]);
			}
		}
		
		var currentCommand = {};
		currentCommand.cmd = cmd;
		currentCommand.args = args;
		return currentCommand;
    }
    
    parseLine(line) {
    	var curCmd = this.doParseLine(line.toUpperCase());
    	
    	if(curCmd.cmd == null) {
    		return null;
    	}
        if(this.commandHash[curCmd.cmd]) {
           	return curCmd;
        }
        return null;
    }

	/* Obsolete */
    __parseLine(line) {
    	var lineUpperCase = line.toUpperCase();

        var cmd = line.substring(0, 2).toUpperCase();
        var arg = line.substring(2);

        if(cmd == null || !this.commandHash[cmd]) {
            return null;
        }
        if(this.commandHash[cmd]) {
            var current = {};
            current.cmd = cmd;
            current.arg = arg;
            return current;
        }
        return null;
    }

    check(commands) {
        var errors = [];
        var lines = commands.split("\n");
        var n = 0;
        lines.forEach(l => {
            if(l.length > 0) {
                var cmd = this.parseLine(l);
                if(cmd == null) {
                    errors[errors.length] = n;
                }
                n ++;
            }
        });
        return errors;
    }

    parse(commands) {
        var array = [];
        var lines = commands.split("\n");
        lines.forEach(l => {
            if(l.length > 0) {
                var cmd = this.parseLine(l);
                if(cmd != null) {
                    array[array.length] = cmd;
                }
            }
        });
        return array;
    }
}
