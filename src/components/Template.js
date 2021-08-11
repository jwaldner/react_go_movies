import React, { Component } from 'react';
export default class Template extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            error: null,
            alert: {
                type: "d-none",
                message: ""
            }
        }
    };

    componentDidMount() {

    }

    render() {
        return (
            <div className="text-center">
                <h1>Template</h1>

            </div>);
    }
}
