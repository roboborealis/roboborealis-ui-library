import * as React from 'react';

import { RoboErrorState } from '@/feedback/error-state/robo-error-state';

export interface RoboErrorBoundaryProps {
  children: React.ReactNode;
  /** Rendered instead of the default RoboErrorState when an error is caught. */
  fallback?: React.ReactNode;
  /** Called when the retry action is triggered, before the boundary resets. */
  onRetry?: () => void;
  /** Error message shown by the default fallback. */
  errorMessage?: string;
}

interface RoboErrorBoundaryState {
  hasError: boolean;
}

/**
 * RoboErrorBoundary — catches render errors in its subtree and shows a full-page
 * error state instead of crashing the app.
 *
 * Deliberate, sole exception to this library's functional-component (ref-as-prop)
 * convention: React has no hook-based equivalent for `componentDidCatch` /
 * `getDerivedStateFromError`, so a class component is unavoidable here.
 *
 * Retrying fully resets `hasError`, which unmounts and remounts the subtree —
 * `RoboErrorState`'s own animation/error state is local and does not reset on
 * its own, so remounting (not toggling its `variant` prop) is what replays it.
 *
 * @example
 * ```tsx
 * <RoboErrorBoundary onRetry={() => refetch()}>
 *   <Dashboard />
 * </RoboErrorBoundary>
 * ```
 */
class RoboErrorBoundary extends React.Component<RoboErrorBoundaryProps, RoboErrorBoundaryState> {
  static displayName = 'RoboErrorBoundary';

  state: RoboErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): RoboErrorBoundaryState {
    return { hasError: true };
  }

  handleRetry = (): void => {
    this.props.onRetry?.();
    this.setState({ hasError: false });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <RoboErrorState
            variant='error'
            errorMessage={this.props.errorMessage}
            onRetry={this.handleRetry}
          />
        )
      );
    }

    return this.props.children;
  }
}

export { RoboErrorBoundary };
