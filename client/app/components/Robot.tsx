'use client';

import { FC } from 'react';
import { Canvas } from "@react-three/fiber";

const Robot: FC<{}> = () => (
    <Canvas>
        <spotLight position={[0, 1, 0]}  />
        
        <mesh rotation={[0.5, 0.4, 0.2]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial />
        </mesh>
    </Canvas>
);

export default Robot;