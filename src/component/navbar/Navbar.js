import React, { Component } from 'react';

// React Boostrap
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

import './Navbar.css';

class NavigationBar extends Component {

    render() {
        return (
            <div>
                <Navbar fixed="top"  className="navbar-custom">
                    <Navbar.Brand href="#">Pareto-front Visualization</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/pareto-front-visualization">Home</Nav.Link>
                            <NavDropdown title="Examples" id="collasible-examples">
                                <NavDropdown.Item href="?url=examples/zdt/zdt1.txt&hasHeader=0">ZDT 1</NavDropdown.Item>
                                <NavDropdown.Item href="?url=examples/zdt/zdt2.txt&hasHeader=0">ZDT 2</NavDropdown.Item>
                                <NavDropdown.Item href="?url=examples/zdt/zdt3.txt&hasHeader=0">ZDT 3</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="?url=examples/dtlz/DTLZ1.2D.pf.txt&hasHeader=0&separator=tab">DTLZ1 (2D)</NavDropdown.Item>
                                <NavDropdown.Item href="?url=examples/dtlz/DTLZ1.3D.pf.txt&hasHeader=0&separator=tab">DTLZ1 (3D)</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="https://github.com/thiagodnf/pareto-front-visualization" target="_blank">About</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default NavigationBar;
