'use client';

export function CalendarActions() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'NSE Holidays 2025 Calendar',
        text: 'Complete NSE BSE holidays 2025 trading calendar',
        url: window.location.href
      });
    }
  };

  return (
    <div className="flex justify-center space-x-4">
      <button 
        onClick={handlePrint}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        🖨️ Print Calendar
      </button>
      <button 
        onClick={handleShare}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        📤 Share Calendar
      </button>
    </div>
  );
}
