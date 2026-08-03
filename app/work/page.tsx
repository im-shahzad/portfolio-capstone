import Link from "next/link";

export default function WorkPage() {
  return (
    <main>
      <h1>Case Study: Meme Caption Generator</h1>

      <section>
        <h2>Problem</h2>
        <p>
          Most AI text generators can generate content, but getting a
          caption that&apos;s actually usable often means rewriting prompts
          over and over...
        </p>
      </section>

      <section>
        <h2>What I Did</h2>
        <ul>
          <li>Predefined tone options</li>
          <li>Generation history</li>
          <li>Side-by-side comparison</li>
        </ul>
      </section>

      <section>
        <h2>What Came Of It</h2>
        <p>Reduced friction.</p>
        <p>
          Honest disclosure: no formal user testing yet.
        </p>
      </section>

      <Link href="/about">Explore more about me.</Link>
    </main>
  );
}
