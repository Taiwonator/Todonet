
import React, { Component } from 'react'
import './ProfileStat.scss'

function ProfileStat(props) {
    return (
        <div className="profile-stat">
            <h3>{props.number}</h3>
            <p>{props.label}</p>
        </div>
    )
}

export default ProfileStat;