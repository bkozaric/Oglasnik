import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';


import "./Profile.css";


const OrderPreview = (props) => {

    const [creationTime, setCreationTime] = useState(0);

    const getCreationTime = (oid) => {
        if (oid) {
            let d = new Date(0);
            d.setMilliseconds(parseInt(oid));
            setCreationTime(d.toLocaleString("de"));
        }
    }


    useEffect(() => {
        getCreationTime(props.oid);
    })

    if (props.oid) {
        return (
            <div className="selected-order-preview">
                <p className="order-id-date">Previewing order number: <b>{props.oid}</b> created: {creationTime}</p>
                <table className="order-list-table">
                    <tbody>
                        {props.orderInfo.map((ad) => <tr key={ad.id}>
                            <td className="td-image"><a href={"/view/" + ad.id}><img alt="ad" className="cart-image" src={ad.image} /></a></td>
                            <td className="td-title"><a href={"/view/" + ad.id}>{ad.title}</a></td>
                            <td className="td-amount">{ad.amount}x</td>
                            <td className="td-price">{ad.price.toLocaleString("de")} kn</td>
                            <td className="td-total-price">{(ad.amount * ad.price).toLocaleString("de")} kn</td>
                        </tr>)}
                    </tbody>
                </table>
                <div className="cancel-order-container">
                    <button onClick={() => props.cancelOrder(props.oid)} className="cancel-order-button"><FontAwesomeIcon icon={faBan}/> Cancel Order</button>
                </div>
            </div>
        );
    }
    return (
        <div className="selected-order-preview">
            <p className="order-id-date">Please pick an order you wish to preview in the menu on the left.</p>
        </div>
    );

}


export default OrderPreview;
