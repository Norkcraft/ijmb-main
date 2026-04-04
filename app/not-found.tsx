import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center section-padding">
      <h1 className="text-6xl font-heading font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-heading font-bold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-8 py-4 font-bold rounded-lg cta-gradient text-accent-foreground hover:opacity-90 transition-opacity"
      >
        Go Back Home
      </Link>
    </div>
  );
}
