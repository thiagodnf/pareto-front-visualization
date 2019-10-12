define('chart-4d', ["requires"], function (requires) {

    'use strict'

    return class Chart4D {

        constructor (id) {
            this.id = id;
            this.chart = undefined;
        }

        plot (options, objectiveNames, series, ranges) {

            requires(options).isNotUndefined();
            requires(objectiveNames).isArray();
            requires(series).isArray();
            requires(ranges).isArray();

            if(this.chart){
                this.chart.destroy();
            }

            this.chart = Highcharts.chart(this.id, {

                chart: {
                    type: 'line',
                    zoomType: 'xy',
                },
                title: {
                    text: undefined
                },
                legend: {
                    enabled: options.showLegend
                },
                yAxis: {
                    title: {
                        text: 'Objective Values'
                    },
                    min: options.min,
                    max: options.max,
                    tickInterval: 0.1,
                },
                xAxis: {
                    categories: objectiveNames
                },
                plotOptions: {
                    series: {
                        lineWidth: options.showLines ? 1 : 0,
                        color: options.color || null,
                        marker: {
                            enabled: options.showMarkers
                        }
                    }
                },
                series: series,
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
