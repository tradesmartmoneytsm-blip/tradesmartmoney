'use client';

interface TradingSeoSectionProps {
  children: React.ReactNode;
}

/** SEO / educational block aligned with the main content column (right of Market Outlook rail). */
export function TradingSeoSection({ children }: TradingSeoSectionProps) {
  return (
    <div className="flex w-full mt-4 sm:mt-6 pb-6 sm:pb-8">
      <div
        className="hidden lg:block flex-shrink-0 w-[280px] xl:w-[300px] pl-2"
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0 px-2 sm:px-3">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
