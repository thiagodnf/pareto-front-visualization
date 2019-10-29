import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsBoost from "highcharts/modules/boost";

import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'

// init the module
HighchartsExporting(Highcharts);
HighchartsBoost(Highcharts);

class Lines4D extends Component {

    constructor(props) {
        super(props);

        var that = this;

        this.state = {
            showLegend: false,
            showMarkers: true,
            showLines: true,
            sameColor: false,
            symbol: "circle",
            color: "#7cb5ec",
            title: "",
            yMin: "",
            yMax: "",
            yTick: "",
            yName: "Objective Values",
            chartOptions: {
                chart: {
                    type: 'line',
                    zoomType: 'xy',
                },
                title: {
                    text: undefined
                },
                legend: {
                    enabled: false,
                },
                xAxis: {
                    categories: this.props.columns
                },
                tooltip: {
                    formatter: function() {

                        var y = this.y.toFixed(that.props.decimalPlaces);

                        return `
                            <strong>Solution:</strong> ${this.series.name} <br/>
                            <strong>${this.key}</strong> : ${y}
                        `;
                    }
                },
                yAxis: {
                    title: {
                        text: 'Objective Values'
                    }
                },
                plotOptions: {
                    line: {
                       states: {
                            hover: {
                                lineWidth: 3,
                            }
                        },
                    }
                },
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
            }
        };

        // Binding the events
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        var that = this;

        this.setState({
            chartOptions: {
                legend: {
                    enabled: this.state.showLegend,
                },
                title: {
                    text: this.state.title || null
                },
                plotOptions: {
                    series: {
                        lineWidth: this.state.showLines ? 1 : 0,
                        color: this.state.color || null,
                        marker: {
                            symbol: this.state.symbol || null,
                            radius: 4,
                            enabled: this.state.showMarkers
                        },
                        boostThreshold: 1,
                    },
                    line: {
                        "color": function(){
                            if(that.state.sameColor && that.state.color){
                                return that.state.color;
                            }
                            return undefined
                        }(),
                        states: {
                            hover: {
                                lineWidth: 3,
                            }
                        },
                    },
                },
                boost: {
                    enabled: true,
                    seriesThreshold: 1,
                    useGPUTranslations: true,
                    usePreAllocated: true
                },
                yAxis: {
                    title: {
                        text: this.state.yName
                    },
                    min: (this.state.yMin && parseFloat(this.state.yMin)) || null,
                    max: (this.state.yMax && parseFloat(this.state.yMax))|| null,
                    tickInterval: (this.state.yTick && parseFloat(this.state.yTick))|| null,
                },
            }
        });
    }

    componentDidMount(){

        const {serie} = this.props;

        var newSerie = [];

        serie.data.forEach((row, i) => {

            newSerie.push({
                name: "s"+i,
                data: row,
            });
        });

        this.setState({
            chartOptions: {
                series: newSerie,
            }
        });
    }

    render() {
        return (
            <div className="Chart">
                <Row>
                    <Col sm="9">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={this.state.chartOptions}
                            ref={this.chartComponent}
                        />
                    </Col>
                    <Col sm="3">
                        <Form onSubmit={this.handleSubmit}>
                        <Accordion defaultActiveKey="0">
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">General</Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        <Form.Group controlId="title">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control type="text" name="title" value={this.state.title} onChange={this.handleChange} />
                                        </Form.Group>
                                        <div className="form-group">
                                            <label htmlFor="color">Color</label>
                                            <select className="form-control" name="color" id="color" value={this.state.color} onChange={this.handleChange}>
                                                <option value="">Colorful</option>
                                                <option value="#7cb5ec">Blue</option>
                                                <option value="#434348">Black</option>
                                                <option value="#90ed7d">Light Green</option>
                                                <option value="#f7a35c">Orange</option>
                                                <option value="#8085e9">Purple</option>
                                                <option value="#f15c80">Pink</option>
                                                <option value="#e4d354">Yellow</option>
                                                <option value="#2b908f">Green</option>
                                                <option value="#f45b5b">Red</option>
                                                <option value="#91e8e1">Light Blue</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="symbol">Symbol</label>
                                            <select className="form-control" name="symbol" id="symbol" value={this.state.symbol} onChange={this.handleChange}>
                                                <option value="">Random</option>
                                                <option value="circle">Circle</option>
                                                <option value="square">Square</option>
                                                <option value="diamond">Diamond</option>
                                                <option value="triangle">Triangle</option>
                                                <option value="triangle-down">Triangle-down</option>
                                            </select>
                                        </div>
                                        <div className="form-group form-check">
                                            <input type="checkbox" className="form-check-input" id="showLegend" name="showLegend" checked={this.state.showLegend} onChange={this.handleChange}/>
                                            <label className="form-check-label" htmlFor="showLegend">Show Legend</label>
                                        </div>
                                        <div className="form-group form-check">
                                            <input type="checkbox" className="form-check-input" id="sameColor" name="sameColor" checked={this.state.sameColor} onChange={this.handleChange}/>
                                            <label className="form-check-label" htmlFor="sameColor">Same Color</label>
                                        </div>
                                        <div className="form-group form-check">
                                            <input type="checkbox" className="form-check-input" id="showMarkers" name="showMarkers" checked={this.state.showMarkers} onChange={this.handleChange}/>
                                            <label className="form-check-label" htmlFor="showMarkers">Show Markers</label>
                                        </div>
                                        <div className="form-group form-check">
                                            <input type="checkbox" className="form-check-input" id="showLines" name="showLines" checked={this.state.showLines} onChange={this.handleChange}/>
                                            <label className="form-check-label" htmlFor="showLines">Show Lines</label>
                                        </div>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                            <Card>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey="1">Y Axis</Accordion.Toggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        <Form.Group controlId="yName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" name="yName" value={this.state.yName} onChange={this.handleChange} />
                                        </Form.Group>
                                        <Form.Group controlId="yMin">
                                            <Form.Label>Minimum</Form.Label>
                                            <Form.Control type="number" step="0.0000001" name="yMin"value={this.state.yMin} onChange={this.handleChange} />
                                        </Form.Group>
                                        <Form.Group controlId="yMax">
                                            <Form.Label>Maximum</Form.Label>
                                            <Form.Control type="number" step="0.0000001" name="yMax" value={this.state.yMax} onChange={this.handleChange}/>
                                        </Form.Group>
                                        <Form.Group controlId="yTick">
                                            <Form.Label>Tick</Form.Label>
                                            <Form.Control type="number" step="0.0000001" name="yTick" value={this.state.yTick} onChange={this.handleChange}/>
                                        </Form.Group>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                        <button type="submit" className="btn btn-primary mt-3" id="btn-save">Save</button>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Lines4D;
