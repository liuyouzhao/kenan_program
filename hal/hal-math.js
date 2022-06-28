class Hal_Math {

	constructor() {
		eval("abs = Math.abs");
		eval("pow = Math.pow");
	}
	
	calculateResult(expression) {
		eval("__temp_expr_result__ = " + expression + ";");
		return __temp_expr_result__;
	}
}
