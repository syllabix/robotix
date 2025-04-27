import { FC } from 'react';
import CraneVisualization from '../../components/CraneVisualization';
import Robot from '@/app/components/Robot';

interface RobotPageProps {
    params: {
        id: string;
    };
}

const RobotPage: FC<RobotPageProps> = async ({ params }) => {
    // Initial state values (todo: replace these with WebSocket data later)
    const initialState = {
        swingDeg: 0,
        liftMm: 1000,
        elbowDeg: 0,
        wristDeg: 0,
        gripperMm: 100,
    };

    const { id } = await params;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-4xl font-bold mb-8">Robot ID: {id}</h1>
            <div className="w-full max-w-4x h-[600px]">
                <CraneVisualization {...initialState} />
                {/* <Robot /> */}
            </div>
        </div>
    );
};

export default RobotPage;