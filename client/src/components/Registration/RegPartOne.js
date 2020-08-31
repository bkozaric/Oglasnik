import React, { Fragment } from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import "./Registration.css";


const RegPartOne = (props) => {

    const SignupSchema = Yup.object().shape({
        username: Yup.string()
            .min(4, 'Username too short')
            .max(30, 'Username too long')
            .required('Please enter a username'),
        password: Yup.string()
            .min(6, 'Password too short')
            .max(50, 'Password too long')
            .required('Please enter a password'),
        passwordAgain: Yup.string()
            .min(6, 'Password too short')
            .max(50, 'Password too long')
            .required('Please enter a password')
            .oneOf([Yup.ref('password'), null], "Passwords do not match"),
    });


    return (
        <div className="form">
            <h2>REGISTER</h2>
            <p>Enter your login info</p>
            <Formik
                initialValues={{
                    username: "",
                    password: "",
                    passwordAgain: "",
                }}
                validationSchema={SignupSchema}
                onSubmit={(values) => {
                    props.nextPhase(values);
                }}
            >
                {({ values, setFieldValue, errors, touched, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="input-row-container">
                            <input
                                name="username"
                                type="text"
                                placeholder="Username"
                                value={values.username}
                                className={errors.username && touched.username ? "form-input-error" : null}
                                onChange={(e) => setFieldValue("username", e.target.value)}
                                required
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
                                value={values.password}
                                className={errors.password && touched.password ? "form-input-error" : null}
                                onChange={(e) => setFieldValue("password", e.target.value)}
                                required
                            />
                        </div>
                        {errors.password && touched.password ? (
                            <Fragment><span>{errors.password}</span></Fragment>
                        ) : null}
                        <div className="input-row-container">
                            <input
                                name="passwordAgain"
                                type="password"
                                placeholder="Repeat Password"
                                value={values.passwordAgain}
                                className={errors.passwordAgain && touched.passwordAgain ? "form-input-error" : null}
                                onChange={(e) => setFieldValue("passwordAgain", e.target.value)}
                                required
                            />
                        </div>
                        {errors.passwordAgain && touched.passwordAgain ? (
                            <Fragment><span>{errors.passwordAgain}</span></Fragment>
                        ) : null}
                        {props.userTaken && <span>This username is taken.</span>}
                        <div className="input-row-container">
                            <button type="submit">Next</button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );
}
export default RegPartOne;
