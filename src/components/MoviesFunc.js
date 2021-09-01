import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';


export default function MoviesFunc(props) {

    const [movies, setMovies] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/v1/movies`)
            .then((response) => {

                if (response.status !== 200) {
                    setError("Invalid response " + response.statusText);
                } else {
                    setError("");
                }
                return response.json();
            })
            .then((json) => {
                if (json.error) {
                    setError(json.error.message)
                } else {
                    setMovies(json.movies)
                }
            });
        // set the default value to an empty array
    }, []);

    if (error !== "") {
        return <div>Error: {error.message} </div>
    } else {
        return (
            <Fragment>
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
