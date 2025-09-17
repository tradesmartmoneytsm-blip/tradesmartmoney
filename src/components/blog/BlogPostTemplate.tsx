'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, User, Clock, Eye, MessageCircle, Share2, Bookmark, 
  Twitter, Linkedin, Copy, ChevronLeft, ChevronRight,
  Heart, TrendingUp, BarChart3, Activity,
  Star, Award, CheckCircle, AlertCircle, Lightbulb, Zap
} from 'lucide-react';

interface Author {
  name: string;
  avatar: string;
  role: string;
  bio: string;
  social: {
    twitter?: string;
    linkedin?: string;
  };
  stats: {
    articles: number;
    followers: number;
  };
}

interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  publishDate: string;
  lastUpdated: string;
  author: Author;
  category: string;
  tags: string[];
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  views: number;
  comments: number;
  likes: number;
  shares: number;
  featured: boolean;
  premium: boolean;
  imageUrl: string;
}

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  imageUrl: string;
}

interface BlogPostTemplateProps {
  post: BlogPost;
  relatedPosts: RelatedPost[];
}

export function BlogPostTemplate({ post, relatedPosts }: BlogPostTemplateProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [activeTableOfContents] = useState('');

  // Reading progress calculation
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollCurrent = window.scrollY;
      const scrollPercent = (scrollCurrent / scrollTotal) * 100;
      setReadingProgress(scrollPercent);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  // Set share URL
  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(post.title);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}&via=TradeSmart_`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      copy: shareUrl
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      // You could add a toast notification here
    } else {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
  };

  const difficultyConfig = {
    'Beginner': { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    'Intermediate': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertCircle },
    'Advanced': { color: 'bg-red-100 text-red-700 border-red-200', icon: Zap }
  };

  const DifficultyIcon = difficultyConfig[post.difficulty].icon;

  // Table of contents (mock data - in real app, extract from content)
  const tableOfContents = [
    { id: 'introduction', title: 'Introduction', level: 2 },
    { id: 'key-concepts', title: 'Key Concepts', level: 2 },
    { id: 'trading-strategies', title: 'Trading Strategies', level: 2 },
    { id: 'risk-management', title: 'Risk Management', level: 3 },
    { id: 'practical-examples', title: 'Practical Examples', level: 2 },
    { id: 'conclusion', title: 'Key Takeaways', level: 2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 space-y-3 hidden lg:flex lg:flex-col">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`p-3 rounded-full shadow-lg transition-all ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-3 rounded-full shadow-lg transition-all ${
            isBookmarked ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="p-3 bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-50 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
          
          {showShareMenu && (
            <div className="absolute right-full mr-3 top-0 bg-white rounded-xl shadow-xl border p-2 space-y-1 min-w-[120px]">
              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg"
              >
                <Twitter className="w-4 h-4 mr-2 text-blue-500" />
                Twitter
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg"
              >
                <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
                LinkedIn
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Table of Contents - Left Sidebar */}
          <aside className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-8 bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                Contents
              </h3>
              <nav className="space-y-2">
                {tableOfContents.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm transition-colors ${
                      item.level === 3 ? 'pl-4' : ''
                    } ${
                      activeTableOfContents === item.id
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Article Content */}
          <main className="lg:col-span-8">
            <article className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Article Header */}
              <div className="relative">
                {/* Hero Image */}
                <div className="h-64 md:h-80 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                      <span className={`border px-3 py-1 rounded-full text-sm font-medium ${difficultyConfig[post.difficulty].color}`}>
                        <DifficultyIcon className="w-4 h-4 inline mr-1" />
                        {post.difficulty}
                      </span>
                      {post.premium && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          👑 Premium
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Back Button */}
                <Link
                  href="/blog"
                  className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
              </div>

              <div className="p-6 md:p-8">
                {/* Title and Meta */}
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {post.title}
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>

                  {/* Article Stats */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(post.publishDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {post.readTime}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      {post.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {post.comments} comments
                    </div>
                  </div>

                  {/* Author Card */}
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{post.author.name}</div>
                      <div className="text-sm text-gray-600">{post.author.role}</div>
                      <div className="text-sm text-gray-500 mt-1">{post.author.bio}</div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>{post.author.stats.articles} articles</div>
                      <div>{post.author.stats.followers} followers</div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                      className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-100 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  {/* This would be the actual article content */}
                  <div className="space-y-6">
                    <section id="introduction">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <Lightbulb className="w-6 h-6 mr-3 text-yellow-500" />
                        Introduction
                      </h2>
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-6">
                        <p className="text-blue-900 font-medium mb-2">💡 Key Learning Objective</p>
                        <p className="text-blue-800">
                          By the end of this article, you'll understand how to identify and follow institutional money movements 
                          in Indian markets, giving you a significant edge in your trading decisions.
                        </p>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Smart money trading represents one of the most powerful concepts in modern market analysis. 
                        Unlike retail traders who often react emotionally to market movements, institutional investors 
                        ("smart money") make calculated moves based on deep research and substantial capital allocation.
                      </p>
                    </section>

                    <section id="key-concepts">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Concepts</h2>
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                          <h3 className="font-bold text-green-800 mb-2 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Institutional Flow
                          </h3>
                          <p className="text-green-700 text-sm">
                            Track FII/DII buying and selling patterns to understand market sentiment and direction.
                          </p>
                        </div>
                        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                          <h3 className="font-bold text-purple-800 mb-2 flex items-center">
                            <Activity className="w-5 h-5 mr-2" />
                            Order Flow Analysis
                          </h3>
                          <p className="text-purple-700 text-sm">
                            Analyze large block trades and unusual options activity to spot institutional accumulation.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Interactive Callout */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white my-8">
                      <h3 className="text-xl font-bold mb-3 flex items-center">
                        <Award className="w-6 h-6 mr-2 text-yellow-300" />
                        Pro Tip from Our Experts
                      </h3>
                      <p className="text-blue-100 mb-4">
                        "The best time to follow smart money is during market corrections. Institutional buying 
                        during fear often marks significant bottoms." - Raj Patel, Senior Market Analyst
                      </p>
                      <Link 
                        href="/market"
                        className="inline-flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                      >
                        View Live FII/DII Data
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Article Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`flex items-center px-4 py-2 rounded-full transition-all ${
                          isLiked 
                            ? 'bg-red-50 text-red-600 border-red-200' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        } border`}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                        {post.likes + (isLiked ? 1 : 0)}
                      </button>
                      
                      <button className="flex items-center px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all border">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {post.comments}
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Share:</span>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="p-2 text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Related Posts */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                    <article className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 relative">
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-sm font-medium">
                            {relatedPost.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {relatedPost.readTime}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-2 space-y-6">
            {/* Author Profile */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">About the Author</h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="font-semibold text-gray-900">{post.author.name}</div>
                <div className="text-sm text-gray-600 mb-3">{post.author.role}</div>
                <p className="text-sm text-gray-500 mb-4">{post.author.bio}</p>
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <div>
                    <div className="font-semibold text-gray-900">{post.author.stats.articles}</div>
                    <div>Articles</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{post.author.stats.followers}</div>
                    <div>Followers</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Posts Widget */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Popular This Week
              </h3>
              <div className="space-y-4">
                {relatedPosts.slice(0, 3).map((post, index) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="text-xs text-gray-500 mt-1">{post.readTime}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
} 