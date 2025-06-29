// frontend/src/components/contracts/RiskDashboard.tsx - UPDATED WITH AUTH
import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp, Calendar, FileText, ExternalLink, Eye, Filter } from 'lucide-react';

interface RiskDashboardData {
  summary: {
    totalContracts: number;
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
    averageRiskScore: number;
  };
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  recentHighRisk: Array<{
    documentId: string;
    documentName: string;
    riskScore: string;
    overallScore: number;
    analyzedAt: string;
    topRiskFactors: Array<{
      category: string;
      severity: string;
      description: string;
    }>;
  }>;
  topRiskFactors: Array<{
    category: string;
    count: number;
  }>;
  trends: {
    thisMonth: number;
    lastMonth: number;
  };
}

const RiskDashboard: React.FC = () => {
  const { getToken, isSignedIn } = useAuth(); // ADD AUTH HOOK
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<RiskDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    if (isSignedIn) {
      fetchDashboardData();
    }
  }, [isSignedIn]);

  const fetchDashboardData = async () => {
    if (!isSignedIn) {
      setError('Please log in to view risk dashboard');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // GET AUTH TOKEN
      const token = await getToken();
      if (!token) {
        throw new Error('No authentication token - please log in again');
      }

      console.log('🔍 Fetching risk dashboard data for authenticated user');
      
      // MAKE AUTHENTICATED REQUEST
      const response = await fetch('https://legal-chat-ai.onrender.com/api/contracts/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed - please log in again');
        }
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Risk dashboard data loaded successfully');
      setDashboardData(data);
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // SHOW AUTH REQUIRED MESSAGE IF NOT SIGNED IN
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to view your risk dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading your risk dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Dashboard</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Risk Data Available</h3>
        <p className="text-gray-600">Upload and analyze contracts to see your risk dashboard.</p>
      </div>
    );
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return 'text-red-600 bg-red-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'HIGH': return <AlertTriangle className="h-5 w-5" />;
      case 'MEDIUM': return <AlertCircle className="h-5 w-5" />;
      case 'LOW': return <CheckCircle className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const trendDirection = dashboardData.trends.thisMonth > dashboardData.trends.lastMonth ? 'up' : 'down';
  const trendPercentage = dashboardData.trends.lastMonth > 0 
    ? Math.abs(((dashboardData.trends.thisMonth - dashboardData.trends.lastMonth) / dashboardData.trends.lastMonth) * 100)
    : 100;

  // Navigation handlers
  const handleContractClick = (documentId: string) => {
    navigate(`/contract-analysis/${documentId}`);
  };

  const handleRiskFilterClick = (riskLevel: 'all' | 'high' | 'medium' | 'low') => {
    setRiskFilter(riskLevel);
    // In a real app, you would filter the contract list based on this
  };

  // Filter recent high risk contracts based on current filter
  const filteredContracts = riskFilter === 'all' 
    ? dashboardData.recentHighRisk 
    : dashboardData.recentHighRisk.filter(contract => 
        contract.riskScore.toLowerCase() === riskFilter.toUpperCase()
      );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Risk Dashboard</h2>
          <p className="text-gray-600 text-sm mt-1">Personal contract risk analysis overview</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <TrendingUp className="h-4 w-4" />
          <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button 
          onClick={() => navigate('/contract-analysis')}
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Your Contracts</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.summary.totalContracts}</p>
              <p className="text-xs text-blue-600 mt-1">Click to upload more</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </button>

        <button 
          onClick={() => handleRiskFilterClick('high')}
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md hover:border-red-300 transition-all duration-200 cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-3xl font-bold text-red-600">{dashboardData.summary.highRiskCount}</p>
              <p className="text-xs text-red-600 mt-1">Click to filter</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </button>

        <button 
          onClick={() => handleRiskFilterClick('medium')}
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md hover:border-yellow-300 transition-all duration-200 cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medium Risk</p>
              <p className="text-3xl font-bold text-yellow-600">{dashboardData.summary.mediumRiskCount}</p>
              <p className="text-xs text-yellow-600 mt-1">Click to filter</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-400" />
          </div>
        </button>

        <button 
          onClick={() => handleRiskFilterClick('low')}
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Risk Score</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.summary.averageRiskScore}</p>
              <p className="text-xs text-green-600 mt-1">Lower is better</p>
            </div>
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
        </button>
      </div>

      {/* Risk Distribution Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Risk Distribution</h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              Filter: {riskFilter === 'all' ? 'All Contracts' : `${riskFilter.charAt(0).toUpperCase() + riskFilter.slice(1)} Risk`}
            </span>
            {riskFilter !== 'all' && (
              <button 
                onClick={() => handleRiskFilterClick('all')}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: 'High Risk', count: dashboardData.riskDistribution.high, color: 'bg-red-500', hoverColor: 'hover:bg-red-600', filterKey: 'high' as const },
            { label: 'Medium Risk', count: dashboardData.riskDistribution.medium, color: 'bg-yellow-500', hoverColor: 'hover:bg-yellow-600', filterKey: 'medium' as const },
            { label: 'Low Risk', count: dashboardData.riskDistribution.low, color: 'bg-green-500', hoverColor: 'hover:bg-green-600', filterKey: 'low' as const }
          ].map((item) => {
            const percentage = dashboardData.summary.totalContracts > 0 
              ? (item.count / dashboardData.summary.totalContracts) * 100 
              : 0;
            
            const isSelected = riskFilter === item.filterKey;
            
            return (
              <button
                key={item.label}
                onClick={() => handleRiskFilterClick(item.filterKey)}
                className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-200 ${
                  isSelected ? 'bg-gray-50 border border-gray-300' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-24 text-sm text-gray-600 text-left">{item.label}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 cursor-pointer">
                  <div 
                    className={`${item.color} ${item.hoverColor} h-4 rounded-full transition-all duration-500 ${
                      isSelected ? 'shadow-lg' : ''
                    }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm text-gray-900 text-right flex items-center space-x-1">
                  <span>{item.count} ({Math.round(percentage)}%)</span>
                  {item.count > 0 && <ExternalLink className="h-3 w-3 text-gray-400" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contract List */}
      {filteredContracts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {riskFilter === 'all' ? 'Your Recent High-Risk Contracts' : `Your ${riskFilter.charAt(0).toUpperCase() + riskFilter.slice(1)} Risk Contracts`}
            </h3>
            <span className="text-sm text-gray-500">
              {filteredContracts.length} contract{filteredContracts.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="space-y-4">
            {filteredContracts.map((contract) => (
              <div 
                key={contract.documentId} 
                className="border border-red-200 rounded-lg p-4 bg-red-50 hover:bg-red-100 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleContractClick(contract.documentId)}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        {contract.documentName}
                      </button>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(contract.riskScore)}`}>
                        {getRiskIcon(contract.riskScore)}
                        <span className="ml-1">{contract.riskScore} RISK</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Risk Score: {contract.overallScore}/100
                    </p>
                    {contract.topRiskFactors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Top Risk Factors:</p>
                        <div className="flex flex-wrap gap-1">
                          {contract.topRiskFactors.map((factor, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              {factor.category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="mt-3 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContractClick(contract.documentId);
                        }}
                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Analysis
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/contract-analysis');
                        }}
                        className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Re-analyze
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(contract.analyzedAt).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => handleContractClick(contract.documentId)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 text-gray-400 hover:text-blue-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* View All Contracts Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/contract-analysis')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              View All Contracts
            </button>
          </div>
        </div>
      )}

      {/* Top Risk Factors */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Most Common Risk Factors</h3>
        <div className="space-y-3">
          {dashboardData.topRiskFactors.map((factor) => (
            <div key={factor.category} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{factor.category}</span>
              <span className="text-sm font-medium text-gray-900">{factor.count} contracts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trends */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Analysis Trends</h3>
        <div className="flex items-center space-x-6">
          <div>
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.trends.thisMonth}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Month</p>
            <p className="text-2xl font-bold text-gray-900">{dashboardData.trends.lastMonth}</p>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className={`h-5 w-5 ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`} />
            <span className={`text-sm font-medium ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trendDirection === 'up' ? '+' : '-'}{Math.round(trendPercentage)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskDashboard;