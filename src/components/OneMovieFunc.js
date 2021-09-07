import React, { useEffect, useState, Fragment } from 'react';
import Bar from './form-components/Bar';

export default function OneMovieFunc(props) {

  const [movie, setMovie] = useState({})
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/movie/` + props.match.params.id)
      .then((response) => {
        if (response.status !== 200) {
          setError("Invalid response: " + response.statusText);
        } else {
          setError(null);
        }
        return response.json();
      })
      .then((json) => {
        if (json.error) {
          setError(json.error.message)
        } else {
          setMovie(json.movie)
        }
      });
  }, [props.match.params.id]);

  if (movie.genres) {
    movie.genres = Object.values(movie.genres);
  } else {
    movie.genres = [];
  }

  let arr = []
  for (var i = 0; i < movie.genres.length; i++) {
     arr.push({id: i, genre_name: movie.genres[i]})     
  }

  if (error !== null) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <Fragment>
        <h2>
          Movie: {movie.title} ({movie.year})
        </h2>

        <Bar options={arr} compare={movie.genres}
          subTitle={"Rated:"} subElement={movie.mpaa_rating}
          handleClick={console.log("non edit bar item clicked!")}
        />

        <table className="table table-compact table-striped">
          <thead></thead>
          <tbody>
            <tr>
              <td>
                <strong>Title:</strong>
              </td>
              <td>{movie.title}</td>
            </tr>
            <tr>
              <td><strong>Description:</strong></td>
              <td>{movie.description}</td>
            </tr>
            <tr>
              <td>
                <strong>Run time:</strong>
              </td>
              <td>{movie.runtime} minutes</td>
            </tr>
          </tbody>
        </table>
      </Fragment>
    );
  }

}


