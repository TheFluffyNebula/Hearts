import React from 'react';

// React (Vite) Playing Card Component
const Card = ({ rank, suit }) => {
    return (
        <div className="card">
            <div className={`card-suit ${suit}`}>
                {suit}
            </div>
            <div className="card-rank">
                {rank}
            </div>
        </div>
    );
};

export default Card;
