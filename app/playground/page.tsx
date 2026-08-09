// import Disclosure from '@/components/playground/Disclosure';

// export default function PlaygroundPage() {
//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1>Playground</h1>
//       <Disclosure />
//     </div>
//   );
// }

import Disclosure from '@/components/playground/Disclosure';
import Tabs from '@/components/playground/Tabs';
import Modal from '@/components/playground/Modal';

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