
import React from "react";

const Bar = (props) => {
   return (
   <div>
    <div className="float-start">
    <small> {props.subTitle} {props.subElement}</small> 
        <label> {props.title} </label>
    </div>
    <div className="float-end">
        {props.options.map((option) => {
            //const v = true;
            return (
                <span
                    className={`badge ${props.compare.includes(option.genre_name) ? "badge bg-secondary" : "bg-light text-dark"} me-1`}                                          
                    key={option.id} value={option.id} id={option.genre_name} name={option.genre_name}
                    onClick={props.handleClick}
                >
                    {option.genre_name}
                </span>)

            //   <button value="blue" onClick={e => changeColor(e.target.value)}>Color Change</button
        })}</div> <div className="clearfix"></div><hr />
        </div>)
}

export default Bar;
