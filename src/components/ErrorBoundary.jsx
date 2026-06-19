import { Component } from 'react';
import Button from './ui/Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold text-red-400">Terjadi kesalahan</h2>
          <p className="mt-2 text-slate-400">Silakan muat ulang halaman.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Muat Ulang
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
