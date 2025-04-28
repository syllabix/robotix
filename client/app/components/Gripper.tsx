
type GripperProps = {
    position: [number, number, number]
}

const Gripper = ({position}: GripperProps) => (
    <group position={position}>
        {/* Base */}
        <mesh position={[0.1, 0, 0]}>
            <boxGeometry args={[0.18, 0.04, 0.08]} />
            <meshStandardMaterial color="yellow" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Fixed jaw */}
        <mesh position={[0.02, -0.06, 0]}>
            <boxGeometry args={[0.02, 0.08, 0.08]} />
            <meshStandardMaterial color="gray" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Movable jaw */}
        <mesh position={[0.18, -0.06, 0]}>
            <boxGeometry args={[0.02, 0.08, 0.08]} />
            <meshStandardMaterial color="gray" metalness={0.7} roughness={0.8} />
        </mesh>
    </group>
);

export default Gripper;