import React, { useContext, useState, useEffect, Fragment } from 'react';
import { LoggedContext } from '../../LoggedContext';
import "./Edit.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { Formik } from 'formik';
import * as Yup from 'yup';

const Edit = (props) => {

    const [ad, setAd] = useState({
        id: null,
        title: "",
        description: "",
        price: 0,
        image: ""
    })

    const [adFetched, setAdFetched] = useState(false);
    const [success, setSuccess] = useState(null);
    const [imageList, setImageList] = useState([]);
    const [permanentImage, setPermanentImage] = useState(null)
    const sessionInfo = useContext(LoggedContext);
    const [isImage, setIsImage] = useState(null);

    const AdSchema = Yup.object().shape({
        title: Yup.string()
            .min(5, 'Title too short')
            .max(25, 'Title too long')
            .required('Please enter a title'),
        description: Yup.string()
            .min(20, 'Description too short')
            .max(500, 'Description too long')
            .required('Please enter a description'),
        price: Yup.number()
            .required('Please enter a price')
            .integer("Please enter a number")
            .positive("Please enter a value higher than zero")
            .typeError("Please enter a number")
            .lessThan(10000000000, "Please enter a value below 10.000.000.000")
    });

    const getAd = async () => {
        try {
            const response = await fetch("/api/ads/" + props.match.params.id);
            const adJson = await response.json();
            setAdFetched(true);
            let newImageList = []
            await adJson.image.map((img) => newImageList.push(img.imageUrl));
            if (!adJson.message) {
                setPermanentImage(adJson.image[0].imageUrl);
                setImageList(newImageList);
                setAd({ ...adJson[0], image: adJson.image[0].imageUrl });
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getAd();
    }, []);



    const editAd = async (values) => {
        if (imageList.length > 0) {
            try {
                const body = {
                    ...ad,
                    title: values.title,
                    description: values.description,
                    price: values.price,
                    image: imageList,
                    uid: ad.addedBy
                };
                await fetch("/api/ads/edit/" + props.match.params.id, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }).then(answer => answer.json())
                    .then(data => {
                        setSuccess(data.success);
                        if (data.success === 1) {
                            setTimeout(() => window.location.href = "/view/" + props.match.params.id, 1500);
                        }
                    });
            }
            catch (err) {
                console.error(err);
            }
        }
    };

    const pushImage = async () => {
        setIsImage(true);
        if (imageList.length < 10) {
            if (ad.image) {
                if (ad.image.trim().length > 0) {
                    if (!imageList.includes(ad.image)) {
                        await fetch("/api/ads/checkImage", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ url: ad.image })
                        }).then(answer => answer.json())
                            .then(data => {
                                if (data.isImage === 1) {
                                    setImageList([...imageList, ad.image]);
                                    setAd({ ...ad, image: "" });
                                    setIsImage(true);
                                    return;
                                }
                                else{
                                    setIsImage(false);
                                }
                            });
                    }
                }
            }
        }
    }

    const removeImage = async (ix) => {
        let newImageList = imageList;
        newImageList.splice(ix, 1);
        setImageList(newImageList);
        setAd({ ...ad, image: ad.image });
    }

    if (sessionInfo.logged === 1) {
        if (ad.id) {
            if (sessionInfo.userId === ad.addedBy) {
                return (
                    <div className="container">
                        <div className="ad-form">
                            <h2 className="form-title">Edit Ad - {props.match.params.id}</h2>
                            <Formik
                                initialValues={{
                                    title: ad.title,
                                    description: ad.description,
                                    price: ad.price,
                                }}
                                validationSchema={AdSchema}
                                onSubmit={(values) => {
                                    editAd(values);
                                }}
                            >
                                {({ values, setFieldValue, errors, touched, handleSubmit }) => (
                                    <form onSubmit={handleSubmit}>
                                        <img alt="ad" className="edit-ad-img" src={permanentImage} />
                                        <div className="ad-input-row-container">
                                            <input
                                                type="text"
                                                placeholder="Title"
                                                value={values.title}
                                                className={errors.title && touched.title ? "form-ad-input form-input-error" : "form-ad-input"}
                                                onChange={
                                                    e => setFieldValue("title", e.target.value)
                                                } required />
                                            {errors.title && touched.title ? (
                                                <Fragment><span>{errors.title}</span></Fragment>
                                            ) : null}
                                        </div>
                                        <div className="ad-input-row-container">
                                            <textarea
                                                rows="8"
                                                placeholder="Description"
                                                value={values.description}
                                                className={errors.description && touched.description ? "form-ad-input form-input-error" : "form-ad-input"}
                                                onChange={
                                                    e => setFieldValue("description", e.target.value)
                                                } required />
                                            {errors.description && touched.description ? (
                                                <Fragment><span>{errors.description}</span></Fragment>
                                            ) : null}
                                        </div>
                                        <div className="ad-input-row-container">
                                            <input
                                                type="text"
                                                placeholder="Price"
                                                value={values.price}
                                                className={errors.price && touched.price ? "form-ad-input form-input-error" : "form-ad-input"}
                                                onChange={
                                                    e => setFieldValue("price", e.target.value)
                                                } required />
                                            {errors.price && touched.price ? (
                                                <Fragment><span>{errors.price}</span></Fragment>
                                            ) : null}
                                        </div>
                                        <div className="ad-input-row-container">
                                            <input
                                                type="text"
                                                placeholder="Image URL"
                                                value={ad.image}
                                                className={imageList.length ? "form-ad-input" : "form-ad-input form-input-error"}
                                                onChange={
                                                    e => setAd({ ...ad, image: e.target.value })
                                                } />
                                            {isImage === false ? <span>This is not an image.</span> : null}
                                            {imageList.length ? <p className="images-label">Images:</p> : <span>Please add at least one image</span>}

                                            <div className="edit-image-list">
                                                {imageList.map((img) =>
                                                    <div key={imageList.indexOf(img)}>
                                                        <img src={img} alt="ad" className="image-item-list" />
                                                        <div onClick={() => removeImage(imageList.indexOf(img))}><FontAwesomeIcon icon={faTimes} /></div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="list-push-image" onClick={() => pushImage()}><FontAwesomeIcon icon={faPlusCircle} /></div>
                                        </div>
                                        {!success && <button type="submit">Edit</button>}
                                    </form>
                                )}
                            </Formik>
                            {success && <p className="edit-successful-msg">Ad edited succesfully</p>}
                        </div>
                    </div>
                );
            }
            else {
                return <div className="container"><div className="ad-form"><p className="error-msg">You do not have permissions to edit this ad</p></div></div>;
            }

        }
        else {
            if (!ad.id && adFetched) {
                return (
                    <div className="container">
                        <div className="ad-form"><p className="error-msg">This ad doesn't exist.</p>
                        </div>
                    </div>);
            }
            return null;

        }

    }
    else if (sessionInfo.logged === 0) {

        return <div className="container"><div className="ad-form"><p className="error-msg">You are not logged in.</p></div></div>;
    }
    else {
        return null;
    }
}


export default Edit;
