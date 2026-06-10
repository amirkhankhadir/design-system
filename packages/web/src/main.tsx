import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Loader } from './components/Loader';

// Load design tokens
import '../../../dist/web/tokens.light.css';

const bg = {
  white:   '#ffffff',
  brand:   'var(--ds-color-brand-default)',
  dark:    '#161616',
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ fontFamily: 'system-ui', padding: 40, display: 'flex', flexDirection: 'column', gap: 48 }}>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Loader</h2>

      {/* Sizes */}
      <section>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: '#737373' }}>Sizes</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Loader size="sm" />
          <Loader size="md" />
          <Loader size="lg" />
        </div>
      </section>

      {/* Colors */}
      <section>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: '#737373' }}>Colors</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ background: bg.white, padding: 16, borderRadius: 8, border: '1px solid #e5e5e5' }}>
            <Loader color="brand" />
          </div>
          <div style={{ background: bg.brand, padding: 16, borderRadius: 8 }}>
            <Loader color="white" />
          </div>
          <div style={{ background: bg.dark, padding: 16, borderRadius: 8 }}>
            <Loader color="white" />
          </div>
        </div>
      </section>
    </div>
  </StrictMode>,
);
