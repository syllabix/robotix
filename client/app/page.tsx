import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col items-center gap-[32px]">
                <Image
                    src="/robotix_logo.png"
                    alt="Robotix logo"
                    width={180}
                    height={38}
                    priority
                />

                <h1 className="text-center">Robotix</h1>
                
                <Link 
                    href="/robots" 
                    className="btn w-full sm:w-auto"
                >
                    Select Your Robot
                </Link>

            </main>
        </div>
    );
}
