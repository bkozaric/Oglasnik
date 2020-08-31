import React, { useContext } from 'react';
import "./Nav.css";
import { LoggedContext } from "../../LoggedContext";

const Nav = () => {

    const sessionInfo = useContext(LoggedContext);

    const logout = async () => {
        try {
            await fetch("/api/users/logout");
            window.location.href = "/";
        }
        catch (err) {
            console.log(err);
        }
    }

    if (sessionInfo.logged === 0) {
        return (
            <nav>
                <ul>
                    <li><a href="/">Ads</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/registration">Registration</a></li>
                </ul>
            </nav>
        );
    }
    if(sessionInfo.logged === 1){
        return (
            <nav>
                <ul>
                    <li><a href="/">Ads</a></li>
                    <li><a href="/createAd">Create Ad</a></li>
                    <li><a href={"/cart"}>Cart</a></li>
                    <li><a href={"/profile"}>Profile</a></li>
                    <li><a onClick={() => logout()} href="#">Logout</a></li>
                </ul>
            </nav>
        );
    }

    return (
        <nav>
            <ul>
                <li></li>
            </ul>
        </nav>
    );
    
    

}

export default Nav;
