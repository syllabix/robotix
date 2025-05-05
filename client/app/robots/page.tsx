import { loadAll } from "@/api/robot/loader";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { CraneDetails } from "@/types/crane";
import { Alert } from "@/components/feedback/Alert";
import { CircleAlert } from "lucide-react";

const RobotListPage: FC<{}> = async () => {
    const result = await loadAll();

    return (
        <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[32px] row-start-1 items-center sm:items-start w-full">
                <div className="flex items-center gap-2" >
                    <Image
                        src="/robotix_logo.png"
                        alt="Robotix logo"
                        width={100}
                        height={0}
                        style={{ width: "auto", height: "auto" }}
                        priority
                    />
                    <h1 className="text-lg font-bold">select your robot to get started</h1>
                </div>

                {result.isOk() ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {result.value.map((robot: CraneDetails) => (
                            <Link
                                key={robot.id}
                                href={`/robots/${robot.id}`}
                                className="card bg-base-200 hover:bg-base-300 transition-colors"
                            >
                                <div className="card-body flex flex-row items-center gap-4">
                                    <Image
                                        src="/robotix_logo.png"
                                        alt="Robotix logo"
                                        width={40}
                                        height={40}
                                    />
                                    <span className="text-lg font-medium">{robot.id}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <Alert kind="error" icon={<CircleAlert />}>
                        <span>Error loading robots: {result.getOrThrow()}</span>
                    </Alert>
                )}
            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
            </footer>
        </div>
    );
}

export default RobotListPage;