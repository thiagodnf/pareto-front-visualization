import SeparatorUtils from './SeparatorUtils'

class DataUtils {

    static getData(parameters){

        var content = parameters.content;

        var columns = [];
        var data = [];

        var separator = SeparatorUtils.getSeparator(parameters.separator);

        var rows = content.split("\n").map(e => e.trim());

        if (parameters.ignoreEmptyLines) {
            rows = rows.filter(e => e.length !== 0);
        }

        rows.forEach((row, i) => {

            if (row.length === 0) {
                throw new Error(`Line ${i + 1} must not be empty`);
            }

            // Ignore comments
            if(row.startsWith("#")){
                return;
            }

            var parts = row.split(separator)
                .map(el => el.trim())
                .map((el,j) => {

                    if (el.length === 0) {
                        throw new Error(`Line ${i + 1} and Column ${j + 1} is empty`);
                    }

                    return el;
                });

            if (parts.length <= 1) {
                throw new Error(`Line ${i + 1} has a single column`);
            }

            if (columns.length === 0) {
                columns = parts;
            }

            if (parts.length !== columns.length) {
                throw new Error(`Line ${i + 1} must have length ${columns.length} but it has ${parts.length}`);
            }

            if(i > 1000){
                // Ignore large datasets
                return;
            }

            data.push(parts);
        });

        if (parameters.hasHeader) {
            data = data.filter((el, i) => i !== 0);
        } else {
            columns = Array.from({length: columns.length}).map((el,i) => `f${i + 1}`);
        }

        return {
            columns: columns,
            data: data
        };
    }
}

export default DataUtils;
