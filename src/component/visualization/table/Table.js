import React, { Component } from 'react';

import DataTable from 'react-data-table-component';

class Table extends Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: this.getColumns(this.props.columns),
            rows : this.getRows(this.props.columns, this.props.serie, this.props.decimalPlaces),
        }
    }

    getRows(columns, serie, decimalPlaces){

        var rows = [];

        serie.data.forEach((d, i) => {

            var row = { id: i+1};

            columns.forEach((column, j) => {
                row[column] = d[j].toFixed(decimalPlaces);
            });

            rows.push(row);
        });

        return rows;
    }

    getColumn(name){
        return {
            name: name,
            selector: name,
            sortable: true,
        }
    }

    getColumns(columns){

        var that = this;

        var cols = [];

        cols.push(this.getColumn("id"));

        columns.forEach(column => {
            cols.push(that.getColumn(column));
        });

        return cols;
    }

    render() {

        return (
            <div className="visualization-table">
                <DataTable
                    noHeader
                    striped
                    bordered
                    hover
                    pagination
                    columns={this.state.columns}
                    data={this.state.rows}
                />
            </div>
        );
    }
}

export default Table;
