
type GripperProps = {
    position: [number, number, number]
    width: number,
    length: number,
    thickness: number,
}

const Gripper = ({position, length, width, thickness}: GripperProps) => (
    <group position={position}>
        {/* Base */}
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[length, thickness, width]} />
            <meshStandardMaterial color="yellow" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Fixed jaw */}
        <mesh position={[-(length / 2 - 0.01), -(thickness + 0.015), 0]}>
            <boxGeometry args={[0.02, 0.08, 0.08]} />
            <meshStandardMaterial color="gray" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Movable jaw */}
        <mesh position={[(length / 2 - 0.01), -(thickness + 0.015), 0]}>
            <boxGeometry args={[0.02, 0.08, 0.08]} />
            <meshStandardMaterial color="gray" metalness={0.7} roughness={0.3} />
        </mesh>
    </group>
);

export default Gripper;