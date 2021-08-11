import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
//import './Movies.css'

export default class Genre extends Component {


    state = {
        genres: [],
        isLoaded: false,
        error: null,
    };


    componentDidMount() {
        fetch(`${process.env.REACT_APP_API_URL}/v1/genres`)
            //.then((response) => response.json())
            .then((response) => {
                console.log("Status code is", response.status);

                if (response.status !== "200") {
                    let err = Error;
                    err.message = "Invalid response code " + response.status;
                    this.setState({ error: err })
                }
                return response.json();

            })
            .then((json) => {
                this.setState({
                    genres: json.genres,
                    isLoaded: true,
                }, (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                });
            });
    };

    //handlePostChange(posts) {
    //    this.props.handlePostChange(posts);
    //}

    //fetchList = () => {
    //    fetch('https://jsonplaceholder.typicode.com/posts')
    //        .then((response) => response.json())
    //        .then(json => {
    //            this.handlePostChange(json);
    //        })

    //}

    render() {

        const { genres, isLoaded, error } = this.state

        if (error) {
            return <div>Error: {error.message} </div>
        } else if (!isLoaded) {
            return <p>Loading...</p>
        } else {

            return (<Fragment>
                <h1>Choose a genre</h1>
                <div className="list-group">
                    {genres.map((m) => (
                        <Link className="list-group-item list-group-item-action"
                            key={m.id} to={{
                                pathname: `/genres/${m.id}`,
                                genreName: m.genre_name
                            }}>{m.genre_name}</Link>
                    ))}
                </div>

            </Fragment>
            );
        }
    }
}


