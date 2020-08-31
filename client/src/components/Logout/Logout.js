import React from 'react'

const Logout = () => {

    const logout = async () => {
        //console.log("logout called");
        try{
            await fetch("/api/users/logout");
            window.location = "/login";
        }
        catch (err){
            console.log(err);
        }
    }

    return (
        <div className="form">
            <p className="already-logged">You are already logged in</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Logout;
