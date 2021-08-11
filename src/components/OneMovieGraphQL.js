import React, { Component, Fragment } from "react";

export default class OneMovieGraphQL extends Component {
  state = { movie: {}, isLoaded: false, error: null };

  componentDidMount() {
    const id = this.props.match.params.id
    const payload = `
    {
        movie(id: ${id}) {
            id
            title
            release_date
            runtime
            mpaa_rating
            rating
            description
            year
            poster
        }
    }`

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    //myHeaders.append("Authorization", "Bearer " + this.props.jwt);
    // movie
    fetch(`${process.env.REACT_APP_API_URL}/v1/graphql`,
      {
        method: "POST",
        body: payload,
        headers: myHeaders,
      }
    ).then((response) => {
      if (response.status !== 200) {
        let err = Error;
        err.message = "Invalid response code: " + response.status;

        this.setState({ error: err });
      }
      return response.json();
    })
      .then((json) => {

        if (json.error) {
          let err = Error;
          err.message = json.error.message;

          this.setState({
            error: err,
            isLoaded: true,
          })

        } else {




          this.setState(
            {
              movie: json.data.movie,
              isLoaded: true,
            },
            (error) => {
              this.setState({
                isLoaded: true,
                error,
              });
            }
          );
        }
      })
  }

  render() {
    const { movie, isLoaded, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <p>Loading...</p>;
    } else {
      return (
        <Fragment>
          <h2>
            Movie: {movie.title} ({movie.year})
          </h2>


          {movie.poster !== "" && (
            <div>
              <img src={`https://image.tmdb.org/t/p/w200${movie.poster}`} alt="poster"></img>
            </div>
          )}

          <div className="float-start">
            <small>Rating: {movie.mpaa_rating}</small>
          </div>
          <hr />

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
}
