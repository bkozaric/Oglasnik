import React, { Fragment } from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import "./Registration.css";

const RegPartZero = (props) => {

    const SignupSchema = Yup.object().shape({
        email: Yup.string()
            .email("Please enter a valid email address")
            .required('Please enter your email address'),
        emailAgain: Yup.string()
            .required('Please enter your email address again')
            .oneOf([Yup.ref('email'), null], "Email addresses do not match"),
    });


    return (

        <div className="form">
            <h2>REGISTER</h2>
            <p>Enter your email address</p>
            <Formik
                initialValues={{
                    email: "",
                    emailAgain: "",
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
                                name="email"
                                type="text"
                                placeholder="Email address"
                                value={values.username}
                                className={errors.email && touched.email ? "form-input-error" : null}
                                onChange={(e) => setFieldValue("email", e.target.value)}
                                required
                            />
                        </div>
                        {errors.email && touched.email ? (
                            <Fragment><span>{errors.email}</span></Fragment>
                        ) : null}
                        <div className="input-row-container">
                            <input
                                name="emailAgain"
                                type="text"
                                placeholder="Repeat email"
                                value={values.emailAgain}
                                className={errors.emailAgain && touched.emailAgain ? "form-input-error" : null}
                                onChange={(e) => setFieldValue("emailAgain", e.target.value)}
                                required
                            />
                        </div>
                        {errors.emailAgain && touched.emailAgain ? (
                            <Fragment><span>{errors.emailAgain}</span></Fragment>
                        ) : null}
                        {props.emailTaken && <span>This email is taken.</span>}
                        <div className="input-row-container">
                            <button type="submit">Next</button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>

    );

}
export default RegPartZero;
