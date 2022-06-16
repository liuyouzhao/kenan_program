// NOT USED

class CodeLine {
	constructor(raw, line) {
		this.raw = raw;
		this.line = line;
		this.cmd = null;
		this.args = null;
	}
	
	assemble(cmd, args) {
		this.cmd = cmd;
		this.args = args;
	}
}
