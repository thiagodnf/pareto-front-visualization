class SeparatorUtils {

    static getSeparator(separator){

        if (separator === "comma") {
            return ",";
        } else if(separator === "tab") {
            return "\t";
        } else if(separator === "space") {
            return " ";
        } else if(separator === "semicolon") {
            return ";";
        }

        return ","
    }
}

export default SeparatorUtils;
