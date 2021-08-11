import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
//import './Movies.css'

export default class Movies extends Component {


    state = {
        movies: [],
        isLoaded: false,
        error: null,
    };


    componentDidMount() {
        fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
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
                    movies: json.movies,
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

        const { movies, isLoaded, error } = this.state

        if (error) {
            return <div>Error: {error.message} </div>
        } else if (!isLoaded) {
            return <p>Loading...</p>
        } else {

            return (<Fragment>
                <h2>Choose a movie</h2>
                <div className="list-group">
                    {movies.map((m) => (
                        <Link key={m.id} to={`/movie/${m.id}`} 
                        className="list-group-item list-group-item-action">{m.title}</Link>
                    ))}
                </div>

            </Fragment>
            );
        }
    }
}


