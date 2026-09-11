import dynamic from "next/dynamic";

const Disclosure = dynamic(() => import("@/components/playground/Disclosure"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-2">
      <div className="h-10 w-full rounded-lg bg-[#2A241E] border border-[#352E26]" />
      <div className="h-20 w-full rounded-lg bg-[#2A241E] border border-[#352E26]" />
    </div>
  ),
});

const Tabs = dynamic(() => import("@/components/playground/Tabs"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-3">
      <div className="flex gap-2">
        <div className="h-8 w-20 rounded bg-[#2A241E]" />
        <div className="h-8 w-20 rounded bg-[#2A241E]" />
        <div className="h-8 w-20 rounded bg-[#2A241E]" />
      </div>
      <div className="h-32 w-full rounded-lg bg-[#2A241E] border border-[#352E26]" />
    </div>
  ),
});

const Modal = dynamic(() => import("@/components/playground/Modal"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-10 w-32 rounded-lg bg-[#2A241E] border border-[#352E26]" />
    </div>
  ),
});

export default function PlaygroundPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Playground</h1>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2>1. Disclosure Component</h2>
        <Disclosure />
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2>2. Accessible Tabs</h2>
        <Tabs />
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2>3. Accessible Modal (Focus Trap)</h2>
        <Modal />
      </section>
    </div>
  );
}