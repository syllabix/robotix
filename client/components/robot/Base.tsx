import { FC } from 'react';
import { CraneDimensions } from '@/types/crane';

type BaseProps = {
    height: number,
    radius: { bottom: number, top: number },
    color?: string,
    metalness?: number,
    roughness?: number,
};

const Base: FC<BaseProps> = ({ height, radius, color = "lightgray", metalness = 0.6, roughness = 0.34 }) => {
    return (
        <mesh castShadow receiveShadow>
            <cylinderGeometry args={[radius.top, radius.bottom, height]} />
            <meshStandardMaterial color="lightgray" metalness={metalness} roughness={roughness} />
        </mesh>
    );
};

export default Base; 