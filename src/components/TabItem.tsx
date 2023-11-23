import React from "react"

interface Props {
    song: string;
    onSelect: () => void;
    onDelete: () => void;
}

const TabItem: React.FC<Props> = ({ song, onSelect, onDelete}) => {
    return (
        <div className="tab-item">
            <button onClick={onSelect}>
                <span>
                    <a href="#">
                    {song}
                    </a>
                </span>
            </button>
            <button className="delete" onClick={onDelete}>
                ❌
            </button>
        </div>
    )
}

export default TabItem
