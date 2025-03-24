import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const notificationTypes = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
    iconClass: 'text-green-500 dark:text-green-400'
  },
  error: {
    icon: AlertCircle,
    className: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
    iconClass: 'text-red-500 dark:text-red-400'
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
    iconClass: 'text-blue-500 dark:text-blue-400'
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300',
    iconClass: 'text-yellow-500 dark:text-yellow-400'
  }
};

export default function Notification({ 
  type = 'info', 
  message, 
  show = false, 
  autoHide = true, 
  duration = 5000,
  onClose 
}) {
  const [isVisible, setIsVisible] = useState(show);
  
  useEffect(() => {
    setIsVisible(show);
    
    if (show && autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, autoHide, duration, onClose]);
  
  if (!isVisible) return null;
  
  const { icon: Icon, className, iconClass } = notificationTypes[type] || notificationTypes.info;
  
  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm animate-slide-in">
      <div className={`flex items-start p-4 rounded-lg border shadow-md ${className}`}>
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconClass}`} />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          type="button"
          className="ml-4 inline-flex flex-shrink-0 items-center justify-center h-5 w-5 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// This exportable helper can be used to show notifications from anywhere
export function createNotificationSystem() {
  let notificationQueue = [];
  let subscribers = [];
  
  const notifySubscribers = () => {
    subscribers.forEach(callback => callback(notificationQueue[0] || null));
  };
  
  return {
    show: (message, type = 'info', duration = 5000) => {
      const id = Date.now().toString();
      const notification = { id, message, type, duration };
      
      notificationQueue.push(notification);
      if (notificationQueue.length === 1) {
        notifySubscribers();
      }
      
      return id;
    },
    
    remove: (id) => {
      if (notificationQueue.length > 0 && notificationQueue[0].id === id) {
        notificationQueue.shift();
        notifySubscribers();
      } else {
        notificationQueue = notificationQueue.filter(n => n.id !== id);
      }
    },
    
    subscribe: (callback) => {
      subscribers.push(callback);
      return () => {
        subscribers = subscribers.filter(cb => cb !== callback);
      };
    }
  };
}

// Create global notification system
export const notificationSystem = createNotificationSystem(); 