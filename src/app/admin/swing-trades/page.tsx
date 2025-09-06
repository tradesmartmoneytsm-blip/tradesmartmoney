'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, Upload, RefreshCw, 
  DollarSign, Calendar, Target, Activity, TrendingUp, Lock, LogOut, Eye, EyeOff 
} from 'lucide-react';
import { SwingTrade } from '@/app/api/swing-trades/route';

const STRATEGIES = ['BIT', 'Swing Angle', 'Bottom Formation'] as const;
const STATUSES = ['Running', 'SL Hit', 'Trade Successful', 'Cancelled'] as const;

// Authentication component
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        // Store auth token in localStorage
        localStorage.setItem('swing_admin_auth', result.token);
        onLogin();
      } else {
        setError(result.error || 'Invalid password');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Admin Access Required
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the admin password to manage swing trades
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || !password}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                'Access Admin Panel'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FormData {
  id?: string;
  strategy: string;
  stock_name: string;
  stock_symbol: string;
  entry_price: string;
  exit_price: string;
  stop_loss: string;
  target_price: string;
  current_price: string;
  status: string;
  setup_description: string;
  risk_reward_ratio: string;
  timeframe: string;
  entry_date: string;
  exit_date: string;
  chart_image_url: string;
  notes: string;
  potential_return: string;
}

const initialFormData: FormData = {
  strategy: 'BIT',
  stock_name: '',
  stock_symbol: '',
  entry_price: '',
  exit_price: '',
  stop_loss: '',
  target_price: '',
  current_price: '',
  status: 'Running',
  setup_description: '',
  risk_reward_ratio: '',
  timeframe: '',
  entry_date: new Date().toISOString().split('T')[0],
  exit_date: '',
  chart_image_url: '',
  notes: '',
  potential_return: ''
};

export default function AdminSwingTrades() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [trades, setTrades] = useState<SwingTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTrade, setEditingTrade] = useState<SwingTrade | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Check authentication status on mount
  useEffect(() => {
    const authToken = localStorage.getItem('swing_admin_auth');
    if (authToken) {
      // Verify token with backend
      verifyAuthToken(authToken);
    } else {
      setCheckingAuth(false);
    }
  }, []);

  const verifyAuthToken = async (token: string) => {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (result.success) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('swing_admin_auth');
        setIsAuthenticated(false);
      }
    } catch (err) {
      localStorage.removeItem('swing_admin_auth');
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCheckingAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('swing_admin_auth');
    setIsAuthenticated(false);
    setTrades([]);
    setShowForm(false);
    setEditingTrade(null);
  };

  // Get auth headers for API calls
  const getAuthHeaders = () => {
    const token = localStorage.getItem('swing_admin_auth');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  };

  // Fetch trades
  const fetchTrades = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/swing-trades', {
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      
      if (result.success) {
        setTrades(result.data || []);
      } else {
        throw new Error(result.error || 'Failed to fetch swing trades');
      }
    } catch (err) {
      console.error('Error fetching swing trades:', err);
      setError(err instanceof Error ? err.message : 'Failed to load swing trades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTrades();
    }
  }, [isAuthenticated]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const method = editingTrade ? 'PUT' : 'POST';
      const payload = editingTrade ? { ...formData, id: editingTrade.id } : formData;
      
      const response = await fetch('/api/swing-trades', {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTrades();
        handleCloseForm();
      } else {
        throw new Error(result.error || 'Failed to save swing trade');
      }
    } catch (err) {
      console.error('Error saving swing trade:', err);
      setError(err instanceof Error ? err.message : 'Failed to save swing trade');
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string, stockName: string) => {
    if (!confirm(`Are you sure you want to delete the swing trade for ${stockName}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/swing-trades?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const result = await response.json();

      if (result.success) {
        await fetchTrades();
      } else {
        throw new Error(result.error || 'Failed to delete swing trade');
      }
    } catch (err) {
      console.error('Error deleting swing trade:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete swing trade');
    }
  };

  // Handle edit
  const handleEdit = (trade: SwingTrade) => {
    setEditingTrade(trade);
    setFormData({
      id: trade.id,
      strategy: trade.strategy,
      stock_name: trade.stock_name,
      stock_symbol: trade.stock_symbol,
      entry_price: trade.entry_price.toString(),
      exit_price: trade.exit_price?.toString() || '',
      stop_loss: trade.stop_loss.toString(),
      target_price: trade.target_price?.toString() || '',
      current_price: trade.current_price?.toString() || '',
      status: trade.status,
      setup_description: trade.setup_description || '',
      risk_reward_ratio: trade.risk_reward_ratio || '',
      timeframe: trade.timeframe || '',
      entry_date: trade.entry_date,
      exit_date: trade.exit_date || '',
      chart_image_url: trade.chart_image_url || '',
      notes: trade.notes || '',
      potential_return: trade.potential_return?.toString() || ''
    });
    setShowForm(true);
  };

  // Handle close form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTrade(null);
    setFormData(initialFormData);
    setError(null);
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Auto-calculate potential return when target and entry prices change
  useEffect(() => {
    if (formData.entry_price && formData.target_price && !formData.potential_return) {
      const entry = parseFloat(formData.entry_price);
      const target = parseFloat(formData.target_price);
      if (!isNaN(entry) && !isNaN(target) && entry > 0) {
        const potentialReturn = ((target - entry) / entry) * 100;
        setFormData(prev => ({ ...prev, potential_return: potentialReturn.toFixed(2) }));
      }
    }
  }, [formData.entry_price, formData.target_price, formData.potential_return]);

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running': return 'bg-blue-100 text-blue-800';
      case 'Trade Successful': return 'bg-green-100 text-green-800';
      case 'SL Hit': return 'bg-red-100 text-red-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'BIT': return 'bg-blue-100 text-blue-800';
      case 'Swing Angle': return 'bg-purple-100 text-purple-800';
      case 'Bottom Formation': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Swing Trades Admin</h1>
            <p className="text-gray-600 mt-2">Manage swing trading opportunities across all strategies</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button
              onClick={fetchTrades}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add New Trade
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingTrade ? 'Edit Swing Trade' : 'Add New Swing Trade'}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Strategy *
                    </label>
                    <select
                      name="strategy"
                      value={formData.strategy}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {STRATEGIES.map(strategy => (
                        <option key={strategy} value={strategy}>{strategy}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {STATUSES.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Name *
                    </label>
                    <input
                      type="text"
                      name="stock_name"
                      value={formData.stock_name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Reliance Industries"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Symbol *
                    </label>
                    <input
                      type="text"
                      name="stock_symbol"
                      value={formData.stock_symbol}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., RELIANCE"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Price Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entry Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="entry_price"
                      value={formData.entry_price}
                      onChange={handleInputChange}
                      required
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stop Loss *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="stop_loss"
                      value={formData.stop_loss}
                      onChange={handleInputChange}
                      required
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="target_price"
                      value={formData.target_price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="current_price"
                      value={formData.current_price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exit Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="exit_price"
                      value={formData.exit_price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Potential Return (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="potential_return"
                      value={formData.potential_return}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk:Reward Ratio
                    </label>
                    <input
                      type="text"
                      name="risk_reward_ratio"
                      value={formData.risk_reward_ratio}
                      onChange={handleInputChange}
                      placeholder="e.g., 1:2.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Timeframe
                    </label>
                    <input
                      type="text"
                      name="timeframe"
                      value={formData.timeframe}
                      onChange={handleInputChange}
                      placeholder="e.g., 5-10 days"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entry Date *
                    </label>
                    <input
                      type="date"
                      name="entry_date"
                      value={formData.entry_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exit Date
                    </label>
                    <input
                      type="date"
                      name="exit_date"
                      value={formData.exit_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chart Image URL
                    </label>
                    <input
                      type="url"
                      name="chart_image_url"
                      value={formData.chart_image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/chart.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Text Areas */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Setup Description
                    </label>
                    <textarea
                      name="setup_description"
                      value={formData.setup_description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Describe the technical setup and analysis..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Additional notes or observations..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    disabled={saving}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? 'Saving...' : editingTrade ? 'Update Trade' : 'Create Trade'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Trades Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Swing Trades ({trades.length})
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
              <p className="text-gray-600">Loading swing trades...</p>
            </div>
          ) : trades.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-8 h-8 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No swing trades found</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Your First Trade
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Strategy
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target / SL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Return
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {trade.stock_name}
                          </div>
                          <div className="text-sm text-gray-500 font-mono">
                            {trade.stock_symbol}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStrategyColor(trade.strategy)}`}>
                          {trade.strategy}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>Entry: {formatCurrency(trade.entry_price)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(trade.entry_date).toLocaleDateString('en-IN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="text-green-600">
                          Target: {trade.target_price ? formatCurrency(trade.target_price) : 'N/A'}
                        </div>
                        <div className="text-red-600">
                          SL: {formatCurrency(trade.stop_loss)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(trade.status)}`}>
                          {trade.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {trade.potential_return && (
                          <span className={`font-medium ${trade.potential_return >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {trade.potential_return.toFixed(2)}%
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(trade)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(trade.id, trade.stock_name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 