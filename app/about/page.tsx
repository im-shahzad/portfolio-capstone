import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="max-w-prose">
      <h1>About</h1>
      <p>
        I&apos;m someone who enjoys building software and exploring how AI can
        make applications genuinely useful. Lately, I&apos;ve been combining
        Python with Generative AI to build projects that solve real problems,
        not just experiment with APIs — and I&apos;m especially curious about
        what it takes to turn an idea into something production-ready.
      </p>
      <Link href="/contact">Get in touch.</Link>
    </main>
  );
}
