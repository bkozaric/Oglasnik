import React, { Fragment } from 'react';



import { Formik } from 'formik';
import * as Yup from 'yup';

import "./Profile.css";




const PickedTab = (props) => {

    const NewPasswordSchema = Yup.object().shape({
        oldPassword: Yup.string()
            .min(6, 'Password too short')
            .max(50, 'Password too long')
            .required('Please enter a password'),
        newPassword: Yup.string()
            .min(6, 'Password too short')
            .max(50, 'Password too long')
            .notOneOf([Yup.ref('oldPassword'), null], "New password must be different")
            .required('Please enter a password'),
        newPasswordAgain: Yup.string()
            .min(6, 'Password too short')
            .max(50, 'Password too long')
            .required('Please enter a password')
            .oneOf([Yup.ref('newPassword'), null], "Passwords do not match"),

    });

    const SignupSchema = Yup.object().shape({
        address: Yup.string()
            .required('Please enter your address'),
        city: Yup.string()
            .required('Please enter your city'),
        zipcode: Yup.string()
            .required("Please enter your zip code")
            .min(3, "Please enter a valid zip code"),
        username: Yup.string()
            .min(4, 'Username too short')
            .max(30, 'Username too long')
            .required('Please enter a username'),
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

    if (props.currentProfileAction === 0) {
        return (

            <div className="picked-tab">
                <div className="profile-picked-action">
                    <p>Are you sure you want to delete your account?<br /><b>Press 'Delete Account' again to confirm.</b></p>
                </div>
                <div className="profile-pick-action-buttons">
                    <button className="profile-pick-action-delete" onClick={() => props.deleteAccount(props.sessionInfo.userId)}>Delete Account</button>
                    <button className="profile-pick-action-change-password" onClick={() => props.setCurrentProfileAction(1)}>Change Password</button>
                </div>

            </div>

        )
    }
    if (props.currentProfileAction === 1) {
        return (

            <div className="picked-tab">
                <div className="profile-picked-action">
                    <p>To change you password,<br />please enter the required information below.</p>
                    <br />
                    <Formik
                        initialValues={{
                            oldPassword: "",
                            newPassword: "",
                            newPasswordAgain: "",
                        }}
                        validationSchema={NewPasswordSchema}
                        onSubmit={(values) => {
                            props.changePassword(values);
                        }}
                    >
                        {({ values, setFieldValue, errors, touched, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="input-row-container">
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        placeholder="Old password"
                                        value={values.oldPassword}
                                        className={errors.oldPassword && touched.oldPassword ? "form-input-error" : null}
                                        onChange={(e) => setFieldValue("oldPassword", e.target.value)}
                                        required />
                                </div>
                                {props.serverMessage ? <span>{props.serverMessage}</span> : null}
                                {errors.oldPassword && touched.oldPassword && props.serverMessage ? <br /> : null}
                                {errors.oldPassword && touched.oldPassword ? (
                                    <Fragment><span>{errors.oldPassword}</span></Fragment>
                                ) : null}
                                <br />
                                <div className="input-row-container">
                                    <input
                                        type="password"
                                        name="newPassword"
                                        placeholder="New password"
                                        value={values.newPassword}
                                        className={errors.newPassword && touched.newPassword ? "form-input-error" : null}
                                        onChange={(e) => setFieldValue("newPassword", e.target.value)}
                                        required />
                                </div>
                                {errors.newPassword && touched.newPassword ? (
                                    <Fragment><span>{errors.newPassword}</span></Fragment>
                                ) : null}
                                <div className="input-row-container">
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        placeholder="New password again"
                                        value={values.newPasswordAgain}
                                        className={errors.newPasswordAgain && touched.newPasswordAgain ? "form-input-error" : null}
                                        onChange={(e) => setFieldValue("newPasswordAgain", e.target.value)}
                                        required />
                                </div>
                                {errors.newPasswordAgain && touched.newPasswordAgain ? (
                                    <Fragment><span>{errors.newPasswordAgain}</span></Fragment>
                                ) : null}
                                <div className="input-row-container">
                                    <button className="submit-password-change" type="submit">Submit</button>
                                </div>
                            </form>
                        )}

                    </Formik>

                </div>
                <div className="profile-pick-action-buttons">
                    <button className="profile-pick-action-delete" onClick={() => props.setCurrentProfileAction(0)}>Delete Account</button>
                    <button className="profile-pick-action-change-password">Change Password</button>
                </div>
            </div>

        )
    }
    if (props.currentProfileAction === null) {
        return (

            <div className="picked-tab">
                <div className="profile-picked-action">
                    <Formik
                        initialValues={{
                            email: props.userInfo.email,
                            username: props.userInfo.username,
                            firstName: props.userInfo.first_name,
                            lastName: props.userInfo.last_name,
                            contact: props.userInfo.contact,
                            address: props.userInfo.address,
                            city: props.userInfo.city,
                            zipcode: props.userInfo.zipcode
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={(values) => {
                            props.changePersonalInfo(values);
                        }}
                    >
                        {({ values, setFieldValue, errors, touched, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="input-row-container">
                                    <input
                                        type="text"
                                        name="username"
                                        value={values.username}
                                        disabled />
                                </div>
                                <div className="input-row-container">
                                    <input
                                        type="text"
                                        name="email"
                                        value={values.email}
                                        disabled />
                                </div>
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
                                    <button className="submit-password-change" type="submit">Submit</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                    {props.userChangeMessage && <p className="edit-successful-msg">User information updated successfully</p>}
                </div>
                <div className="profile-pick-action-buttons">
                    <button className="profile-pick-action-delete" onClick={() => props.setCurrentProfileAction(0)}>Delete Account</button>
                    <button className="profile-pick-action-change-password" onClick={() => props.setCurrentProfileAction(1)}>Change Password</button>
                </div>
            </div>

        )
    }

}


export default PickedTab;
