import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-brand-bg text-brand-white px-4">
            <div className="text-center space-y-6 max-w-lg">
                <h1 className="text-9xl font-bold text-brand-primary opacity-20">404</h1>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Page not found</h2>
                <p className="text-lg text-gray-400">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
                </p>
                <div className="pt-6">
                    <Link href="/">
                        <Button variant="default" size="lg">
                            Return Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
