import React, { Component } from 'react';

import Scatter2D from './2d/Scatter2D'
import Scatter3D from './3d/Scatter3D'
import Lines4D from './4d/Lines4D'

class Chart extends Component {

    state = {
        chartType: "",
        parameters: {},
        columns: [],
        serie: [],
    }

    constructor(props) {
        super(props);

        var chartType = "scatter-2d"

        if (this.props.chartType === "automatically") {

            switch (this.props.columns.length) {
                case 2:
                    chartType = "scatter-2d";
                    break;
                case 3:
                    chartType = "scatter-3d";
                    break;
                default:
                    chartType = "lines-4d";
                    break;
            }
        } else {
            chartType = this.props.chartType;
        }

        this.state = {
            chartType: chartType,
            columns: this.props.columns,
            serie: this.props.serie,
            decimalPlaces: this.props.decimalPlaces,
            key: 1,
        }
    }

    render() {

        const {chartType, columns, serie, decimalPlaces} = this.state;

        if (columns.length === 0) {
            return <div className="Chart"></div>
        }

        return (
            <div className="Chart">
                { chartType === "scatter-2d" ?  <Scatter2D decimalPlaces={decimalPlaces} columns={columns} serie={serie} /> : null }
                { chartType === "scatter-3d" ?  <Scatter3D decimalPlaces={decimalPlaces} columns={columns} serie={serie} /> : null }
                { chartType === "lines-4d" ?    <Lines4D   decimalPlaces={decimalPlaces} columns={columns} serie={serie} /> : null }
            </div>
        );
    }
}

export default Chart;
