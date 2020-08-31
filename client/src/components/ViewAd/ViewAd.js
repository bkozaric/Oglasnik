import React, { useState, useEffect, useContext, Fragment } from 'react';
import "./ViewAd.css";
import { LoggedContext } from '../../LoggedContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import Fade from 'react-reveal/Fade';


const ViewAd = (props) => {

    const [ad, setAd] = useState({
        id: null,
        title: "",
        description: "",
        price: 0,
        image: ""
    })

    const [success, setSuccess] = useState(null);
    const [adFetched, setAdFetched] = useState(false);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageList, setImageList] = useState([]);
    const sessionInfo = useContext(LoggedContext);

    const getAd = async () => {
        try {
            const response = await fetch("/api/ads/" + props.match.params.id);
            const adJson = await response.json();
            setAdFetched(true);
            if (!adJson.message) {
                setAd({ ...adJson[0], image: adJson.image[0].imageUrl });
                setImageList(adJson.image);
            }
        }
        catch (err) {
            console.error(err);
        }
    }

    const addToCart = async (adId) => {
        if (sessionInfo.logged === 1) {
            try {
                const body = { uId: sessionInfo.userId, adId: adId };
                await fetch("/api/cart/add/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }).then(answer => answer.json())
                    .then(data => {
                        setSuccess(data.success);
                    });
            }
            catch (err) {
                console.error(err);
            }
        }
    }

    const deleteAd = async (id) => {
        try {
            await fetch("/api/ads/delete/" + id, {
                method: "DELETE",
            }).then(answer => answer.json())
                .then(data => {
                    window.location.href = "/";
                });
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (imageList[currentImageIndex]) {
            setAd({ ...ad, image: imageList[currentImageIndex].imageUrl });
        }
    }, [currentImageIndex])

    const switchImage = direction => {
        if (direction === 1) {
            if (currentImageIndex + 1 >= imageList.length) {
                setCurrentImageIndex(0);
            }
            else {
                setCurrentImageIndex(prevVal => prevVal + 1);
            }
        }
        else if (direction === 0) {
            if (currentImageIndex - 1 < 0) {
                setCurrentImageIndex(imageList.length - 1);
            }
            else {
                setCurrentImageIndex(prevVal => prevVal - 1);
            }
        }
    }

    useEffect(() => {
        getAd();
    }, []);



    if (ad.id) {
        return (
            <Fade>
                <div className="container">
                    <div className="ad-view-container">
                        <h2>{ad.title}</h2>
                        <div className="ad-view-image-container">
                            <img alt="ad" className="ad-view-image" src={ad.image} />
                            {imageList.length > 1 ?
                                <Fragment>
                                    <div onClick={() => switchImage(0)} className="ad-view-image-previous"><FontAwesomeIcon icon={faChevronLeft} /></div>
                                    <div onClick={() => switchImage(1)} className="ad-view-image-next"><FontAwesomeIcon icon={faChevronRight} /></div>
                                </Fragment> : null}

                        </div>
                        <div className="ad-info-desc-price">
                            <p className="ad-desc">{ad.description}</p>
                            <div className="add-cart-container">
                                <p className="ad-view-price">{ad.price.toLocaleString("de")} kn</p>
                                <div>
                                    {sessionInfo.userId !== ad.addedBy ? null : <button onClick={() => deleteAd(ad.id)} className="view-form-delete-ad-button"><FontAwesomeIcon icon={faTrash} /></button>}
                                    {sessionInfo.userId !== ad.addedBy ? null : <a href={"/edit/" + ad.id}><button className="view-form-edit-ad-button"><FontAwesomeIcon icon={faPencilAlt} /></button></a>}
                                    {sessionInfo.userId === ad.addedBy ? null : sessionInfo.logged ? <button onClick={() => addToCart(ad.id)} className="add-cart-button"><FontAwesomeIcon icon={faCartArrowDown} /></button> : null}
                                </div>


                            </div>

                        </div>
                        {success && <p className="added-cart-msg">Added to cart</p>}

                    </div>
                </div>
            </Fade>
        );
    }
    if (!ad.id && adFetched) {
        return (
            <div className="container">
                <div className="ad-form">
                    <p className="error-msg">This ad doesn't exist</p>
                </div>
            </div>
        );
    }
    return null;


}

export default ViewAd;
