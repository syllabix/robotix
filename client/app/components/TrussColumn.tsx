

type TrussColumnProps = {
    height: number,
    thickness?: number,
    width?: number,
    color?: string,
    metalness?: number,
    roughness?: number,
};

const TrussColumn = ({ height, thickness = 0.06, width = 0.18, color = '#b0b8c1', metalness = 0.85, roughness = 1 }: TrussColumnProps) => (
    <group>
        {/* Main vertical beams */}
        <mesh position={[-width / 2, height / 2, -width / 2]}>
            <boxGeometry args={[thickness, height, thickness]} />
            <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>
        <mesh position={[width / 2, height / 2, -width / 2]}>
            <boxGeometry args={[thickness, height, thickness]} />
            <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>
        <mesh position={[-width / 2, height / 2, width / 2]}>
            <boxGeometry args={[thickness, height, thickness]} />
            <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>
        <mesh position={[width / 2, height / 2, width / 2]}>
            <boxGeometry args={[thickness, height, thickness]} />
            <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>
        {/* Horizontal cross beams (top and bottom) */}
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[width + thickness, thickness, width + thickness]} />
            <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>
        <mesh position={[0, height, 0]}>
            <boxGeometry args={[width + thickness, thickness, width + thickness]} />
            <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
        </mesh>
        {/* Diagonal cross beams */}
        {[...Array(Math.floor(height / 0.28)).keys()].map(i => (
            <mesh key={i} position={[0, i * 0.3 + 0.1, 0.1]} rotation={[0, 0, 35 * (Math.PI / 180)]}>
                <boxGeometry args={[width * 1.4, thickness / 2, thickness / 2]} />
                <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
            </mesh>
        ))}

        {[...Array(Math.floor(height / 0.28)).keys()].map(i => (
            <mesh key={i} position={[0, i * 0.3 + 0.1, -0.1]} rotation={[0, 0, 35 * (Math.PI / 180)]}>
                <boxGeometry args={[width * 1.4, thickness / 2, thickness / 2]} />
                <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
            </mesh>
        ))}
    </group>
);

export default TrussColumn;