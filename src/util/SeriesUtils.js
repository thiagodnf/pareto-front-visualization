class SeriesUtils {

    static getSerie(data){

        var serie = {
            name: `Serie`,
            data: [],
        };

        data.data.forEach((row, i) => {

            row = row.map((e, j) => {

                if (isNaN(e)) {
                    throw new Error(`Line ${i + 1} Column ${j + 1} must be a number`);
                }

                return parseFloat(e);
            });

            serie.data.push(row);
        });

        return serie;
    }
}

export default SeriesUtils;
