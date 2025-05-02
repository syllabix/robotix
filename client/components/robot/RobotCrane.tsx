'use client';

import { FC } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { useCraneState } from '@/hooks/useCraneState';
import TrussArm from '@/components/robot/TrussArm';
import TrussColumn from '@/components/robot/TrussColumn';
import Joint from '@/components/robot/Joint';
import Gripper from '@/components/robot/Gripper';
import Base from '@/components/robot/Base';
import { CraneDimensions, CraneState } from '@/types/crane';

type CraneModelProps = {
    state: CraneState,
    dimensions: CraneDimensions
}

const CraneModel = ({ state, dimensions, updateState }: CraneModelProps & { updateState: (time: number) => void }) => {

    const elbowGroupX = (dimensions.upperArmLength + (dimensions.columnWidth / 2) + (dimensions.columnThickness / 2)) - dimensions.elbowJointRadius;
    const wristGroupX = (dimensions.lowerArmLength) - dimensions.wristJointRadius;
    const forearmY = -((dimensions.elbowJointHeight / 2) + (dimensions.lowerArmThickness));

    const swingRads = state.swingDeg * (Math.PI / 180);
    const elbowRads = state.elbowDeg * (Math.PI / 180);
    const wristRads = state.wristDeg * (Math.PI / 180);
    const liftMm = state.liftMm;

    useFrame((state, delta) => {
        updateState(state.clock.elapsedTime * 1000);
    });

    return (
        <>
            <Base
                height={dimensions.baseHeight}
                radius={{ bottom: dimensions.baseRadiusBottom, top: dimensions.baseRadiusTop }}
                metalness={0.8} />

            {/* Column Group - positioned at x origin and flush with the top of the base */}
            <group position={[0, dimensions.baseHeight, 0]} rotation={[0, swingRads, 0]}>
                <Joint color="#444" radius={dimensions.columnWidth} height={dimensions.swingJointHeight} />
                <TrussColumn
                    position={[0, 0, 0]}
                    width={dimensions.columnWidth}
                    height={dimensions.columnHeight}
                    thickness={dimensions.columnThickness}
                />

                {/* Arm Group - positioned at column edge */}
                <group position={[0, liftMm / 1000, 0]}>
                    {/* Lift Join: assuming always centered with the thickness of the upper arm */}
                    <Joint
                        position={[0, dimensions.upperArmThickness / 2, 0]}
                        radius={dimensions.liftJointRadius}
                        height={dimensions.liftJointHeight}
                        color="red"
                    />

                    {/* Upper Arm Join */}
                    <TrussArm
                        position={[(dimensions.columnWidth / 2) + (dimensions.columnThickness / 2), 0, 0]}
                        thickness={dimensions.upperArmThickness}
                        width={dimensions.upperArmWidth}
                        length={dimensions.upperArmLength}
                        color="#aaa" />

                    {/* Elbow Group - positioned at upper arm end */}
                    <group position={[elbowGroupX, -(dimensions.elbowJointHeight / 2), 0]} rotation={[0, elbowRads, 0]}>
                        {/* Elbow joint */}
                        <Joint
                            position={[0, 0, 0]}
                            radius={dimensions.elbowJointRadius}
                            height={dimensions.elbowJointHeight}
                            color="red"
                        />
                        {/* Forearm */}
                        <TrussArm
                            position={[0, forearmY, 0]}
                            length={dimensions.lowerArmLength}
                            width={dimensions.lowerArmWidth}
                            thickness={dimensions.lowerArmThickness}
                            color="#888" />

                        {/* Wrist group - positioned at the end of the forearm */}
                        <group position={[wristGroupX, forearmY - (dimensions.wristJointHeight / 2), 0]} rotation={[0, wristRads, 0]}>
                            <Joint
                                position={[0, 0, 0]}
                                radius={dimensions.wristJointRadius}
                                height={dimensions.wristJointHeight}
                                color="red" />

                            <group position={[(dimensions.wristJointRadius / 2) + (dimensions.gripperLength / 2) - dimensions.gripperThickness, -((dimensions.wristJointHeight / 2) + (dimensions.gripperThickness / 2)), 0]}>
                                <Gripper
                                    position={[0, 0, 0]}
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
    const totalHeight = dimensions.baseHeight + dimensions.columnHeight;
    const maxArmReach = dimensions.upperArmLength + dimensions.lowerArmLength;
    const cameraDistance = Math.max(totalHeight, maxArmReach);
    const cameraHeight = totalHeight;

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