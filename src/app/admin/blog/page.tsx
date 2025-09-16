'use client';

import { useState } from 'react';
import { 
  Plus, Edit, Trash2, Eye, Calendar, User, Clock, Save, 
  Upload, Image as ImageIcon, Tag, BookOpen, Settings,
  CheckCircle, AlertCircle, Monitor, Smartphone
} from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    bio: string;
  };
  category: string;
  tags: string[];
  publishDate: string;
  lastUpdated: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'draft' | 'published' | 'scheduled';
  featured: boolean;
  premium: boolean;
  views: number;
  comments: number;
  likes: number;
}

// Mock data - in production, this would come from your database
const mockPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'complete-guide-smart-money-trading-2025',
    title: 'Complete Guide to Smart Money Trading in 2025',
    excerpt: 'Master institutional money flow tracking with advanced techniques, real-world examples, and proven strategies for Indian markets.',
    content: 'Full article content here...',
    author: {
      name: 'Raj Patel',
      role: 'Senior Market Analyst',
      bio: '10+ years experience in institutional trading'
    },
    category: 'Smart Money',
    tags: ['Institutional Flow', 'FII/DII', 'Order Flow', 'Strategy'],
    publishDate: '2025-01-15',
    lastUpdated: '2025-01-15',
    readTime: '12 min read',
    difficulty: 'Intermediate',
    status: 'published',
    featured: true,
    premium: false,
    views: 15420,
    comments: 89,
    likes: 342
  },
  {
    id: 2,
    slug: 'fii-dii-data-analysis-january-2025',
    title: 'FII/DII Data Analysis: January 2025 Market Impact',
    excerpt: 'Deep dive into recent foreign and domestic institutional flow patterns and their dramatic impact on Nifty direction.',
    content: 'Full article content here...',
    author: {
      name: 'Priya Sharma',
      role: 'Data Analyst',
      bio: 'Specialist in institutional flow analysis'
    },
    category: 'Market Analysis',
    tags: ['FII DII', 'Market Data', 'Institutional Flow', 'Nifty'],
    publishDate: '2025-01-14',
    lastUpdated: '2025-01-14',
    readTime: '8 min read',
    difficulty: 'Beginner',
    status: 'published',
    featured: true,
    premium: false,
    views: 12150,
    comments: 64,
    likes: 278
  }
];

const categories = ['Smart Money', 'Market Analysis', 'Algo Trading', 'Intraday Trading', 'Options Trading', 'Swing Trading'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
const authors = [
  { name: 'Raj Patel', role: 'Senior Market Analyst', bio: '10+ years experience in institutional trading' },
  { name: 'Priya Sharma', role: 'Data Analyst', bio: 'Specialist in institutional flow analysis' },
  { name: 'Vikram Singh', role: 'Algorithmic Trading Expert', bio: 'Former quant trader at leading hedge fund' },
  { name: 'Arjun Mehta', role: 'Intraday Specialist', bio: 'Professional day trader with 8+ years experience' }
];

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>(mockPosts);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'editor' | 'settings'>('overview');
  
  // Form state for new/edit post
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: categories[0],
    tags: [],
    difficulty: 'Beginner',
    status: 'draft',
    featured: false,
    premium: false,
    author: authors[0]
  });

  const handleCreatePost = () => {
    setSelectedPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: categories[0],
      tags: [],
      difficulty: 'Beginner',
      status: 'draft',
      featured: false,
      premium: false,
      author: authors[0]
    });
    setShowEditor(true);
    setActiveTab('editor');
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData(post);
    setShowEditor(true);
    setActiveTab('editor');
  };

  const handleSavePost = () => {
    if (selectedPost) {
      // Update existing post
      setPosts(posts.map(p => p.id === selectedPost.id ? { ...selectedPost, ...formData } : p));
    } else {
      // Create new post
      const newPost: BlogPost = {
        ...formData as BlogPost,
        id: Math.max(...posts.map(p => p.id)) + 1,
        slug: formData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '',
        publishDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        readTime: `${Math.ceil((formData.content?.length || 0) / 200)} min read`,
        views: 0,
        comments: 0,
        likes: 0
      };
      setPosts([...posts, newPost]);
    }
    setShowEditor(false);
    setSelectedPost(null);
  };

  const handleDeletePost = (postId: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
                <p className="text-gray-600">Create and manage your trading blog content</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/blog"
                target="_blank"
                className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Blog
              </Link>
              <button
                onClick={handleCreatePost}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showEditor ? (
          // Overview Dashboard
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Published</p>
                    <p className="text-2xl font-bold text-gray-900">{posts.filter(p => p.status === 'published').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Edit className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Drafts</p>
                    <p className="text-2xl font-bold text-gray-900">{posts.filter(p => p.status === 'draft').length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-gray-900">{posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">All Posts</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {post.title}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {post.excerpt}
                            </div>
                            <div className="flex items-center mt-1 space-x-2">
                              {post.featured && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Featured
                                </span>
                              )}
                              {post.premium && (
                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                  Premium
                                </span>
                              )}
                              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(post.difficulty)}`}>
                                {post.difficulty}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {post.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{post.author.name}</div>
                            <div className="text-gray-500">{post.author.role}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {post.views.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(post.publishDate).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="View Post"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleEditPost(post)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Edit Post"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete Post"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          // Blog Editor
          <div className="bg-white rounded-xl border border-gray-200">
            {/* Editor Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => setShowEditor(false)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    ← Back to Posts
                  </button>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveTab('editor')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === 'editor'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Edit className="w-4 h-4 inline mr-2" />
                      Editor
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === 'settings'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Settings className="w-4 h-4 inline mr-2" />
                      Settings
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' | 'scheduled' })}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Publish</option>
                    <option value="scheduled">Schedule</option>
                  </select>
                  
                  <button
                    onClick={handleSavePost}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Post
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'editor' && (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Post Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                      placeholder="Enter an engaging title for your blog post..."
                    />
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt *
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write a compelling excerpt that summarizes your post..."
                    />
                  </div>

                  {/* Content Editor */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <div className="border border-gray-300 rounded-lg">
                      <div className="border-b border-gray-300 px-4 py-2 bg-gray-50 flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-gray-900 rounded">
                          <strong>B</strong>
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 rounded">
                          <em>I</em>
                        </button>
                        <button className="p-2 text-gray-600 hover:text-gray-900 rounded">
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={15}
                        className="w-full px-4 py-3 border-0 focus:outline-none focus:ring-0 resize-none font-mono text-sm"
                        placeholder="Write your blog post content here... You can use Markdown syntax."
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Estimated read time: {Math.ceil((formData.content?.length || 0) / 200)} minutes
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Post Settings</h3>
                    
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Difficulty Level
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {difficulties.map((diff) => (
                          <option key={diff} value={diff}>{diff}</option>
                        ))}
                      </select>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={formData.tags?.join(', ') || ''}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter tags separated by commas"
                      />
                    </div>

                    {/* Author */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Author
                      </label>
                      <select
                        value={formData.author?.name || ''}
                        onChange={(e) => {
                          const selectedAuthor = authors.find(a => a.name === e.target.value);
                          setFormData({ ...formData, author: selectedAuthor });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {authors.map((author) => (
                          <option key={author.name} value={author.name}>
                            {author.name} - {author.role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Visibility & Features</h3>
                    
                    {/* Featured */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured || false}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                        Feature this post
                      </label>
                    </div>

                    {/* Premium */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="premium"
                        checked={formData.premium || false}
                        onChange={(e) => setFormData({ ...formData, premium: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="premium" className="ml-2 text-sm text-gray-700">
                        Premium content
                      </label>
                    </div>

                    {/* Preview */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
                      <div className="bg-white rounded border p-4">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {formData.title || 'Blog Post Title'}
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {formData.author?.name} • {formData.category}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {formData.excerpt || 'Blog post excerpt will appear here...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 