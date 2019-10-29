import React, { Component } from 'react';

import Toast from 'react-bootstrap/Toast'

class Error extends Component {

    state = {
        "className": "",
        "title": "",
        "message" : "",
        "isShow": false,
    };

    showMessage(className, title, message){
        this.setState({
            "className": className,
            "title": title,
            "message" : message,
            "isShow": true
        });
    }

    showError(msg, url, lineNo, columnNo, error){
        this.showMessage("bg-danger text-white", "Error", error.message);
    }

    setIsShow(isShow){
        this.setState({
            "isShow": isShow
        });
    }

    render() {

        if (!this.state.isShow) {
            return (<div></div>);
        }

        return (
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    marginLeft: "10px",
                    marginBottom: "10px"
                }}
            >
                <Toast delay={3000} autohide show={this.state.isShow} onClose={() => this.setIsShow(false)}>
                    <Toast.Header className={this.state.className}>
                        <strong className="mr-auto">{this.state.title}</strong>
                    </Toast.Header>
                    <Toast.Body>
                        {this.state.message}
                    </Toast.Body>
                </Toast>
            </div>
        );
    }
}

export default Error;
