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
        <>
            <h2 className="text-4xl font-bold mb-8 fixed p-4">robot id: {id}</h2>
            <div className="w-full h-screen">
                <RobotCrane {...initialState} />
            </div>
        </>
    );
};

export default RobotPage;