import React, { useContext, useState, useEffect } from 'react';
import { LoggedContext } from '../../LoggedContext';
import "./Cart.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {

    const sessionInfo = useContext(LoggedContext);

    const [cart, setCart] = useState([]);
    const [cartEmpty, setCartEmpty] = useState(null)
    const [totalPrice, settotalPrice] = useState(0)
    const [backendMsg, setBackendMsg] = useState(null)
    const [orderComplete, setOrderComplete] = useState(null);


    const getCart = async () => {
        try {
            const response = await fetch("/api/cart");
            const cartJson = await response.json();

            if (!cartJson.message) {
                setCartEmpty(cartJson.cartList.length === 0);
                setCart(cartJson.cartList);
                settotalPrice(cartJson.total[0].total);
            }
            else {
                setBackendMsg(cartJson.message);
            }
        }
        catch (err) {
            console.error(err);
        }
    }
    const emptyCart = async (id) => {
        try {
            await fetch("/api/cart/clear/" + id, {
                method: "DELETE",
            }).then(answer => answer.json())
                .then(data => {
                    window.location.href = "/cart/" + id;
                });
        }
        catch (err) {
            console.error(err);
        }
    }

    const removeFromCart = async (ix, itemId) => {
        try {
            await fetch(`/api/cart/delete/${sessionInfo.userId}&${itemId}`, {
                method: "DELETE",
            }).then(answer => answer.json())
                .then(data => {
                    //window.location.href = "/cart/" + id;
                });
        }
        catch (err) {
            console.error(err);
        }
        let newCartList = cart;
        cart.splice(ix, 1);
        setCart(newCartList);
        let newTotalPrice = 0;
        newCartList.forEach((ci) => newTotalPrice += ci.price);
        setCartEmpty(newCartList.length === 0);
        settotalPrice(newTotalPrice);
    }

    const completeOrder = async () => {
        try {
            await fetch("/api/cart/order/", { method: "POST" }).then(answer => answer.json())
                .then(data => {
                    console.log(data);
                    if (data.success > 0) {
                        setCartEmpty(true);
                        setOrderComplete(data.oid);
                    }
                });
        }
        catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getCart();
    }, [])

    if (backendMsg) {
        return (
            <div className="container">
                <div className="ad-view-container">
                    <p className="error-msg">{backendMsg}</p>
                </div>
            </div>
        );
    }

    if (sessionInfo.logged === 1) {
        if (cartEmpty === true) {
            if (orderComplete) {
                return (<div className="container">
                    <div className="cart-container">
                        <div className="cart-row">
                            <h2 className="cart-username-empty">Order number {orderComplete} completed succesfully. You can preview the order <a href={`/profile/order/${orderComplete}`}>here.</a></h2>
                        </div>
                    </div>
                </div>)
            }
            return (
                <div className="container">
                    <div className="cart-container">
                        <div className="cart-row">
                            <h2 className="cart-username-empty">Oh no! It seems your cart is empty.</h2>
                        </div>
                    </div>
                </div>
            );
        }
        else if (cartEmpty === false) {
            if (cart[0]) {
                if (cart[0].userId === sessionInfo.userId) {
                    return (
                        <div className="container">
                            <div className="cart-container">
                                <div className="cart-row">
                                    <h2 className="cart-username">{sessionInfo.username}'s Cart</h2>
                                </div>
                                <div className="cart-row table">
                                    <table>
                                        <tbody>
                                            {cart.map((ad) => <tr key={ad.key}>
                                                <td className="td-image"><a href={"/view/" + ad.id}><img alt="ad" className="cart-image" src={ad.image} /></a></td>
                                                <td className="td-title"><a href={"/view/" + ad.id}>{ad.title}</a></td>
                                                <td className="td-amount">{ad.amount}x</td>
                                                <td className="td-price">{ad.price.toLocaleString("de")} kn</td>
                                                <td className="td-total-price">{(ad.amount * ad.price).toLocaleString("de")} kn <div className="cart-buttons"><FontAwesomeIcon key={ad.id} onClick={() => removeFromCart(cart.indexOf(ad), ad.id)} icon={faTimes} /></div></td>
                                            </tr>)}
                                        </tbody>

                                    </table>
                                </div>
                                <div className="cart-row buttons">
                                    <h2 className="cart-total"><span className="cart-total-span">TOTAL:</span> {totalPrice.toLocaleString("de")} kn</h2>
                                    <div>
                                        <button onClick={() => emptyCart(sessionInfo.userId)} className="clear-cart-button"><FontAwesomeIcon icon={faBan} /> Empty Cart</button>
                                        <button onClick={() => completeOrder()} className="complete-order-button"><FontAwesomeIcon icon={faCheck} /> Complete Order</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                else {
                    return (
                        <div className="container">
                            <div className="ad-view-container">
                                <p className="error-msg">You do not have permissions to view this cart</p>
                            </div>
                        </div>
                    );
                }
            }
            else {
                return null;
            }


        }
        else {
            return null;
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

export default Cart;