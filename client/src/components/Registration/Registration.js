import React, { useEffect, useState, useContext } from 'react';

import { LoggedContext } from '../../LoggedContext';

import Logout from "../Logout/Logout"
import "./Registration.css";
import RegPartOne from './RegPartOne';
import RegPartTwo from './RegPartTwo';
import RegPartThree from './RegPartThree';
import RegPartZero from './RegPartZero';
import RegPartFour from "./RegPartFour";

import Fade from 'react-reveal/Fade';

const RegistrationForm = () => {

    const sessionInfo = useContext(LoggedContext);

    const [emailTaken, setEmailTaken] = useState(null);
    const [userTaken, setUserTaken] = useState(null);

    const [registrationComplete, setRegistrationComplete] = useState(null);

    const [registrationInfo, setRegistrationInfo] = useState({});

    const [registrationPhase, setRegistrationPhase] = useState(0);

    useEffect(() => {
        if (registrationPhase === 3) {
            submitRegister();
        }
    }, [registrationInfo])

    useEffect(() => {
        if (registrationComplete !== null) {
            setRegistrationPhase(4);
            setTimeout(() => window.location.href = "/", 5000);
        }
    }, [registrationComplete])

    const nextPhase = async (values) => {
        if (registrationPhase === 0) {
            try {
                await fetch("/api/users/checkemail", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: values.email })
                }).then(answer => answer.json())
                    .then(data => {
                        if (data.success === 1) {
                            setEmailTaken(null);
                            setRegistrationInfo({ ...registrationInfo, ...values })
                            setRegistrationPhase(prevVal => prevVal + 1);
                        }
                        if (data.message) {
                            setEmailTaken(true);
                        }
                    });
            }
            catch (err) {
                console.error(err);
            }
        }
        if (registrationPhase === 1) {
            try {
                await fetch("/api/users/checkuser", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: values.username })
                }).then(answer => answer.json())
                    .then(data => {
                        if (data.success === 1) {
                            setUserTaken(null);
                            setRegistrationInfo({ ...registrationInfo, ...values })
                            setRegistrationPhase(prevVal => prevVal + 1);
                        }
                        if (data.message) {
                            setUserTaken(true);
                        }
                    });
            }
            catch (err) {
                console.error(err);
            }
        }
        if (registrationPhase > 1 && registrationPhase !== 4) {
            setRegistrationInfo({ ...registrationInfo, ...values })
            setRegistrationPhase(prevVal => prevVal + 1);
        }
    }

    const submitRegister = async () => {
        try {
            const body = { ...registrationInfo };
            await fetch("/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            }).then(answer => answer.json())
                .then(data => {
                    if (data.message === 1) {
                        setRegistrationComplete(true);
                    }
                    else {
                        setRegistrationComplete(false);
                    }
                });
        }
        catch (err) {
            console.error(err);
        }
    };


    if (sessionInfo.logged === 1) {
        return <Logout />
    }
    else if (sessionInfo.logged === 0) {
        if (registrationPhase === 0) {
            return <Fade key={0}><RegPartZero emailTaken={emailTaken} nextPhase={nextPhase} /></Fade>
        }
        if (registrationPhase === 1) {
            return <Fade key={1}><RegPartOne userTaken={userTaken} nextPhase={nextPhase} /></Fade>
        }
        if (registrationPhase === 2) {
            return <Fade key={2}><RegPartTwo nextPhase={nextPhase} /></Fade>
        }
        if (registrationPhase === 3) {
            return <Fade key={3}><RegPartThree nextPhase={nextPhase} /></Fade>
        }
        if (registrationPhase === 4) {
            return <Fade key={4}><RegPartFour regSuccess={registrationComplete} /></Fade>
        }
        return null;
    }
    else {
        return null;
    }

}

export default RegistrationForm;
