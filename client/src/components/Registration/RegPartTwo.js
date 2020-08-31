import React, { Fragment } from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import "./Registration.css";


const RegPartTwo = (props) => {

    const SignupSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('Please enter your first name'),
        lastName: Yup.string()
            .required('Please enter your last name'),
        contact: Yup.number()
            .min(100000, "Please enter a valid phone number")
            .required('Please enter your phone number')
            .integer("Please enter a valid phone number")
            .typeError("Please enter a valid phone number"),
    });


    return (
        <div className="form">
            <h2>REGISTER</h2>
            <p>Enter your personal info</p>
            <Formik
                initialValues={{
                    firstName: "",
                    lastName: "",
                    contact: "",
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
                                name="firstName"
                                type="text"
                                placeholder="First Name"
                                value={values.firstName}
                                className={errors.firstName && touched.firstName ? "form-input-error" : null}
                                onChange={(e) => setFieldValue("firstName", e.target.value)}
                                required
                            />
                        </div>
                        {errors.firstName && touched.firstName ? (
                            <Fragment><span>{errors.firstName}</span></Fragment>
                        ) : null}
                        <div className="input-row-container">
                            <input
                                name="lastName"
                                type="text"
                                placeholder="Last Name"
                                value={values.lastName}
                                className={errors.lastName && touched.lastName ? "form-input-error" : null}
                                onChange={(e) => setFieldValue("lastName", e.target.value)}
                                required
                            />
                        </div>
                        {errors.lastName && touched.lastName ? (
                            <Fragment><span>{errors.lastName}</span></Fragment>
                        ) : null}
                        <div className="input-row-container">
                            <input
                                name="contact"
                                type="text"
                                placeholder="Your phone number"
                                value={values.contact}
                                className={errors.contact && touched.contact ? "form-input-error" : null}
                                onChange={(e) => setFieldValue("contact", e.target.value)}
                                required
                            />
                        </div>
                        {errors.contact && touched.contact ? (
                            <Fragment><span>{errors.contact}</span></Fragment>
                        ) : null}

                        <div className="input-row-container">
                            <button type="submit">Next</button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );

}
export default RegPartTwo;
