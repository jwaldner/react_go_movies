import React from "react";

const Alert = (props) => {
    return (
        <div className={`alert ${props.alertType}`} role="alert">
            {props.alertMessage}
        </div>
    );
}

//"alert-primary"
//"alert-secondary"
//"alert-success"
//"alert-danger" 
//"alert alert-warning"
//"alert-info" 
//"alert-light" 
//"alert-dark" 

export default Alert