import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-xl w-full rounded-xl border bg-card p-6 space-y-4">
            <div>
              <div className="text-lg font-semibold">Something went wrong</div>
              <div className="text-sm text-muted-foreground">The page crashed while rendering.</div>
            </div>
            <div className="rounded-md bg-muted p-3 text-sm font-mono break-words">
              {this.state.error.message || 'Unknown error'}
            </div>
            <div className="flex gap-2">
              <Button onClick={() => window.location.reload()}>Reload</Button>
              <Button variant="outline" onClick={() => this.setState({ error: null })}>
                Try again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

