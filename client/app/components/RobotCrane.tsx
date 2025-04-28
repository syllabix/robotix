'use client';

import { FC, useRef } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { useCraneState } from '@/app/hooks/useCraneState';
import TrussArm from '@/app/components/TrussArm';
import TrussColumn from '@/app/components/TrussColumn';
import Joint from './Joint';
import Gripper from './Gripper';

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
            <ambientLight intensity={2.0} />
            <spotLight position={[5, 10, 5]} angle={0.3} penumbra={0.5} intensity={2.5} castShadow />
            <pointLight position={[0, 2, 0]} intensity={1.5} />

            <group position={[-0.2, -1, 0]} rotation={[0, swingRads, 0]}>
                {/* Base */}
                <mesh rotation={[0, swingRads, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[0.35, 0.5, 0.25, 32]} />
                    <meshStandardMaterial color="lightgray" metalness={0.8} roughness={0.3} />
                </mesh>
                <Joint position={[0, 0.13, 0]} color="#444" radius={0.13} height={0.08} />
                <TrussColumn height={2} />

                {/* Arm Group - positioned at column edge */}
                <group position={[0.1, liftMm / 1000, 0]} rotation={[0, 0, 0]}>
                    {/* Elbow joint */}
                    <Joint position={[-0.1, 0, 0]} color="red" />
                    {/* Truss Arm */}
                    <TrussArm position={[0.02, -0.02, 0]} width={0.18} length={1.0} color="#aaa" />

                    {/* Elbow Group - positioned at arm end */}
                    <group position={[0.92, -0.034, 0]} rotation={[0, elbowRads, 0]}>
                        {/* Elbow joint */}
                        <Joint position={[0, 0, 0]} height={0.05} color="red" />
                        <group position={[-0.1, -0.054, 0]}>
                            {/* Forearm */}
                            <TrussArm length={0.5} width={0.12} thickness={0.03} color="#888" />

                            {/* Gripper Group - positioned at wrist end */}
                            <group position={[0.44, -0.01, 0]} rotation={[0, wristRads, 0]}>
                                {/* Wrist joint */}
                                <Joint position={[0, 0, 0]} color="red" radius={0.07} height={0.02} />
                                {/* Gripper */}
                                <Gripper position={[0, -0.03, 0]} />
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </>
    );
}

const RobotCrane: FC<RobotCraneProps> = (props) => {
    const { state, updateState } = useCraneState(props);

    return (
        <Canvas camera={{ position: [2, 1, 3], fov: 50 }}>
            <CraneModel {...state} updateState={updateState} />
            <OrbitControls />
        </Canvas>
    );
};

export default RobotCrane;