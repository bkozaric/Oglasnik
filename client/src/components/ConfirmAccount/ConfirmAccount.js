import React, { useEffect, useState } from 'react'

const ConfirmAccount = (props) => {

    const [confirmationStatus, setConfirmationStatus] = useState({ success: null, message: null });

    const confirmBackend = async () => {
        const response = await fetch("/api/users/confirm/" + props.match.params.token)
        const responseJson = await response.json();
        setConfirmationStatus({
            success: responseJson.success, message: responseJson.message
        })
    }

    useEffect(() => {
        confirmBackend();
    }, [])

    if (confirmationStatus.success === 0) {
        return <div className="form"><p className="error-msg">{confirmationStatus.message}</p></div>
    }
    if (confirmationStatus.success === 1) {
        return <div className="form"><p className="success-msg">{confirmationStatus.message}</p></div>
    }
    return null;
}

export default ConfirmAccount
