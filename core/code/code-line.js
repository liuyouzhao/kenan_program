// NOT USED

class CodeLine {
	constructor(rawCode, lineNumber) {
		this.rawCode = rawCode;
		this.lineNumber = lineNumber;
	}
}

class CommandLine extends CodeLine {

	constructor(rawCode, lineNumber, cmd, args) {
		super(rawCode, lineNumber);
		this.cmd = cmd;
		this.args = args;
	}
}
