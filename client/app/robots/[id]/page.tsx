import { FC } from 'react';
import RobotCrane from '@/app/components/RobotCrane';

interface PageProps {
    params: {
        id: string;
    };
}

const RobotPage: FC<PageProps> = async ({ params }) => {
    // Initial state values (todo: replace these with WebSocket data later)
    const initialState = {
        swingDeg: 0,
        liftMm: 1200,
        elbowDeg: 0,
        wristDeg: 0,
        gripperMm: 100,
    };

    const { id } = await params;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-4xl font-bold mb-8">Robot ID: {id}</h1>
            <div className="w-full max-w-4x h-[600px]">
                <RobotCrane {...initialState} />
            </div>
        </div>
    );
};

export default RobotPage;