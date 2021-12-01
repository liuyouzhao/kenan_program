class Parser {
    constructor(commandTemplate) {
        this.commandHash = this.loadCommandTemplate(commandTemplate);
    }

    loadCommandTemplate(ct) {
        var hash = {};
        ct.forEach(c => {
            hash[c.cmd] = c.ck;
        });
        return hash;
    }

    parseLine(line) {
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
            l = l.replace(/ /g, "");
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
            l = l.replace(/ /g, "");
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


class Command {
    constructor(hal) {

        this.commandTemplate = [
                   {cmd: "FD", ck: this.isNumeric, runner: this.INNER_FD},
                   {cmd: "BK", ck: this.isNumeric, runner: this.INNER_BK},
                   {cmd: "LT", ck: this.isNumeric, runner: this.INNER_LT},
                   {cmd: "RT", ck: this.isNumeric, runner: this.INNER_RT},
                   {cmd: "CO", ck: this.isColor, runner: this.INNER_CO},
                   {cmd: "SW", ck: this.isLineWidth, runner: this.INNER_SW},
                   {cmd: "JP", ck: this.isNumeric, runner: this.INNER_JP}];

        this.parser = new Parser(this.commandTemplate);
        this.runnerHash = {};
        this.hal = hal;
        this.commandIndex = 0;
        this.parsedCommandArray = [];
        this.commandInterval = 100;

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
                thiz.runnerHash[currentCommand.cmd](thiz, currentCommand.arg, function() {
                    window.postMessage("command_finished", '*');
                });
            }
            else if(message == "command_finished") {
                window.setTimeout(function() {
                    thiz.commandIndex ++;
                    window.postMessage("run_command", '*');
                }, thiz.commandInterval);
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
    }

    checkCommand(commands) {
        return this.parser.check(commands);
    }

    runCommands(commands, overCallback) {
        this.parsedCommandArray = this.parser.parse(commands);
        this.overCallback = overCallback;
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
    INNER_FD(thiz, arg, cb) {
        thiz.hal.__fd__(arg, cb);
    }

    INNER_BK(thiz, arg, cb) {
        thiz.hal.__bk__(arg, cb);
    }

    INNER_LT(thiz, arg, cb) {
        thiz.hal.__lt__(arg, cb);
    }

    INNER_RT(thiz, arg, cb) {
        thiz.hal.__rt__(arg, cb);
    }

    INNER_CO(thiz, arg, cb) {
        thiz.hal.__co__(arg, cb);
    }

    INNER_SW(thiz, arg, cb) {
        thiz.hal.__sw__(arg, cb);
    }

    INNER_JP(thiz, arg, cb) {
        thiz.hal.__jp__(arg, cb);
    }

}
