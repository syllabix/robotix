
type TrussArmProps = {
    position?: [number, number, number],
    length: number,
    thickness?: number,
    width?: number,
    color?: string
}

const TrussArm = ({ position = [0, 0, 0], length, thickness = 0.05, width = 0.15, color = 'gray' }: TrussArmProps) => (
    <group position={position}>
        {/* Main beams */}
        <mesh position={[length / 2, thickness / 2, width / 2]}>
            <boxGeometry args={[length, thickness, thickness]} />
            <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[length / 2, thickness / 2, -width / 2]}>
            <boxGeometry args={[length, thickness, thickness]} />
            <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Cross beams */}
        {[...Array(Math.floor(length / 0.2)).keys()].map(i => (
            <mesh key={i} position={[i * 0.2 + 0.1, thickness / 2, 0]} rotation={[0, Math.PI / 4, 0]}>
                <boxGeometry args={[width + 0.07, thickness / 2, thickness]} />
                <meshStandardMaterial color={color} metalness={0.5} roughness={0.8} />
            </mesh>
        ))}
    </group>
);

export default TrussArm;