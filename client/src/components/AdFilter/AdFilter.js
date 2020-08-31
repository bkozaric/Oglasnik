import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import "./AdFilter.css";

const AdFilter = (props) => {
    return (
        <div className="ad-filter-container">
            <div>
                <input placeholder="Search..." onChange={(e) => props.filterList(e.target.value)} className="ad-filter-input" />
                <p><FontAwesomeIcon icon={faSearch} /></p>
            </div>
        </div>
    )
}

export default AdFilter
