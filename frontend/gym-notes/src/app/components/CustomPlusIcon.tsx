'use client'

import { useState } from "react";

type iconProps = {
    onClick?: React.MouseEventHandler<HTMLElement>
}

function CustomPlusIcon({ onClick } : iconProps) {

    const [ hovered, setHovered ] = useState(false);

    return (
        <div style={{
            width: '54px',
            height: '54px',
            position: 'relative',
            transition: '0.3s',
            cursor: 'pointer',
            backgroundColor: hovered ? 'white' : 'green',
            border: ('2px solid ' + (hovered ? 'green' : 'white'))
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
        >
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transition: '0.3s',
                backgroundColor: hovered ? 'green' : 'white',
                clipPath: 'polygon(45% 20%, 55% 20%, 55% 45%, 80% 45%, 80% 55%, 55% 55%, 55% 80%, 45% 80%, 45% 55%, 20% 55%, 20% 45%, 45% 45%)',
                }}
            ></div>
        </div>
    );
}

export default CustomPlusIcon;