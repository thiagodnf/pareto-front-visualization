define([
    'toaster',
    'chart-2d',
    'chart-3d',
    'chart-4d'
], function (
    Toaster,
    Chart2D,
    Chart3D,
    Chart4D,
) {

    var options = {
        min: 0.0,
        max: 1.0,
        decimalPlaces: 2,
        chartType: "chart-2d",
        showLegend: false,
        showMarkers: true,
        showLines: true,
        color: undefined
    }

    var chart = undefined;
    var data = undefined;

    function scrollTo(selector) {
        document.querySelector(selector).scrollIntoView({ behavior: 'smooth' })
    }

    function getContentType(){
        return $("#content-type").val() || "csv";
    }

    function getObjectiveNames(rows){

        var columns = rows[0].split(getSeparator());

        columns = columns.map(e => e.trim()).filter(e => e.length !== 0);

        if(getContentType() == "tsv"){

            var names = [];

            for (var i = 1; i <= columns.length; i++){
                names.push("f" + i);
            }

            return names;
        }

        return columns;
    }

    function getInput(){
        return $(".input textarea").val() || "";
    }

    function getSeparator(){

        if(getContentType() == "tsv"){
            return "\t";
        }

        return ",";
    }

    function getSeries(rows){

        var series = [];

        for (var i = 1; i < rows.length; i++) {

            // Ignore blank lines
            if(!rows[i]){
                continue;
            }

            var parts = rows[i].split(getSeparator());

            var columns = parts.map(e => e.trim())
                    .filter(e => e.length !== 0)
                    .map(e => parseFloat(e));

            series.push({
                name: i.toFixed(0),
                data: columns,
            });
        }

        return series;
    }

    function visualize(input){

        var rows = input.split("\n");

        var objectiveNames = getObjectiveNames(rows);

        console.log(objectiveNames)

        var series = getSeries(rows);

        addData(objectiveNames, series);

        if(!chart){
            if (objectiveNames.length == 2) {
                chart = new Chart2D("chart");
            } else if (objectiveNames.length == 3) {
                chart = new Chart3D("chart");
            } else if (objectiveNames.length >= 4) {
                chart = new Chart4D("chart");
            }
        }

        chart.plot(options, objectiveNames, series);

        scrollTo(".visualization")

        $('#nav-chart-tab').tab('show')

        Toaster.showSuccess("Done");
    }

    function addData(objectiveNames, series){

        var $thead = $(".visualization .table").find('thead');
        var $tbody = $(".visualization .table").find('tbody');

        // Remove everything before add new rows
        if (data) {
            data.destroy();
        }

        $thead.empty();
        $tbody.empty();

        $thead.append(getRow("#", objectiveNames));

        series.forEach(function(serie){

            var data = serie.data.map(item => item.toFixed(options.decimalPlaces));

            $tbody.append(getRow(serie.name, data))
        });

        data = $('.datatable').DataTable();
    }

    function getRow(id, array){

        var str = "<tr>";

        str += `<td>${id}</td>`

        str += array
                .map(item => `<td>${item}</td>`)
                .reduce((acc, item) => acc + item);

        return str + "</tr>";
    }

    function fireVisualize(){

        var input = getInput();

        if(!input){
            Toaster.showError("The input is emtpy");
            return;
        }

        visualize(input);
    }

    function fireSaveSettings($form){

        options.min = parseFloat($form.find("#min").val()) ;
        options.max = parseFloat($form.find("#max").val()) ;
        options.decimalPlaces = parseInt($form.find("#decimal-places").val()) ;
        options.showLegend = $form.find("#show-legend").is(':checked');
        options.showMarkers = $form.find("#show-markers").is(':checked');
        options.showLines = $form.find("#show-lines").is(':checked');
        options.color = $form.find("#color").val();
        options.chartType = $form.find("#chart-type").val();

        if (options.chartType == "chart-2d") {
            chart = new Chart2D("chart");
        } else if(options.chartType == "chart-3d") {
            chart = new Chart3D("chart");
        } else if(options.chartType == "chart-4d") {
            chart = new Chart4D("chart");
        }
    }

    $(function () {

        $("#btn-visualize").click(function(event){
            event.preventDefault();

            fireVisualize();

            return false;
        });

        $("#form-settings").submit(function(event){
            event.preventDefault();

            fireSaveSettings($(this));

            fireVisualize();

            return false;
        });
    })
})
