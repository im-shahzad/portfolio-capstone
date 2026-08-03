import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-prose">
      <h1>
        I build AI-powered applications people can actually use, not just API
        demonstrations.
      </h1>
      <Link href="/work">See work.</Link>
    </main>
  );
}
