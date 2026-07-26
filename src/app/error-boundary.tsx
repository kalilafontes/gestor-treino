import { Component, type ReactNode } from 'react';
import { ErrorState } from '@/components/feedback/status';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // O erro técnico não é exibido nem serializado com dados da sessão.
  }

  render() {
    if (this.state.failed) return <ErrorState retry={() => window.location.reload()} />;
    return this.props.children;
  }
}
