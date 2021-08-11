import React, { Component } from 'react';
import './Home.css'
import Ticket from "./../images/movie_tickets.jpg";
export default class Home extends Component {

    componentDidMount() {
        if (`${process.env.REACT_APP_API_URL}`) {
             console.log("url:",`${process.env.REACT_APP_API_URL}`)
        } else {
            console.log("env var not found!")
        }
        
       
    }

    render() {
        return (
            <div className="text-center">
                <h1>Home </h1>
                <hr />
                <img src={Ticket} alt="movie ticket import"></img>
                <hr />
                <div className="tickets" alt="movie ticket css" ></div>
            </div>);
    }
}
