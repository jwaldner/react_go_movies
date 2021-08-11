import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
//import './Movies.css'

export default class Admin extends Component {


    state = {
        movies: [],
        isLoaded: false,
        error: null,
    };


    componentDidMount() {
        if (this.props.jwt === "") {
            this.props.history.push({
                pathname: "/login",
            });
            return;
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + this.props.jwt);

        fetch(`${process.env.REACT_APP_API_URL}/v1/admin/movies`,
            {
                method: "GET",
                headers: myHeaders,
            }
        )
            //.then((response) => response.json())
            .then((response) => {
                console.log("Status code is", response.status);

                if (response.status !== 200) {
                    let err = Error;
                    err.message = response.statusText;
                    this.setState({ error: err })
                }
                return response.json();

            })
            .then((json) => {
                if (json.error) {
                    this.setState({
                        error: json.error,
                        isLoaded: true,
                    });
                } else {
                    this.setState({
                        movies: json.movies,
                        isLoaded: true,
                    }, (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        });
                    });
                }
            });
    };

    render() {

        const { movies, isLoaded, error } = this.state

        if (error) {
            return <div>Error: {error.message} </div>
        } else if (!isLoaded) {
            return <p>Loading...</p>
        } else {

            return (<Fragment>
                <h2>Edit a movie</h2>
                <div className="list-group">
                    {movies.map((m) => (
                        <Link key={m.id} to={`/admin/movie/${m.id}`}
                            className="list-group-item list-group-item-action">{m.title}</Link>
                    ))}
                </div>

            </Fragment>
            );
        }
    }
}


