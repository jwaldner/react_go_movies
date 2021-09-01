import React, { useEffect, useState, Fragment } from 'react';
import { Link } from "react-router-dom";

export default function OneGenreFunc(props) {
 
  let [movies, setMovies] = useState([])
  let [genreName, setGenreName] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/genres/` + props.match.params.id)
      .then((response) => {
        if (response.status !== 200) {
          setError("Invalid response: " + response.statusText);
        } else {
          setError("")
        }
        return response.json();
      })
      .then((json) => {
        if (json.error) {
          setError(json.error.message)
        } else {
          setGenreName(props.location.genreName)
          setMovies(json.movies)
        }

      });
  }, [props.match.params.id, props.location.genreName]);

  if (!movies) {
    movies = [];
  }

  if (error !== "") {
    return <div>Error: {error.message} </div>
  }
  else {
    return (<Fragment>
      <h2>Genre: {genreName}</h2>
      <div className="list-group">
        {movies.map((m) => (
          <Link to={`/movie/${m.id}`}
            className="list-group-item list-group-item-action">{m.title}</Link>
        ))}
      </div>
  
    </Fragment>
    );
  }
}
  





