// frontend/src/components/contracts/RiskDashboard.tsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp, Calendar, FileText } from 'lucide-react';

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
  const [dashboardData, setDashboardData] = useState<RiskDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('https://legal-chat-ai.onrender.com/api/contracts/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Risk Dashboard</h2>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <TrendingUp className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contracts</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.summary.totalContracts}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-3xl font-bold text-red-600">{dashboardData.summary.highRiskCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medium Risk</p>
              <p className="text-3xl font-bold text-yellow-600">{dashboardData.summary.mediumRiskCount}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Risk Score</p>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.summary.averageRiskScore}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Risk Distribution Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
        <div className="space-y-4">
          {[
            { label: 'High Risk', count: dashboardData.riskDistribution.high, color: 'bg-red-500' },
            { label: 'Medium Risk', count: dashboardData.riskDistribution.medium, color: 'bg-yellow-500' },
            { label: 'Low Risk', count: dashboardData.riskDistribution.low, color: 'bg-green-500' }
          ].map((item) => {
            const percentage = dashboardData.summary.totalContracts > 0 
              ? (item.count / dashboardData.summary.totalContracts) * 100 
              : 0;
            
            return (
              <div key={item.label} className="flex items-center space-x-3">
                <div className="w-24 text-sm text-gray-600">{item.label}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className={`${item.color} h-4 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm text-gray-900 text-right">
                  {item.count} ({Math.round(percentage)}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent High Risk Contracts */}
      {dashboardData.recentHighRisk.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent High-Risk Contracts</h3>
          <div className="space-y-4">
            {dashboardData.recentHighRisk.map((contract) => (
              <div key={contract.documentId} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-sm font-medium text-gray-900">{contract.documentName}</h4>
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
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(contract.analyzedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Risk Factors */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Risk Factors</h3>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Trends</h3>
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