import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from '@/app/providers/app-providers';
import { AppRouter } from '@/app/router/app-router';
import { ErrorBoundary } from '@/app/error-boundary';
import '@/styles.css';
import '@fontsource-variable/nunito';
import { ThemeProvider } from '@/app/providers/theme-provider';

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW !== 'true') return;
  const { worker } = await import('@/services/mocks/browser');
  if (import.meta.env.DEV) {
    const { setMockScenario } = await import('@/services/mocks/scenario');
    window.__setPrismaMockScenario = setMockScenario;
  }
  await worker.start({ onUnhandledRequest: 'bypass' });
}

void enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <ThemeProvider>
          <AppProviders>
            <AppRouter />
          </AppProviders>
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
});
