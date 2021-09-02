import React, { useEffect, useState, Fragment } from 'react';
import { Link } from "react-router-dom";
import "./EditMovie.css";
import Input from "./form-components/Input";
import Select from "./form-components/Select";
import TextArea from "./form-components/TextArea";
import Alert from "./ui-components/Alert";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

export default function EditMovieFunc(props) {

    const blankMovie = {
        id: -1,
        title: '',
        description: '',
        year: -1,
        release_date: '',
        runtime: 0,
        rating: 0,
        mpaa_rating: -1,
        created_at: '',
        updated_at: '',
        genres: [],
        poster: '',
    }

    const [movie, setMovie] = useState(blankMovie)
    const [error, setError] = useState(null)
    const [errors, setErrors] = useState([])
    const [alert, setAlert] = useState({ type: "d-none", message: "" });
    const [genres, setGenres] = useState([])
    const [list, setList] = useState([])

    const mpaaOptions = [
        { id: "G", value: "G" },
        { id: "PG", value: "PG" },
        { id: "PG13", value: "PG13" },
        { id: "R", value: "R" },
        { id: "NC17", value: "NC17" },
    ];

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/v1/genres`)
            .then((response) => {

                if (response.status !== 200) {
                    setError("Invalid response genres " + response.statusText);
                } else {
                    setError(null);
                }
                return response.json();
            })
            .then((json) => {
                if (json.error) {
                    setError(json.error.message)
                } else {

                    setGenres(Object.values(json.genres))
                }
            });

        return () => {

        }
    }, [])

    useEffect(() => {

        if (props.jwt === "") {
            props.history.push({
                pathname: "/login",
            });
            return;
        }

        const id = props.match.params.id;
        if (id > 0) {
            fetch(`${process.env.REACT_APP_API_URL}/v1/movie/` + id)
                .then((response) => {
                    if (response.status !== 200) {
                        setError("Invalid response: ", response.statusText);
                    } else {
                        setError(null);
                    }
                    return response.json();
                })
                .then((json) => {
                    const releaseDate = new Date(json.movie.release_date);
                    json.movie.release_date = releaseDate.toISOString().split("T")[0];

                    setMovie(json.movie);
                });
        } else {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + props.jwt);

            fetch(`${process.env.REACT_APP_API_URL}/auth`, {
                method: "GET",
                headers: myHeaders,
            }).then((response) => {
                if (response.status !== 200) {
                    setError(response.statusText)
                } else {
                    setError(null)
                }
                return response.json();
            })
                .then((json) => {
                    if (json.error) {
                        setError(json.error.message);
                    } else {
                        // this should copy a movie
                        movie.id = id
                        setMovie(movie);
                    }
                })
        }

    }, [props.history, props.jwt, props.match.params.id])

    if (movie) {
        if (movie.genres) {
            movie.genres = Object.values(movie.genres);
        } else {
            movie.genres = [];
        }
    }

    useEffect(() => {

        console.log("genre change list", list)

        return () => {

        }
    }, [list])


    useEffect(() => {
        // I need to get this in the payload
        // it fires sometime after the submit :-(
        console.log("genres in movie", movie.genres)
        return () => {

        }
    }, [movie.genres])


    const handleSubmit = (evt) => {
        evt.preventDefault();

        for (var i = 0; i < list.length; i++) {
            let evt = list[i];
            if (evt.action === "add") {
                setMovie({
                    ...movie, genres: [...movie.genres, evt.name]
                });
            } else {
                setMovie({
                    ...movie, genres: [...movie.genres.filter((e) => (e !== evt.name))]
                });
            }
        }

        

        // update genre changes
        

        // do validation
        let errors = [];
        if (movie.title === "") {
            errors.push("title");
        }

        if (movie.year === "") {
            errors.push("year")
        }

        if (movie.release_date === "") {
            errors.push("release_date")
        }

        if (movie.runtime === "") {
            errors.push("runtime")
        }

        if (movie.mpma_rating === "") {
            errors.push("mpaa_rating")
        }

        if (movie.rating === "") {
            errors.push("rating")
        }

        if (movie.description === "") {
            errors.push("description")
        }


        setErrors(errors)

        if (errors.length > 0) {
            return false;
        }

        // we passed, so post info

        const data = new FormData(evt.target);

        for (var j = 0; j < movie.genres.length; j++) {
            data.append(movie.genres[j], movie.genres[j])
        }

        const payload = Object.fromEntries(data.entries());

        console.log(JSON.stringify(payload))

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + props.jwt);

        const requestOptions = {
            method: "POST",
            body: JSON.stringify(payload),
            headers: myHeaders,
        };
        fetch(`${process.env.REACT_APP_API_URL}/v1/admin/editmovie`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setAlert({
                        alert: { type: "alert-danger", message: data.error.message },
                    })
                } else {
                    props.history.push({
                        pathname: "/admin",
                    });
                }
            });
    }

    const handleChange = () => (evt) => {
        let value = evt.target.value;
        let name = evt.target.name;

        setMovie({
            ...movie,
            [name]: value,
            // test code 
            // genres: [...movie.genres, 'Action'] 
        });
    }

    const confirmDelete = () => (evt) => {
        console.log("would delete id", movie.id);

        confirmAlert({
            title: "Delete Movie?",
            message: "Are you sure?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        const myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        myHeaders.append("Authorization", "Bearer " + props.jwt);


                        // delete the movie
                        fetch(`${process.env.REACT_APP_API_URL}/v1/admin/deletemovie/` +
                            movie.id,
                            {
                                method: "GET",
                                headers: myHeaders,
                            }
                        )
                            .then((response) => response.json)
                            .then((data) => {
                                if (data.error) {
                                    setAlert({
                                        alert: {
                                            type: "alert-danger",
                                            message: data.error.message,
                                        },
                                    });
                                } else {
                                    setAlert({
                                        alert: { type: "alert-success", message: "Movie deleted!" },
                                    });
                                    props.history.push({
                                        pathname: "/admin",
                                    });
                                }
                            });
                    },
                },
                {
                    label: "No",
                    onClick: () => { },
                },
            ],
        });
    };

    function isActive(value) {
        return list.includes(value)
    }

    const AddName = (e) => {
        let name = e.target.id;

        // clear everything
        e.target.classList.remove("bg-secondary")
        e.target.classList.remove("text-dark")
        e.target.classList.remove("bg-light")
        e.target.classList.remove("delete")
        e.target.classList.remove("add")

        // when the genre exists 'active' is delete
        // when it dies not 'active' is add
        if (movieContainsGenre(name)) {
            e.target.classList.add("delete")
            setList([...list, { name: name, action: "delete" }]);
        } else {
            e.target.classList.add("add")
            setList([...list, { name: name, action: "add" }]);
        }
    };

    // sets classes back to original list  
    const RemoveName = (e) => {
        let name = e.target.id;
        setList(list.filter((e) => (e.name !== name)))

        e.target.classList.remove("add")
        e.target.classList.remove("delete")

        if (movieContainsGenre(name)) {
            e.target.classList.add("bg-secondary")
        } else {
            e.target.classList.add("text-dark")
            e.target.classList.add("bg-light")
        }
    };

    function toggleGenre(evt) {

        //  console.log("clicked:", evt)

        if (list.includes(evt.target.id)) {
            RemoveName(evt)
        } else {
            AddName(evt)
        }
    }

    function hasError(key) {
        return errors.indexOf(key) !== -1;
    }

    function movieContainsGenre(genre) {
        var found = false;

        for (var i = 0; i < movie.genres.length; i++) {
            if (movie.genres[i] === genre) {
                found = true;
                break;
            }
        }

        return found
    }

    if (error !== null) {
        return <div>Error: {error.message}</div>;
    } else {

        if (movie) {
            return (
                <Fragment>
                    <h2>Add/Edit Movie</h2>
                    <Alert
                        alertType={alert.type}
                        alertMessage={alert.message}
                    />
                    <hr />
                    <form onSubmit={handleSubmit}>
                        {movie && (
                            <input
                                type="hidden"
                                name="id"
                                id="id"
                                value={movie.id}
                            />)}

                        {movie && (
                            <Input
                                title={"Title"}
                                className={hasError("title") ? "is-invalid" : ""}
                                type={"text"}
                                name={"title"}
                                value={movie.title}
                                handleChange={handleChange("title")}
                                errorDiv={hasError("title") ? "text-danger" : "d-none"}
                                errorMsg={"Please enter a title"}
                            />)}

                        {movie && (
                            <Input
                                title={"Release Date"}
                                type={"date"}
                                name={"release_date"}
                                value={movie.release_date}
                                handleChange={handleChange("release_date")}
                                errorDiv={hasError("release_date") ? "text-danger" : "d-none"}
                                errorMsg={"Please enter a release date"}
                            />)}

                        {movie && (
                            <Input
                                title={"Runtime"}
                                type={"number"}
                                name={"runtime"}
                                value={movie.runtime}
                                handleChange={handleChange("runtime")}
                                errorDiv={hasError("runtime") ? "text-danger" : "d-none"}
                                errorMsg={"Please enter a runtime"}
                            />)}

                        {movie && (
                            <Select
                                title={"MPAA Rating"}
                                type={"text"}
                                name={"mpaa_rating"}
                                options={mpaaOptions}
                                value={movie.mpaa_rating}
                                handleChange={handleChange("mpaa_rating")}
                                placeholder="Choose..."
                                errorDiv={hasError("mpaa_rating") ? "text-danger" : "d-none"}
                                errorMsg={"Please enter a mpaa rating"}
                            />)}

                        {movie && (
                            <div>
                                <div className="float-start">
                                    <label>Genres: </label>
                                </div>
                                <div className="float-end">

                                    {genres.map((m, index) => {

                                        //const v = true;

                                        return (
                                            <span
                                                className={`badge ${movieContainsGenre(m.genre_name) ? "badge bg-secondary" : "bg-light text-dark"} ${isActive(m.genre_name) ? "" : ""} me-1`}
                                                //className={`badge ${!isActive(m.genre_name) ? "active" : "inactive"} me-1`}

                                                key={index} value={m.id} id={m.genre_name} name={m.genre_name}
                                                onClick={e => toggleGenre(e)}


                                            >
                                                {m.genre_name}
                                            </span>)

                                        //   <button value="blue" onClick={e => changeColor(e.target.value)}>Color Change</button
                                    })}
                                </div>
                                <div className="clearfix"></div>
                                <hr />
                            </div>
                        )}

                        {movie && (
                            <Input
                                title={"Rating"}
                                type={"number"}
                                name={"rating"}
                                value={movie.rating}
                                handleChange={handleChange("rating")}
                                errorDiv={hasError("rating") ? "text-danger" : "d-none"}
                                errorMsg={"Please enter a rating"}
                            />)}

                        {movie && (
                            <TextArea
                                title={"Description"}
                                name={"description"}
                                value={movie.description}
                                rows={"3"}
                                handleChange={handleChange("description")}
                                errorDiv={hasError("description") ? "text-danger" : "d-none"}
                                errorMsg={"Please enter a description"}
                            />)}


                        <hr />

                        <button className="btn btn-primary">Save</button>
                        <Link to="/admin" className="btn btn-warning ms-1">
                            Cancel
                        </Link>
                        {movie && movie.id > 0 && (
                            <a
                                href="#!"
                                onClick={() => confirmDelete()}
                                className="btn btn-danger ms-1"
                            >
                                Delete
                            </a>
                        )}
                    </form>
                </Fragment>
            );
        } else {

            return (
                <div>loading</div>
            )
        }




    }

}

