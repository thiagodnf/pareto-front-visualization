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
        hasHeader: true,
        separator: "comma",
        ignoreEmptyLines: true,

        automaticRange: true,
        userRanges: [],

        decimalPlaces: 2,
        color: "",
        chartType: "2d",
        showLegend: false,
        showMarkers: true,
        showLines: true,
    }

    var columnNames = [];
    var series = [];

    var chart = undefined;
    var data = undefined;

    function scrollTo(selector) {
        document.querySelector(selector).scrollIntoView({ behavior: 'smooth' })
    }

    function hasHeader(){
        return $("#has-header").is(':checked');
    }

    function getObjectiveNames(rows){

        var columns = rows[0].split(getSeparator());

        columns = columns.map(e => e.trim()).filter(e => e.length !== 0);

        if(!hasHeader()){

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

        var separator = $("#separator").val() || "comma";

        if (separator == "comma") {
            return ",";
        } else if(separator == "tab") {
            return "\t";
        } else if(separator == "space") {
            return " ";
        } else if(separator == "semicolon") {
            return ";";
        }

        return ","
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

    function getRows(content){
        return content.split("\n");
    }

    function getMinMaxRanges(columnNames, series){

        var min = Array(columnNames.length).fill(Number.MAX_VALUE);
        var max = Array(columnNames.length).fill(Number.MIN_VALUE);

        series.forEach(function(serie){

            for (var i = 0; i < serie.data.length; i++) {

                if (serie.data[i] < min[i]){
                    min[i] = serie.data[i];
                }

                if (serie.data[i] > max[i]){
                    max[i] = serie.data[i];
                }
            }
        });

        var ranges = [];

        columnNames.forEach(function(columnName, i){
            ranges.push({
                name: columnName,
                min : min[i],
                max : max[i]
            });
        });

        return ranges;
    }

    function setOptionsOnScreen(){

        $("input[name='has-header']").prop('checked', options.hasHeader);
        $("select[name='separator']").val(options.separator);
        $("input[name='ignore-empty-lines']").prop('checked', options.ignoreEmptyLines);

        $("input[name='automatic-range']").prop('checked', options.automaticRange);
        $("select[name='color']").val(options.color);
        $("select[name='chart-type']").val(options.chartType);
        $("input[name='decimal-places']").val(options.decimalPlaces);
        $("input[name='show-legend']").prop('checked', options.showLegend);
        $("input[name='show-markers']").prop('checked', options.showMarkers);
        $("input[name='show-lines']").prop('checked', options.showLines);
    }

    function addData(objectiveNames, series){

        var $thead = $(".table-values").find('thead');
        var $tbody = $(".table-values").find('tbody');

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

        console.log(options)
        var content = getInput();

        if (!content) {
            throw new Error("The input is emtpy");
        }

        var rows = getRows(content);

        columnNames = getObjectiveNames(rows);
        series = getSeries(rows);

        var ranges = [];

        if (options.automaticRange) {
            ranges = getMinMaxRanges(columnNames, series);
        } else {
            ranges = options.userRanges;
        }

        addData(columnNames, series);

        if (options.chartType == "2d") {
            chart = new Chart2D("chart");
        } else if (options.chartType == "3d") {
            chart = new Chart3D("chart");
        } else if (options.chartType == "4d") {
            chart = new Chart4D("chart");
        }

        if(!chart){
            if (columnNames.length == 2) {
                chart = new Chart2D("chart");
                $("#chart-type").val("2d");
            } else if (columnNames.length == 3) {
                chart = new Chart3D("chart");
                $("#chart-type").val("3d");
            } else if (columnNames.length >= 4) {
                chart = new Chart4D("chart");
                $("#chart-type").val("4d");
            }
        }

        chart.plot(options, columnNames, series, ranges);

        var $tbody = $(".table-ranges").find('tbody');

        // Before add new rows, remove the other ones
        $tbody.empty();

        columnNames.forEach(function(column, i){

            var range = ranges.filter(e => e.name == column)[0];

            var str = "";

            str += `<tr data-objective-name="${column}">`;
            str += `<td>${column}</td>`
            str += `<td><input type="number" class="form-control" name="min" value="${range.min}" step="0.0000000001" required/></td>`
            str += `<td><input type="number" class="form-control" name="max" value="${range.max}" step="0.0000000001" required/></td>`
            str += "</tr>";

            $tbody.append(str);
        });

        $(".visualization").show();

        $('#nav-chart-tab').tab('show')

        scrollTo(".visualization");
    }

    function fireSaveSettings($form){

        options.automaticRange = $form.find("#automatic-range").is(':checked');
        options.color = $form.find("#color").val();
        options.chartType = $form.find("#chart-type").val();
        options.decimalPlaces = parseInt($form.find("#decimal-places").val()) ;
        options.showLegend = $form.find("#show-legend").is(':checked');
        options.showMarkers = $form.find("#show-markers").is(':checked');
        options.showLines = $form.find("#show-lines").is(':checked');

        options.userRanges = [];

        $(".table-ranges").find('tbody tr').each(function(i, row){

            var $row = $(this);

            options.userRanges.push({
                name: $row.data("objective-name"),
                min : parseFloat($row.find("input[name='min']").val()),
                max : parseFloat($row.find("input[name='max']").val())
            });
        });

        console.log(options)

        $('#nav-chart-tab').tab('show')

        Toaster.showSuccess("The settings were successfully saved");
    }

    $(function () {

        setOptionsOnScreen();

        $(".lined").linedtextarea();

        $("#btn-visualize").click(function(event){
            event.preventDefault();

            fireVisualize();

            return false;
        });

        $("#form-settings").submit(function(event){
            event.preventDefault();

            fireSaveSettings($(this));

            if (getInput()) {
                fireVisualize();
            }

            return false;
        });

        window.onerror = function(e) {
            Toaster.showError(e);
        };

        $(".example").click(function(event){
            event.preventDefault();

            var url = "https://raw.githubusercontent.com/thiagodnf/pareto-front-visualization/master/examples/ZDT3.csv";

            $.get(url, function(response){
                $(".input textarea").val(response)
                scrollTo(".input");
            });

            return false;
        });

        // This code closes the navbar when it is collapsed automatically
        $('.navbar-nav>li>a').on('click', function(){
            $('.navbar-collapse').collapse('hide');
        });
    })
})
