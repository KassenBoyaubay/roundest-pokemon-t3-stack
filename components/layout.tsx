import Link from "next/link";

export default function Layout({ children, }: { children: React.ReactNode, }) {
    return (
        <div className="h-screen w-screen flex flex-col justify-between items-center">
            <div className="text-2xl text-center pt-8">Which Pokemon is Rounder?</div>
            {children}
            <div className="w-full text-xl text-center p-4">
                <Link href="https://github.com/KassenBoyaubay">Github</Link>{" | "}
                <Link href="/results">Results</Link>{" | "}
                <Link href="/">Vote</Link>
            </div>
        </div>
    );
}