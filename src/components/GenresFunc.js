import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
//import './Movies.css'


export default function GenresFunc(props) {

    const [genres, setGenres] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/v1/genres`)
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
                    setGenres(json.genres)
                }
            });
            
    }, []);


 if (error !== "") {
        return <div>Error: {error.message} </div>
    } else {
        return (<Fragment>
            <h1>Choose a genre</h1>
            <div className="list-group">
                {genres.map((m) => (
                    <Link className="list-group-item list-group-item-action"
                        key={m.id} to={{
                            pathname: `/genre/${m.id}`,
                            genreName: m.genre_name
                        }}>{m.genre_name}</Link>
                ))}
            </div>
        </Fragment>
        );
    }
}


