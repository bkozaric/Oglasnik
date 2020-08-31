import React, { useState, useEffect, useContext } from 'react';
import { LoggedContext } from '../../LoggedContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import "./Profile.css";

import TabPicker from "./TabPicker";
import PickedTab from './PickedTab';
import OrderPreview from './OrderPreview';

const Profile = (props) => {

    const sessionInfo = useContext(LoggedContext);
    const [currentTab, setCurrentTab] = useState(props.match.params.oid ? 1 : 0);

    const [userInfo, setuserInfo] = useState({});

    const [adsFetched, setAdsFetched] = useState(false);

    const [ads, setAds] = useState([]);
    const [currentProfileAction, setCurrentProfileAction] = useState(null);

    const [orders, setOrders] = useState([]);
    const [ordersFetched, setOrdersFetched] = useState(null);
    const [orderInfo, setOrderInfo] = useState(null);

    const [serverMessage, setServerMessage] = useState(null);
    const [userChangeMessage, setUserChangeMessage] = useState(null);

    const [previewOrderId, setPreviewOrderId] = useState(null);


    const getAds = async () => {
        try {
            const response = await fetch("/api/ads/");
            const adsJson = await response.json();
            setAdsFetched(true);
            setAds(adsJson);
        }
        catch (err) {
            console.error(err);
        }
    }

    const getUserInfo = async () => {
        try {
            const response = await fetch("/api/users/userinfo");
            const userInfoJson = await response.json();
            if (userInfoJson[0]) {
                setuserInfo(userInfoJson[0]);
            }
            //console.log(userInfoJson);
        }
        catch (err) {
            console.error(err);
        }
    }

    const deleteAd = async (id) => {
        try {
            await fetch("/api/ads/delete/" + id, {
                method: "DELETE",
            }).then(answer => answer.json())
                .then(() => {
                    window.location.reload();
                });
        }
        catch (err) {
            console.error(err);
        }
    }

    const deleteAccount = async (id) => {
        try {
            await fetch("/api/users/delete/" + id, {
                method: "DELETE",
            }).then(answer => answer.json())
                .then(() => {
                    window.location.href = "/";
                });
        }
        catch (err) {
            console.error(err);
        }
    }

    const changePersonalInfo = async (values) => {
        setUserChangeMessage(null);
        try {
            const body = values;
            await fetch("/api/users/changeinfo/", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            }).then(answer => answer.json())
                .then(data => {
                    if (data.success === 1) {
                        setUserChangeMessage(true);
                    }
                });
        }
        catch (err) {
            console.error(err);
        }
    }

    const changePassword = async (values) => {
        setServerMessage(null);
        try {
            const body = {
                username: sessionInfo.username,
                newPassword: values.newPassword,
                oldPassword: values.oldPassword
            };
            await fetch("/api/users/password/" + sessionInfo.userId, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            }).then(answer => answer.json())
                .then(data => {
                    if (data.message === 1) {

                        window.location.href = "/login";
                    }
                    else {
                        setServerMessage(data.message);
                    }

                });
        }
        catch (err) {
            console.error(err);
        }

    }

    const getOrders = async () => {
        try {
            const response = await fetch("/api/orders/");
            const ordersJson = await response.json();
            setOrdersFetched(true);
            setOrders(ordersJson);

        }
        catch (err) {
            console.error(err);
        }
    }


    const showOrder = async (oid) => {
        await getOrderInfo(oid);
        setPreviewOrderId(oid);
    }


    const getOrderInfo = async (oid) => {
        setOrderInfo(orders.filter((order) => (order.orderId === oid))[0].orderInfo);
    }

    const cancelOrder = async (oid) => {
        //console.log(`canceling order ... ${oid}`);
        try {
            const results = await fetch(`/api/orders/cancel/${oid}&${sessionInfo.userId}`, { method: "DELETE" });
            await getOrders();
        }
        catch (err) {
            console.log(err);
        }
    }



    useEffect(() => {
        getAds();
        getOrders();
        getUserInfo();
    }, []);

    useEffect(() => {
        if (orders.length > 0) {
            if (props.match.params.oid) {
                if (orders.filter(order => order.orderId === props.match.params.oid).length > 0) {
                    showOrder(props.match.params.oid);
                }
            }
        }

    }, [orders])

    const changeTab = (tabId) => {
        setCurrentTab(tabId);
        setCurrentProfileAction(null);
        setPreviewOrderId(null);
    }



    if (sessionInfo.logged === 1) {
        if (currentTab === 0) {
            if (ads.filter((ad) => ad.addedBy === sessionInfo.userId).length === 0) {
                if (adsFetched) {
                    return (
                        <div className="container">
                            <TabPicker currentTab={currentTab} changeTab={changeTab} />
                            <div className="picked-tab">
                                <h2>You haven't created any ads yet</h2>
                            </div>
                        </div>
                    );
                }
                else {
                    return null;
                }
            }
            return (
                <div className="container">
                    <TabPicker currentTab={currentTab} changeTab={changeTab} />
                    <div className="picked-tab">
                        <table>
                            <tbody>
                                {ads.map((ad) => (ad.addedBy === sessionInfo.userId ? <tr key={ad.id}>
                                    <td className="td-image"><a href={"/view/" + ad.id}><img alt="ad" className="cart-image" src={ad.image} /></a></td>
                                    <td className="td-title"><a href={"/view/" + ad.id}>{ad.title}</a></td>
                                    <td className="td-price">
                                        {ad.price.toLocaleString("de")} kn
                                    </td>
                                    <td className="td-buttons">
                                        <div className="profile-ads-view-buttons">
                                            <a href={"/edit/" + ad.id}><button className="profile-edit-ad-button"><FontAwesomeIcon icon={faPencilAlt} /></button></a>
                                            <button onClick={() => deleteAd(ad.id)} className="profile-delete-ad-button"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                    </td>
                                </tr> : null))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }
        if (currentTab === 1) {
            if (orders.length === 0) {
                if (ordersFetched === true) {
                    return (
                        <div className="container">
                            <TabPicker currentTab={currentTab} changeTab={changeTab} />
                            <div className="picked-tab">
                                <h2>You haven't made any orders yet</h2>
                            </div>
                        </div>
                    )
                }
                else {
                    return null;
                }
            }
            if (orders.length > 0) {
                return (
                    <div className="container">
                        <TabPicker currentTab={currentTab} changeTab={changeTab} />
                        <div className="picked-tab">
                            <div className="order-tab">
                                <div className="order-buttons">
                                    {orders.map((order) => <button key={order.orderId} className={previewOrderId === order.orderId ? "order-pick-button highlight-button" : "order-pick-button"} onClick={() => showOrder(order.orderId)}>{order.orderId} {previewOrderId === order.orderId ? <FontAwesomeIcon icon={faArrowRight} /> : null}</button>)}
                                </div>
                                <OrderPreview cancelOrder={cancelOrder} orderInfo={orderInfo} oid={previewOrderId} />
                            </div>

                        </div>
                    </div>
                )
            }
            return null;
        }
        if (currentTab === 2) {

            return (
                <div className="container">
                    <TabPicker currentTab={currentTab} changeTab={changeTab} />
                    <PickedTab
                        userChangeMessage={userChangeMessage}
                        changePersonalInfo={changePersonalInfo}
                        userInfo={userInfo}
                        setCurrentProfileAction={setCurrentProfileAction}
                        deleteAccount={deleteAccount}
                        sessionInfo={sessionInfo}
                        currentProfileAction={currentProfileAction}
                        changePassword={changePassword}
                        serverMessage={serverMessage}
                    />

                </div>
            )
        }
    }
    else if (sessionInfo.logged === 0) {
        return (
            <div className="container">
                <div className="ad-view-container">
                    <p className="error-msg">You are not logged in</p>
                </div>
            </div>
        );
    }
    else {
        return null;
    }


}

export default Profile;
