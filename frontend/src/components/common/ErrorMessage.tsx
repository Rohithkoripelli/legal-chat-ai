import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'error' | 'warning' | 'info';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  onDismiss, 
  variant = 'error' 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: 'text-yellow-600',
          button: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: 'text-blue-600',
          button: 'bg-blue-100 hover:bg-blue-200 text-blue-800'
        };
      default:
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-600',
          button: 'bg-red-100 hover:bg-red-200 text-red-800'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`border rounded-lg p-4 ${styles.container}`}>
      <div className="flex items-start space-x-3">
        <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${styles.icon}`} />
        <div className="flex-1">
          <p className="text-sm font-medium">
            {variant === 'error' ? 'Error' : variant === 'warning' ? 'Warning' : 'Information'}
          </p>
          <p className="text-sm mt-1">{message}</p>
        </div>
        <div className="flex items-center space-x-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-colors ${styles.button}`}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className={`p-1 rounded-md transition-colors ${styles.button}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;