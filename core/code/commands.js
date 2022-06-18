class Commands {
	/* Movement commands */
	static FORWARD 			= "FD";
	static BACKWARD 		= "BK";
	static LEFT_ROTATE 		= "LT";
	static RIGHT_ROTATE 	= "RT";
	static JUMP 			= "JP"
	static SLEEP			= "SLEEP";

	/* Logic commands */
	static LOGIC_LOOP 		= "LOOP";
	static LOGIC_END 		= "END";
	static LOGIC_BREAK 		= "BRK";

	
	/* Settings commands */
	static SET_LINE_COLOR 	= "CO";
	static SET_LINE_WIDTH 	= "LW";
	static SET_MOVE_SPEED 	= "SPEED";
	
	static BLUEPRINT_V1 = {};	
	static BLUEPRINT_V0 = {};	
	static selectedBlueprint = Commands.BLUEPRINT_V1;
	
	static init(executor) {
        Commands.BLUEPRINT_V1 = {
           "FD": 		{checker: [Utils.isNumeric], 	runner: executor.INNER_FD},
           "BK": 		{checker: [Utils.isNumeric], 	runner: executor.INNER_BK},
           "LT": 		{checker: [Utils.isNumeric], 	runner: executor.INNER_LT},
           "RT": 		{checker: [Utils.isNumeric], 	runner: executor.INNER_RT},
       	   "JP": 		{checker: [Utils.isNumeric], 	runner: executor.INNER_JP},
       	   "RST":		{checker: [], 					runner: executor.INNER_RST},
           "SLEEP": 	{checker: [Utils.isNumeric], 	runner: executor.INNER_SLEEP},
 
           "LOOP": 		{checker: [Utils.isNumericOrNull], runner: executor.INNER_LOOP},
           "END": 		{checker: [], 					runner: executor.INNER_END},
           "BRK":		{checker: [], 					runner: executor.INNER_BRK},
           
           "CO":		{checker: [Utils.isColor], 		runner: executor.INNER_CO},
           "LW": 		{checker: [Utils.isLineWidth], 	runner: executor.INNER_LW},
           "SPEED": 	{checker: [Utils.isNumeric], 	runner: executor.INNER_SPEED}
      	};
	}
	
	static select(blueprint) {
		Commands.selectedBlueprint = blueprint;
	}
	
	static isValidCommand(commandName) {
		if(Commands.selectedBlueprint[commandName]) {
			return true;
		}
		return false;
	}
}
