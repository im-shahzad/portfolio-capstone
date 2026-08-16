import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-prose">
      <h1>
        I build AI-powered applications people can actually use, not just API
        demonstrations.
      </h1>
      <div className="flex flex-wrap gap-4 mt-6">
        <Link href="/work">See work.</Link>
        <Link
          href="/chat"
          className="border border-accent text-accent bg-transparent hover:bg-accent/10"
        >
          Ask AI Assistant &rarr;
        </Link>
      </div>
    </main>
  );
}
