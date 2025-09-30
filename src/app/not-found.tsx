import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </Link>
          
          <div className="text-sm text-gray-500">
            Or try these popular pages:
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Link 
              href="/market" 
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Market Data
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/swing-trades" 
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Swing Trades
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/blog" 
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
