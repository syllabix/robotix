import { FC } from 'react';
import { GridHelper } from 'three';

type Props = {
    size?: number;
    divisions?: number;
    color?: string;
    opacity?: number;
};

const Grid: FC<Props> = ({
    size = 10,
    divisions = 10,
    color = '#888888',
    opacity = 0.2,
}) => {
    return (
        <gridHelper
            args={[size, divisions, color, color]}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            material-transparent
            material-opacity={opacity}
        />
    );
};

export default Grid; 