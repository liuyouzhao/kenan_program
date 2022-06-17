class Utils {

	/**
		Validation Functions
	*/
	static isNumeric(str) {
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
             !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }
    
    static isNumericOrNull(str) {
    	if(str == null)
    		return true;
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
             !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }
    
    static isColor(str) {
        var colors = {
        "aqua":1, "black":1, "blue":1, "fuchsia":1,
        "gray":1, "green":1, "lime":1, "maroon":1,
        "navy":1, "olive":1, "purple":1, "red":1,
        "silver":1, "teal":1, "white":1, "yellow":1, "orange":1, "pink":1};

        if(colors[str.toLowerCase()] == 1) {
            return true;
        }
        return false;
    }

    static isLineWidth(str) {
        try {
            return parseInt(str) <= 4 && parseInt(str) >= 0;
        }
        catch(ex) {
            console.log(ex);
            return false;
        }
    }

}
