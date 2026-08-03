export default async function HealthPage() {
  let data: { data: { title: string; score: number } } | null = null;
  let error: string | null = null;

  try {
    const res = await fetch("https://api.jikan.moe/v4/anime/1", {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <main>
      <h1>Health Check</h1>
      <p>Deployment can fetch external data: {error ? "No" : "Yes"}</p>
      {error && <p>Error: {error}</p>}
      {data && (
        <dl>
          <dt>Title</dt>
          <dd>{data.data.title}</dd>
          <dt>Score</dt>
          <dd>{data.data.score}</dd>
        </dl>
      )}
    </main>
  );
}
