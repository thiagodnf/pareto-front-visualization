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

class Scatter2D extends Component {

    constructor(props) {
        super(props);

        var that = this;

        this.state = {
            showLegend: false,
            symbol: "circle",
            color: "#7cb5ec",
            title: "",
            xMin: "",
            xMax: "",
            xTick: "",
            xName: this.props.columns[0],
            yMin: "",
            yMax: "",
            yTick: "",
            yName: this.props.columns[1],
            chartOptions: {
                chart: {
                    type: 'scatter',
                    zoomType: 'xy',
                },
                legend: {
                    enabled: false,
                },
                title: {
                    text: undefined
                },
                boost: {
                    enabled: true,
                    seriesThreshold: 1,
                    useGPUTranslations: true,
                    usePreAllocated: true
                },
                tooltip: {
                    formatter: function() {

                        var x = this.x.toFixed(that.props.decimalPlaces);
                        var y = this.y.toFixed(that.props.decimalPlaces);

                        return `
                            <strong>Solution:</strong> ${this.point.index + 1} <br/>
                            <strong>${that.props.columns[0]}</strong> : ${x} <br/>
                            <strong>${that.props.columns[1]}</strong> : ${y}
                        `;
                    }
                },
                xAxis: {
                    title: {
                        text: this.props.columns[0]
                    },
                },
                yAxis: {
                    title: {
                        text: this.props.columns[1]
                    },
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

        this.chartComponent = React.createRef();
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
                        color: this.state.color || null,
                        marker: {
                            symbol: this.state.symbol || null
                        },
                        boostThreshold: 1,
                    }
                },
                xAxis: {
                    title: {
                        text: this.state.xName
                    },
                    min: (this.state.xMin && parseFloat(this.state.xMin))|| null,
                    max: (this.state.xMax && parseFloat(this.state.xMax))|| null,
                    tickInterval: (this.state.xTick && parseFloat(this.state.xTick))|| null,
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

        const {columns, serie} = this.props;

        if (columns.length < 2) {
            throw new Error("This chart requires at least 2 objectives");
        }

        this.setState({
            chartOptions: {
                series: [serie],
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
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">X Axis</Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>
                                            <Form.Group controlId="xName">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control type="text" name="xName" value={this.state.xName} onChange={this.handleChange} />
                                            </Form.Group>
                                            <Form.Group controlId="xMax">
                                                <Form.Label>Minimum</Form.Label>
                                                <Form.Control type="number" step="0.0000001" name="xMin"value={this.state.xMin} onChange={this.handleChange} />
                                            </Form.Group>
                                            <Form.Group controlId="xMax">
                                                <Form.Label>Maximum</Form.Label>
                                                <Form.Control type="number" step="0.0000001" name="xMax" value={this.state.xMax} onChange={this.handleChange}/>
                                            </Form.Group>
                                            <Form.Group controlId="xTick">
                                                <Form.Label>Tick</Form.Label>
                                                <Form.Control type="number" step="0.0000001" name="xTick" value={this.state.xTick} onChange={this.handleChange}/>
                                            </Form.Group>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="2">Y Axis</Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body>
                                            <Form.Group controlId="yName">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control type="text" name="yName" value={this.state.yName} onChange={this.handleChange} />
                                            </Form.Group>
                                            <Form.Group controlId="yMin">
                                                <Form.Label>Minimum</Form.Label>
                                                <Form.Control type="number" step="0.0000001" name="yMin" value={this.state.yMin} onChange={this.handleChange} />
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

export default Scatter2D;
