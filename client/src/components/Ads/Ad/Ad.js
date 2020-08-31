import React, { useState } from 'react';
import "./Ad.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons';


const Ad = (props) => {

    const [success, setSuccess] = useState(null)

    const deleteAd = async (id) => {
        try {
            await fetch("/api/ads/delete/" + id, {
                method: "DELETE",
            }).then(answer => answer.json())
                .then(data => {
                    setSuccess(data.success);
                });
        }
        catch (err) {
            console.error(err);
        }
        props.refreshComponent();
    }

    const addToCart = async (adId) => {
        try {
            const body = { uId: props.sessionInfo.userId, adId: adId };
            await fetch("/api/cart/add/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        }
        catch (err) {
            console.error(err);
        }
    }

    if (success === 1) {
        return (
            null
        );
    }
    else {
        return (
            <div className="ad">

                <div className="ad-img"><a href={"/view/" + props.id}><img alt="slika" src={props.image} /></a></div>
                <div className="ad-info">
                    <div className="ad-row title">
                        <a href={"/view/" + props.id}><h1 className="ad-title">{props.title}</h1></a>
                    </div>
                    <div className="ad-row info"><p className="ad-info">{props.desc}</p></div>
                    <div className="ad-row price"><p className="ad-price">Cijena: {props.price.toLocaleString("de")} kn</p></div>


                    {props.sessionInfo.logged ?
                        <>
                            {props.sessionInfo.userId === props.addedBy ?
                                <>
                                    <a href={"/edit/" + props.id}><button className="edit-ad-button"><FontAwesomeIcon icon={faPencilAlt} /></button></a>
                                    <button onClick={() => deleteAd(props.id)} className="delete-ad-button"><FontAwesomeIcon icon={faTrash} /></button>
                                </> : <button onClick={() => addToCart(props.id)} className="add-cart-btn"><FontAwesomeIcon icon={faCartArrowDown} /></button>}

                        </> : null}

                </div>
            </div>
        );
    }

}

export default Ad;
