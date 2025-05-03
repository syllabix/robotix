import { FC } from 'react';
import RobotCrane from '@/components/robot/RobotCrane';
import { loadCrane } from '@/api/robot/loader';
import { Alert } from '@/components/feedback/Alert';
import { CircleAlert } from 'lucide-react';
import CraneControls from '@/components/controls/CraneControls';
import RobotCraneScene from '@/components/scene/RobotCraneScene';

interface PageProps {
    params: Promise<{ id: string }>
}

const RobotPage: FC<PageProps> = async ({ params }) => {
    const { id } = await params;
    const result = await loadCrane(id);

    return (
        <>
            <h2 className="text-4xl font-bold mb-8 fixed p-4">robot id: {id}</h2>
            <div className="w-full h-screen">
                {result.isOk() && (
                    <RobotCraneScene {...result.value} />
                )}
                {result.isError() && (
                    <div className="flex items-center justify-center h-full">
                        <Alert kind="error" icon={<CircleAlert />}>
                            <span>{result.error}</span>
                        </Alert>
                    </div>
                )}
            </div>
        </>
    );
};

export default RobotPage;

