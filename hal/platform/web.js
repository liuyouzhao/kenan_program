include('hal/hal.js')
include('hal/graphic/animation.js')
include('hal/graphic/paint.js')

include('core/exception.js')
include('core/code/code-error.js')
include('core/code/code-line.js')
include('core/code/compiler.js')
include('core/code/context.js')
include('core/code/executor.js')
include('core/code/logic.js')
include('core/code/parser.js')
include('core/code/scope.js')


class Platform {

	constructor() {
		this.eventTarget = window;
	}
	
	getEventTarget() {
		return this.eventTarget;
	}
}
