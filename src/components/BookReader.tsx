'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, List, Download, Star, Award, ArrowLeft } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { useRouter } from 'next/navigation';
import { ContentFormatter } from '@/app/books/my-books/fundamental-analysis/ContentFormatter';

interface Chapter {
  id: number;
  title: string;
}

interface BookReaderProps {
  bookTitle: string;
  bookSubtitle: string;
  chapters: Chapter[];
  bookFile: string;
  coverGradient: string;
}

export function BookReader({ bookTitle, bookSubtitle, chapters, bookFile, coverGradient }: BookReaderProps) {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [showTOC, setShowTOC] = useState(false);
  const [chapterContent, setChapterContent] = useState<string>('Loading...');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSectionChange = (section: string, subSection?: string) => {
    if (section === 'books' && subSection) {
      router.push(`/books/${subSection}`);
      return;
    }
    
    const routes: { [key: string]: string } = {
      'home': '/',
      'market': '/market',
      'swing': '/swing-trades',
      'news': '/news',
      'algo-trading': '/algo-trading',
      'books': '/books',
    };
    
    const route = routes[section];
    if (route) {
      router.push(route);
    }
  };

  // Load chapter content when chapter changes
  useEffect(() => {
    const loadChapter = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/books/${bookFile}`);
        const fullText = await response.text();
        
        // Extract specific chapter content based on chapter markers
        const chapterMarker = `## Chapter ${currentChapter}:`;
        const nextChapterMarker = `## Chapter ${currentChapter + 1}:`;
        
        const startIndex = fullText.indexOf(chapterMarker);
        const endIndex = fullText.indexOf(nextChapterMarker);
        
        if (startIndex !== -1) {
          const content = endIndex !== -1 
            ? fullText.substring(startIndex, endIndex)
            : fullText.substring(startIndex);
          setChapterContent(content);
        } else {
          setChapterContent('Chapter content not found.');
        }
      } catch (error) {
        setChapterContent('Error loading chapter. Please try again.');
        console.error('Error loading chapter:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChapter();
  }, [currentChapter, bookFile]);

  const currentChapterMeta = chapters.find(ch => ch.id === currentChapter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation 
        activeSection="books" 
        onSectionChange={handleSectionChange}
      />
      
      {/* Book Header */}
      <div className={`relative bg-gradient-to-r ${coverGradient} text-white py-12 px-4 mt-16`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <a 
              href="/books/my-books"
              className="inline-block hover:opacity-80 transition-opacity cursor-pointer"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <Award className="w-10 h-10" />
                <h1 className="text-3xl md:text-4xl font-bold">{bookTitle}</h1>
              </div>
              <p className="text-lg text-white/90 mb-2">
                {bookSubtitle}
              </p>
            </a>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {chapters.length} Chapters
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                Free to Read
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Navigation Bar */}
        <div className="mb-4 flex items-center justify-between">
          <a
            href="/books/my-books"
            className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Books</span>
          </a>
          
          <a
            href={`/books/${bookFile}`}
            download
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download Full Book</span>
          </a>
        </div>

        {/* Two Column Layout: Sidebar + Content */}
        <div className="flex gap-6">
          {/* Left Sidebar - Fixed Table of Contents (Desktop Only) */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className={`bg-gradient-to-r ${coverGradient} text-white p-4`}>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <List className="w-5 h-5" />
                  Table of Contents
                </h3>
                <p className="text-xs text-white/80 mt-1">{chapters.length} Chapters</p>
              </div>
              <div className="p-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="space-y-1">
                  {chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => {
                        setCurrentChapter(chapter.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm ${
                        currentChapter === chapter.id
                          ? 'bg-blue-600 text-white shadow-md scale-105'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:scale-102'
                      }`}
                    >
                      <div className="font-semibold mb-0.5">Chapter {chapter.id}</div>
                      <div className={`text-xs line-clamp-2 ${currentChapter === chapter.id ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                        {chapter.title}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Content Area */}
          <div className="flex-1 min-w-0">
            {/* Mobile TOC Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowTOC(!showTOC)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors w-full justify-center"
              >
                <List className="w-4 h-4" />
                <span>{showTOC ? 'Hide' : 'Show'} All Chapters ({chapters.length})</span>
              </button>
            </div>

            {/* Mobile Table of Contents */}
            <AnimatePresence>
              {showTOC && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="lg:hidden mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-1">
                      {chapters.map((chapter) => (
                        <button
                          key={chapter.id}
                          onClick={() => {
                            setCurrentChapter(chapter.id);
                            setShowTOC(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors text-sm ${
                            currentChapter === chapter.id
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="font-semibold mb-0.5">Chapter {chapter.id}</div>
                          <div className={`text-xs ${currentChapter === chapter.id ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                            {chapter.title}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chapter Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapter}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Chapter {currentChapter}: {currentChapterMeta?.title}
                </h2>
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {currentChapter} of {chapters.length}
                  </span>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="max-w-none">
                    <ContentFormatter content={chapterContent} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  setCurrentChapter(Math.max(1, currentChapter - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentChapter === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentChapter === 1
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <span className="text-gray-600 dark:text-gray-400 font-medium hidden sm:block">
                {currentChapter} / {chapters.length}
              </span>

              <button
                onClick={() => {
                  setCurrentChapter(Math.min(chapters.length, currentChapter + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={currentChapter === chapters.length}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentChapter === chapters.length
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

