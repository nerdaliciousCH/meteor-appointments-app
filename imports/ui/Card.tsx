import React from 'react';

type Props = {
    children: React.ReactNode,
    title: string
}

export const Card = ({children, title}: Props) => {
    return (
        <div className='card-container'>
            <div className='card-header'>
                <h3>{title}</h3>
            </div>
            {children}
        </div>
    )
}