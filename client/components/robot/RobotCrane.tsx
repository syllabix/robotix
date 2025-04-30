'use client';

import { FC } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { useCraneState } from '@/hooks/useCraneState';
import TrussArm from '@/components/robot/TrussArm';
import TrussColumn from '@/components/robot/TrussColumn';
import Joint from './Joint';
import Gripper from './Gripper';
import Base from './Base';
import { CraneDimensions, CraneState } from '@/types/crane';

type RobotCraneProps = {
    swingDeg: number;
    liftMm: number;
    elbowDeg: number;
    wristDeg: number;
    gripperMm: number;
}

type CraneModelProps = {
    state: CraneState,
    dimensions: CraneDimensions
}

const CraneModel = ({ state, dimensions, updateState }: CraneModelProps & { updateState: (time: number) => void }) => {
    const swingRads = state.swingDeg * (Math.PI / 180);
    const elbowRads = state.elbowDeg * (Math.PI / 180);
    const wristRads = state.wristDeg * (Math.PI / 180);
    const liftMm = state.liftMm;

    useFrame((state, delta) => {
        updateState(state.clock.elapsedTime * 1000);
    });

    return (
        <>
            <Base height={dimensions.baseHeight} radius={{ bottom: dimensions.baseRadiusBottom, top: dimensions.baseRadiusTop }} metalness={0.8} />

            {/* Column Group - positioned at x origin and flush with the top of the base */}
            <group position={[0, dimensions.baseHeight / 2, 0]} rotation={[0, swingRads, 0]}>
                <Joint color="#444" radius={dimensions.columnWidth} height={dimensions.liftJointHeight} />
                <TrussColumn position={[0, dimensions.liftJointHeight / 2, 0]} width={dimensions.columnWidth} height={dimensions.columnHeight} />

                {/* Arm Group - positioned at column edge todo: red joint needs radius */}
                <group position={[0, liftMm / 1000, 0]}>
                    <Joint color="red" height={dimensions.liftJointHeight} />
                    <TrussArm
                        position={[dimensions.columnWidth / 2, (dimensions.liftJointHeight / 2) - (dimensions.upperArmThickness * 2), 0]}
                        thickness={dimensions.upperArmThickness}
                        width={dimensions.upperArmWidth}
                        length={dimensions.upperArmLength}
                        color="#aaa" />

                    {/* Elbow Group - positioned at arm end */}
                    <group position={[dimensions.upperArmLength, -(dimensions.upperArmThickness), 0]} rotation={[0, elbowRads, 0]}>
                        {/* Elbow joint */}
                        <Joint radius={dimensions.elbowJointRadius} height={dimensions.elbowJointHeight} color="red" />
                        {/* Forearm */}
                        <TrussArm
                            position={[0, -(dimensions.elbowJointHeight / 2), 0]}
                            length={dimensions.lowerArmLength}
                            width={dimensions.lowerArmWidth}
                            thickness={dimensions.lowerArmThickness}
                            color="#888" />

                        <group position={[0, -(dimensions.elbowJointHeight / 2), 0]}>
                            {/* Wrist joint */}
                            <Joint
                                position={[dimensions.lowerArmLength, 0, 0]}
                                radius={dimensions.wristJointRadius}
                                height={dimensions.wristJointHeight}
                                color="red" />
                            {/* Gripper Group - positioned at wrist end */}
                            <group position={[dimensions.lowerArmLength, 0, 0]} rotation={[0, wristRads, 0]}>

                                {/* Gripper */}
                                <Gripper
                                    position={[dimensions.gripperLength / 2, -(dimensions.wristJointHeight * 2), 0]}
                                    length={dimensions.gripperLength}
                                    width={dimensions.gripperWidth}
                                    thickness={dimensions.gripperThickness} />
                            </group>
                        </group>
                    </group>
                </group>
            </group>
        </>
    );
}

const RobotCrane: FC<{ dimensions: CraneDimensions }> = ({ dimensions }) => {
    const { state, updateState } = useCraneState();

    // Calculate camera position based on crane dimensions
    const totalHeight = dimensions.baseHeight + dimensions.columnHeight + dimensions.liftJointHeight;
    const maxArmReach = dimensions.upperArmLength + dimensions.lowerArmLength;
    const cameraDistance = Math.max(totalHeight * 0.8, maxArmReach * 1.2);
    const cameraHeight = totalHeight * 0.7;

    return (
        <Canvas camera={{ position: [cameraDistance, cameraHeight, cameraDistance], fov: 75 }}>
            <ambientLight intensity={2.0} />
            <spotLight position={[0, totalHeight, 0]} intensity={1.5} castShadow />
            <pointLight position={[0.1, totalHeight, 0]} intensity={0.05} castShadow />

            <CraneModel state={state} dimensions={dimensions} updateState={updateState} />

            <OrbitControls target={[0, totalHeight * 0.5, 0]} />
        </Canvas>
    );
};

export default RobotCrane;