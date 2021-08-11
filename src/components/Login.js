import React, { Component, Fragment } from 'react';
import { Link } from "react-router-dom";
import Input from './form-components/Input';
import Alert from './ui-components/Alert';

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            error: null,
            errors: [],
            alert: {
                type: "d-none",
                message: "",
            },
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange = (evt) => {
        let value = evt.target.value;
        let name = evt.target.name;
        this.setState((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    handleSubmit = (evt) => {
        evt.preventDefault()

        // client side validation
        let errors = [];

        if (this.state.email === "") {
            errors.push("email")
        }

        if (this.state.password === "") {
            errors.push("password")
        }

        this.setState({
            errors: errors
        })

        if (errors.length > 0) {
            return false;
        }

        const data = new FormData(evt.target);
        const payload = Object.fromEntries(data.entries());

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(payload)
        }

        fetch(`${process.env.REACT_APP_API_URL}/v1/signin`, requestOptions)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.error) {
                    this.setState({
                        alert: { type: "alert-danger", message: json.error.message, },
                    });
                } else {
                    this.handleJWTChange(Object.values(json)[0]);

                    window.localStorage.setItem("jwt", JSON.stringify(Object.values(json)[0]))

                    this.props.history.push({
                        pathname: "/admin"
                    })
                }
            });
    }


    handleJWTChange(jwt) {
        this.props.handleJWTChange(jwt);
    }

    hasError(key) {
        return this.state.errors.indexOf(key) !== -1;
    }

    render() {
        let { email, password, error } = this.state;

        if (error) {
            return <div>Error: {error.Message}</div>;
        }
        return (

            <Fragment>
                <h2>Login</h2>
                <hr />
                <Alert
                    alertType={this.state.alert.type}
                    alertMessage={this.state.alert.message}
                />
                <hr />
                <form className="pt-3" onSubmit={this.handleSubmit}>

                    <Input
                        title={"Email"}
                        className={this.hasError("email") ? "is-invalid" : ""}
                        type={"email"}
                        name={"email"}
                        value={email}
                        handleChange={this.handleChange}
                        errorDiv={this.hasError("email") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a email"}
                    />
                    <Input
                        title={"Password"}
                        className={this.hasError("password") ? "is-invalid" : ""}
                        type={"text"}
                        name={"password"}
                        value={password}
                        handleChange={this.handleChange}
                        errorDiv={this.hasError("password") ? "text-danger" : "d-none"}
                        errorMsg={"Please enter a password"}
                    />
                    <hr />

                    <button className="btn btn-primary">Login</button>
                    <Link to="/" className="btn btn-warning ms-1">
                        Cancel
                    </Link>
                </form>
            </Fragment>
        );
    }
}

