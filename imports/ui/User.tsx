import React from 'react';
import { Meteor } from "meteor/meteor";
import { useTracker } from 'meteor/react-meteor-data';

export const User = () => {
    const user = useTracker(() => Meteor.user());
    const logout = () => Meteor.logout();

    return (
        <div className='card-container'>
            <div className='user-info'>
                <span>User: {user.username}</span>
                <button className="btn-base btn-primary" onClick={logout}>Logout</button>
            </div>
        </div>
    )   
}