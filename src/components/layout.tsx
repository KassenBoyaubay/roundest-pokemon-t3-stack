import Head from "next/head";
import Link from "next/link";

export default function Layout({ children, }: { children: React.ReactNode, }) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className="h-screen inset-0 w-screen flex flex-col justify-between items-center">
                <div className="text-2xl text-center pt-8">Which Pokemon is Rounder?</div>
                {children}
                <div className="w-full text-xl text-center p-4">
                    <Link href="https://github.com/KassenBoyaubay">Github</Link>{" | "}
                    <Link href="/results">Results</Link>{" | "}
                    <Link href="/">Vote</Link>
                </div>
            </div>
        </>
    );
}