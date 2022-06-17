class LineExecutor {
	execute(command, runner, ctx) {
		runner(ctx, command.args);
	}
}

class CommandExecutor extends LineExecutor {

    /**
        COMMAND EXECUTOR
    */
    INNER_FD(ctx, args) {
        ctx.hal.__fd__(args[0], function() {
        	ctx.runNext();
        });
    }

    INNER_BK(ctx, args) {
        ctx.hal.__bk__(args[0], function() {
        	ctx.runNext();
        });
    }

    INNER_LT(ctx, args) {
        ctx.hal.__lt__(args[0], function() {
        	ctx.runNext();
        });
    }

    INNER_RT(ctx, args) {
        ctx.hal.__rt__(args[0], function() {
        	ctx.runNext();
        });
    }

    INNER_CO(ctx, args) {
        ctx.hal.__co__(args[0], function() {
        	ctx.runNext();
        });
    }

    INNER_SW(args) {
    	let ctx = this.ctx;
        ctx.hal.__sw__(args[0], function() {
        	ctx.runNext();
        });
    }

    INNER_JP(ctx, args) {
        ctx.hal.__jp__(args[0], function() {
        	ctx.runNext();
        });
    }
    
    INNER_LOOP(ctx, args) {
    	ctx.logic.stepIn(ctx.commandIndex, ctx.commands, args);
    	ctx.runNext();
    }
    
    INNER_END(ctx, args) {
		var ended = ctx.logic.consumeScope();
		if(ended) {
			ctx.goto(ctx.logic.stepOut() + 1);
		}
		else {
			ctx.goto(ctx.logic.getBeginIndex());
		}
    }
    
    INNER_BRK(ctx, args) {
    	ctx.goto(ctx.logic.stepOut() + 1);
    }
    
    INNER_SLEEP(ctx, args) {
    	ctx.runNextDelay(args[0]);
    }
    
    INNER_SPEED(ctx, args) {
    	ctx.hal.__speed__(args[0], function() {
    		ctx.runNext();
    	})
    }
}
