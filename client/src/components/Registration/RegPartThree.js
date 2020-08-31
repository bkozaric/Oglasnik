import React, { Fragment } from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import "./Registration.css";


const RegPartThree = (props) => {

    const SignupSchema = Yup.object().shape({
        address: Yup.string()
            .required('Please enter your address'),
        city: Yup.string()
            .required('Please enter your city'),
        zipcode: Yup.string()
            .required("Please enter your zip code")
            .min(3, "Please enter a valid zip code")
    });


    return (
        <div className="form">
            <h2>REGISTER</h2>
            <p>Enter your location</p>
            <Formik
                initialValues={{
                    address: "",
                    city: "",
                    zipcode: ""
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
                                name="address"
                                type="text"
                                placeholder="Your address"
                                value={values.address}
                                className={errors.address && touched.address ? "form-input-error" : null}
                                onChange={(e) => setFieldValue("address", e.target.value)}
                                required
                            />
                        </div>
                        {errors.address && touched.address ? (
                            <Fragment><span>{errors.address}</span></Fragment>
                        ) : null}
                        <div className="input-row-container">
                            <input
                                name="city"
                                type="text"
                                placeholder="Your city"
                                value={values.city}
                                className={errors.city && touched.city ? "form-input-error" : null}
                                onChange={(e) => setFieldValue("city", e.target.value)}
                                required
                            />
                        </div>
                        {errors.city && touched.city ? (
                            <Fragment><span>{errors.city}</span></Fragment>
                        ) : null}
                        <div className="input-row-container">
                            <input
                                name="zipcode"
                                type="text"
                                placeholder="Your zipcode"
                                value={values.zipcode}
                                className={errors.zipcode && touched.zipcode ? "form-input-error" : null}
                                onChange={(e) => setFieldValue("zipcode", e.target.value)}
                                required
                            />
                        </div>
                        {errors.zipcode && touched.zipcode ? (
                            <Fragment><span>{errors.zipcode}</span></Fragment>
                        ) : null}

                        <div className="input-row-container">
                            <button type="submit">Register</button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
    );

}
export default RegPartThree;
