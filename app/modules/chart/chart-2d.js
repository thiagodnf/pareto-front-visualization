define('chart-2d', ['requires'], function (requires) {

    'use strict'

    return class Chart2D {

        constructor (id) {
            this.id = id;
            this.chart = undefined;
        }

        plot (options, objectiveNames, series, ranges) {

            requires(options).isNotUndefined();
            requires(objectiveNames).isArray().withSizeGreaterThanOrEqualTo(2);
            requires(series).isArray();
            requires(ranges).isArray().withSizeGreaterThanOrEqualTo(2);

            if (this.chart) {
                this.chart.destroy();
            }

            var newSerie = {
                name: 'Pareto-front',
                data: []
            };

            series.forEach(serie => {

                var row = [];

                for (var i = 0; i < 2; i++) {
                    row.push(serie.data[i]);
                }

                newSerie.data.push(row);
            });

            this.chart = Highcharts.chart(this.id, {

                chart: {
                    type: 'scatter',
                    zoomType: 'xy',
                },
                title: {
                    text: undefined
                },
                legend: {
                    enabled: options.showLegend
                },
                xAxis: {
                    title: {
                        text: objectiveNames[0]
                    },
                    min: ranges[0].min,
                    max: ranges[0].max,
                    tickInterval: 0.1,
                },
                yAxis: {
                    title: {
                        text: objectiveNames[1]
                    },
                    min: ranges[1].min,
                    max: ranges[1].max,
                    tickInterval: 0.1,
                },
                plotOptions: {
                    series: {
                        color: options.color || null,
                        marker: {
                            enabled: options.showMarkers
                        }
                    }
                },
                series: [newSerie],
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }
            });
        }
    }
})
