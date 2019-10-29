import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import $ from 'jquery';

import Chart from "../visualization/chart/Chart"
import Table from "../visualization/table/Table"

import DataUtils from '../../util/DataUtils'
import SeriesUtils from '../../util/SeriesUtils'

import './Content.css';

class Content extends Component {

    constructor(props) {
        super(props);

        this.state = {
            content: this.props.content,
            chartType: this.props.chartType,
            separator: this.props.separator,
            hasHeader: this.props.hasHeader,
            ignoreEmptyLines: this.props.ignoreEmptyLines,
            decimalPlaces: 3,
            displayedRows: 18,
            columns: [],
            serie: [],
            key: 1,
        }

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

        var parameters = this.state;

        var data = DataUtils.getData(parameters);

        var serie = SeriesUtils.getSerie(data);

        this.setState({
            columns: data.columns,
            serie: serie,
            key: this.state.key + 1
        });

        this.scrollTo("#visualization");
    }

    componentDidMount(){

        const settingsHeight = $('#settings').height();

        var displayedRows = parseInt((settingsHeight * 10) / 284, 10);

        if (displayedRows < 18) {
            displayedRows = 18;
        }

        this.setState({displayedRows: displayedRows });
    }

    scrollTo(selector) {
        document.querySelector(selector).scrollIntoView({ behavior: 'smooth' })
    }

    render() {

        const {chartType, columns, serie, key, decimalPlaces} = this.state;

        const showVisualization = serie.length !== 0;

        return (
            <div className="Content">
                <Form onSubmit={this.handleSubmit}>
                    <Card className="rounded">
                        <Card.Header>Content</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col sm={9}>
                                    <Form.Control as="textarea" className="lined" rows={this.state.displayedRows} placeholder="Paste your content file here" name="content" autoFocus value={this.state.content} onChange={this.handleChange} required/>
                                    </Col>
                        <Col sm={3}>
                            <div id="settings">
                                <Form.Group controlId="chartType">
                                    <Form.Label>Chart Type</Form.Label>
                                    <select className="form-control" id="chartType" name="chartType" value={this.state.chartType} onChange={this.handleChange}>
                                        <option value="automatically">Automatically</option>
                                        <option value="scatter-2d">Scatter 2D</option>
                                        <option value="scatter-3d">Scatter 3D</option>
                                        <option value="lines-4d">Lines 4D</option>
                                    </select>
                                </Form.Group>
                                <Form.Group controlId="separator">
                                    <Form.Label>Separator</Form.Label>
                                    <select className="form-control" id="separator" name="separator" value={this.state.separator} onChange={this.handleChange}>
                                        <option value="space">Space</option>
                                        <option value="tab">Tab (\t)</option>
                                        <option value="comma" >Comma (,)</option>
                                        <option value="semicolon" >Semicolon (;)</option>
                                    </select>
                                    <small>Character used for splitting the columns</small>
                                </Form.Group>
                                <Form.Group controlId="decimalPlaces">
                                    <Form.Label>Decimal Places</Form.Label>
                                    <Form.Control type="number" min="1" max="10" step="1" required name="decimalPlaces"value={this.state.decimalPlaces} onChange={this.handleChange} />
                                </Form.Group>
                                <div className="form-group form-check">
                                    <input type="checkbox" className="form-check-input" id="hasHeader" name="hasHeader" checked={this.state.hasHeader} onChange={this.handleChange}/>
                                    <label className="form-check-label" htmlFor="hasHeader">Header
                                        <br/>
                                        <small>Check out if the content has a header</small>
                                    </label>
                                </div>
                                <div className="form-group form-check">
                                    <input type="checkbox" className="form-check-input" id="ignoreEmptyLines" name="ignoreEmptyLines" checked={this.state.ignoreEmptyLines} onChange={this.handleChange}/>
                                    <label className="form-check-label" htmlFor="ignoreEmptyLines">
                                        Ignore empty lines
                                    </label>
                                </div>
                                <Button variant="success" type="submit" id="btn-visualize">Visualize</Button>
                            </div>
                        </Col>
                    </Row>
                        </Card.Body>
                    </Card>
                </Form>

                <Row className="mt-4" id="visualization">
                    <Col sm={12}>
                        { showVisualization ?
                            <Card>
                                <Card.Header>Visualization</Card.Header>
                                <Card.Body>
                                    <Tabs>
                                        <Tab eventKey="chart" title="Chart" className="mt-2">
                                            <Chart key={key} decimalPlaces={decimalPlaces} columns={columns} serie={serie} chartType={chartType}/>
                                        </Tab>
                                        <Tab eventKey="data" title="Data" className="mt-2">
                                            <Table key={key} decimalPlaces={decimalPlaces} columns={columns} serie={serie}/>
                                        </Tab>
                                    </Tabs>
                                </Card.Body>
                            </Card>
                        : null }
                    </Col>
                </Row>


            </div>
        );
    }
}

export default Content;
