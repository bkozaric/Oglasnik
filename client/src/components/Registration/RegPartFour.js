import React from 'react';

import "./Registration.css";


const RegPartFour = (props) => {

    if (props.regSuccess) {
        return (
            <div className="form">
                <h2>REGISTER</h2>
                <p className="success-msg">Registration complete! Please verify your email.</p>
            </div>
        );
    }
    return null;


}
export default RegPartFour;
