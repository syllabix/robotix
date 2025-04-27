'use client';

import { FC, useRef } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { useCraneState } from '@/app/hooks/useCraneState';

type RobotCraneProps = {
    swingDeg: number;
    liftMm: number;
    elbowDeg: number;
    wristDeg: number;
    gripperMm: number;
}

function CraneModel({ swingDeg, liftMm, elbowDeg, wristDeg, gripperMm, updateState }: RobotCraneProps & { updateState: (time: number) => void }) {
    const swingRads = swingDeg * (Math.PI / 180);
    const elbowRads = elbowDeg * (Math.PI / 180);
    const wristRads = wristDeg * (Math.PI / 180);

    useFrame((state, delta) => {
        updateState(state.clock.elapsedTime * 1000);
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 1.2, 0]} />

            {/* Base */}
            <mesh rotation={[0, swingRads, 0]}>
                <cylinderGeometry args={[0.25, 0.5, 0.2, 32]} />
                <meshStandardMaterial color="lightgray" />
            </mesh>

            {/* Column */}
            <mesh position={[0, 1, 0]} rotation={[0, swingRads, 0]}>
                <boxGeometry args={[0.2, 2, 0.2]} />
                <meshStandardMaterial color="blue" />
            </mesh>

            {/* Arm Group - positioned at column edge */}
            <group position={[0, liftMm / 1000, 0]} rotation={[0, swingRads, 0]}>
                {/* Arm */}
                <mesh position={[0.4, 0, 0]}>
                    <boxGeometry args={[0.6, 0.2, 0.2]} />
                    <meshStandardMaterial color="red" />
                </mesh>

                {/* Wrist Group - positioned at arm end */}
                <group position={[0.6, -0.2, 0]} rotation={[0, elbowRads, 0]}>
                    {/* Wrist */}
                    <mesh position={[0.25, 0, 0]}>
                        <boxGeometry args={[0.5, 0.1, 0.1]} />
                        <meshStandardMaterial color="green" />
                    </mesh>

                    {/* Gripper Group - positioned at wrist end */}
                    <group position={[0.5, -0.15, 0]} rotation={[0, wristRads, 0]}>
                        {/* Gripper */}
                        <mesh>
                            <boxGeometry args={[0.2, 0.1, gripperMm / 1000]} />
                            <meshStandardMaterial color="yellow" />
                        </mesh>
                    </group>
                </group>
            </group>
        </>
    );
}

const RobotCrane: FC<RobotCraneProps> = (props) => {
    const { state, updateState } = useCraneState(props);

    return (
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
            <CraneModel {...state} updateState={updateState} />
            <OrbitControls />
        </Canvas>
    );
};

export default RobotCrane;