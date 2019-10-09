define('chart-2d', [], function () {

    'use strict'

    return class Chart2D {

        constructor (id) {
            this.id = id;
            this.chart = undefined;
        }

        plot (options, objectiveNames, series) {

            if (this.chart) {
                this.chart.destroy();
            }

            objectiveNames = objectiveNames.splice(0, 2);

            var newSerie = {
                name: 'Pareto-front',
                data: []
            };

            series.forEach(serie => {
                newSerie.data.push(serie.data.splice(0, 2));
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
                    min: options.min,
                    max: options.max,
                    tickInterval: 0.1,
                },
                yAxis: {
                    title: {
                        text: objectiveNames[1]
                    },
                    min: options.min,
                    max: options.max,
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
