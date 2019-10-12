define('chart-3d', ["requires"], function (requires) {

    'use strict'

    return class Chart3D {

        constructor (id) {
            this.id = id;
            this.chart = undefined;
        }

        plot (options, objectiveNames, series, ranges) {

            requires(options).isNotUndefined();
            requires(objectiveNames).isArray().withSizeEqualsTo(3);
            requires(series).isArray();

            if (this.chart) {
                this.chart.destroy();
            }

            objectiveNames = objectiveNames.splice(0, 3);

            var newSerie = {
                name: 'Pareto-front',
                data: []
            };

            series.forEach(serie => {
                newSerie.data.push(serie.data.splice(0, 3));
            });

            var chart = Highcharts.chart(this.id, {

                chart: {
                    type: 'scatter3d',
                    options3d: {
                        enabled: true,
                        alpha: 10,
                        beta: 30,
                        depth: 250,
                        viewDistance: 5,
                        fitToPlot: false,
                        frame: {
                            bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                            back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                            side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                        }
                    }
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
                zAxis: {
                    title: {
                        text: objectiveNames[2]
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

            this.chart = chart;

            // Add mouse and touch events for rotation
            (function (H) {
                function dragStart(eStart) {
                eStart = chart.pointer.normalize(eStart);

                var posX = eStart.chartX,
                    posY = eStart.chartY,
                    alpha = chart.options.chart.options3d.alpha,
                    beta = chart.options.chart.options3d.beta,
                    sensitivity = 5,  // lower is more sensitive
                    handlers = [];

                function drag(e) {
                    // Get e.chartX and e.chartY
                    e = chart.pointer.normalize(e);

                    chart.update({
                    chart: {
                        options3d: {
                        alpha: alpha + (e.chartY - posY) / sensitivity,
                        beta: beta + (posX - e.chartX) / sensitivity
                        }
                    }
                    }, undefined, undefined, false);
                }

                function unbindAll() {
                    handlers.forEach(function (unbind) {
                    if (unbind) {
                        unbind();
                    }
                    });
                    handlers.length = 0;
                }

                handlers.push(H.addEvent(document, 'mousemove', drag));
                handlers.push(H.addEvent(document, 'touchmove', drag));


                handlers.push(H.addEvent(document, 'mouseup', unbindAll));
                handlers.push(H.addEvent(document, 'touchend', unbindAll));
                }
                H.addEvent(chart.container, 'mousedown', dragStart);
                H.addEvent(chart.container, 'touchstart', dragStart);
            }(Highcharts));


        }
    }
})
