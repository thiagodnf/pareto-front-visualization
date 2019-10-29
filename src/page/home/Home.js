import React, { Component } from 'react';
import $ from 'jquery';
import queryString from 'query-string-es5';

import Container from 'react-bootstrap/Container'

import Navbar from '../../component/navbar/Navbar';
import Content from '../../component/content/Content';
import Error from '../../component/error/Error';

import './Home.css';

class Home extends Component {

    constructor(props) {
        super(props);

        // Binding the sub-components
        this.toastComponent = React.createRef();

        var that = this;

        window.onerror = function(msg, url, lineNo, columnNo, error) {
            that.toastComponent.current.showError(msg, url, lineNo, columnNo, error);
        };

        const parsed = queryString.parse(this.props.location.search);

        if (parsed.url) {
            $.ajax({
                url: parsed.url,
                type: "GET",
                async: false,
                success: function(response){
                    parsed.content = response;
                },
            }).fail(function(jqXHR, textStatus, errorThrown){
                throw new Error(textStatus);
            });
        }

        this.state = {
            content: parsed.content || "",
            chartType: parsed.chartType || "automatically",
            separator: parsed.separator || "comma",
            hasHeader: (parsed.hasHeader &&  parsed.hasHeader === "1" ? true : false) || false,
            ignoreEmptyLines: (parsed.ignoreEmptyLines &&  parsed.ignoreEmptyLines === "1" ? true : false) || true,
        }
    }

    render() {

        const state = this.state;

        return (
            <div className="App">
                <Navbar/>
                <Container fluid="true">
                    <Content
                        content={state.content}
                        chartType={state.chartType}
                        separator={state.separator}
                        hasHeader={state.hasHeader}
                        ignoreEmptyLines={state.ignoreEmptyLines}
                    />
                </Container>
                <Error ref={this.toastComponent}/>
            </div>
        );
    }
}

export default Home;
