import { FC } from 'react';
import Link from 'next/link';
import RobotCrane from '@/components/robot/RobotCrane';
import { loadCrane } from '@/api/robot/loader';
import { Alert } from '@/components/feedback/Alert';
import { CircleAlert } from 'lucide-react';
import CraneControls from '@/components/controls/CraneControls';
import RobotCraneScene from '@/components/scene/RobotCraneScene';
import Image from 'next/image';

interface PageProps {
    params: Promise<{ id: string }>
}

const RobotPage: FC<PageProps> = async ({ params }) => {
    const { id } = await params;
    const result = await loadCrane(id);

    return (
        <>
            <Link href="/" className="fixed py-2 pl-2 pr-4 top-2 left-2 flex items-center gap-2 hover:opacity-80 z-50">
                <div>
                    <Image
                        src="/robotix_logo.png"
                        alt="Robotix logo"
                        width={30}
                        height={0}
                        style={{ width: "auto", height: "auto" }}
                        priority
                    />
                </div>
                <h2 className="font-bold">{id}</h2>
            </Link>
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

