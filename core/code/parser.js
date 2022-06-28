class Parser {

	constructor() {
		this.varCache = {};
		this.varNames = [];
	}

    doParseLine(lineUpperCase, lineNumber) {
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
			if(!isNaN(args[i])) {
				args[i] = Number(args[i]);
			}
		}
		
		return new CommandLine(lineUpperCase, lineNumber, cmd, args);
    }
    
    parseLine(line, lineNumber) {
    	var curCmd = this.doParseLine(line.toUpperCase(), lineNumber);
    	if(curCmd.cmd == null) {
    		return null;
    	}
        return curCmd;
    }
    
    check(commands) {
        var errors = [];
        var lines = commands.split("\n");
        var lineNumber = 0;
        lines.forEach(l => {
        	lineNumber ++;
            if(l.length > 0) {
            	l = this.removeSpaceHeader(l);
            	if(l != null) {
	                var cmd = this.parseLine(l, lineNumber);
		            if(cmd == null) {
		                errors[errors.length] = new CodeError(lineNumber, "command cannot be parsed");
		            }
            	}
            }
        });
        return errors;
    }
    
    removeSpaceHeader(line) {
		for (var i = 0; i < line.length; i++) {
			var ch = line.charAt(i);
			if(ch != " " && ch != "\t") {
				return line.substring(i);
			}
		}
		return null;
    }

    parse(commands) {
        var array = [];
        var lines = commands.split("\n");
        var lineNumber = 0;
        lines.forEach(l => {
        	lineNumber ++;
            if(l.length > 0) {
            	l = this.removeSpaceHeader(l);
            	if(l != null) {
	                var cmd = this.parseLine(l, lineNumber);
	                array.push(cmd);
            	}
            }
        });
        return array;
    }
}
