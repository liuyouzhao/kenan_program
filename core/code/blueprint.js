class Blueprint {
	
	constructor() {
		this.BLUEPRINT_V1 = {};	
		this.BLUEPRINT_V0 = {};	
		this.selectedBlueprint = this.BLUEPRINT_V1;
	}

	
	init(executor) {
        this.BLUEPRINT_V1 = {
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
	
	select(blueprint) {
		this.selectedBlueprint = blueprint;
	}
	
	get() {
		return this.selectedBlueprint;
	}
	
	isValidCommand(commandName) {
		if(this.selectedBlueprint[commandName]) {
			return true;
		}
		return false;
	}
}
