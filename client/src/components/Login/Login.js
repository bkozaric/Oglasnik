import React, { Fragment, useState, useContext } from 'react';
import { LoggedContext } from '../../LoggedContext';
import "./Login.css";
import Logout from "../Logout/Logout"

import { Formik } from 'formik';
import * as Yup from 'yup';

const Login = () => {
    const sessionInfo = useContext(LoggedContext);
    const [success, setSuccess] = useState(true);
    const [loginMessage, setLoginMessage] = useState(null)

    const SigninSchema = Yup.object().shape({
        username: Yup.string()
            .min(4, 'Username too short')
            .max(30, 'Username too long')
            .required('Please enter a username'),
        password: Yup.string()
            .min(6, 'Password too short')
            .max(50, 'Password too long')
            .required('Please enter a password'),
    });

    const login = async (values) => {
        try {
            const body = { username: values.username, password: values.password };
            await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            }).then(answer => answer.json())
                .then(data => {
                    if (data.login === 1) {
                        window.location = "/";
                    }
                    else {
                        setLoginMessage(data.message);
                        setSuccess(false);
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
        return <div className="form">
            <h2>LOGIN</h2>
            <Formik
                initialValues={{
                    username: "",
                    password: "",
                }}
                validationSchema={SigninSchema}
                onSubmit={(values) => {
                    login(values);
                }}
            >
                {({ values, setFieldValue, errors, touched, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="input-row-container">
                            <input
                                name="username"
                                type="text"
                                placeholder="Username"
                                className={errors.username && touched.username ? "form-input-error" : null}
                                value={values.username}
                                onChange={(e) => setFieldValue("username", e.target.value)}
                            />
                        </div>
                        {errors.username && touched.username ? (
                            <Fragment><span>{errors.username}</span></Fragment>
                        ) : null}
                        <div className="input-row-container">
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                className={errors.password && touched.password ? "form-input-error" : null}
                                value={values.password}
                                onChange={(e) => setFieldValue("password", e.target.value)}
                                required

                            />
                        </div>
                        {errors.password && touched.password ? (
                            <Fragment><span>{errors.password}</span></Fragment>
                        ) : null}
                        <div className="input-row-container">
                            <button type="submit">Login</button>
                        </div>
                        {!success && <p className="error-msg">{loginMessage}</p>}

                    </form>)}
            </Formik>
        </div>
    }
    else {
        return null;
    }
}

export default Login;
