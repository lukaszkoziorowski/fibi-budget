import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface NavigationProps {
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

const Navigation = ({ isCollapsed, onCollapsedChange }: NavigationProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/', name: 'Home', icon: HomeIcon },
    { path: '/transactions', name: 'Transactions', icon: ArrowsRightLeftIcon },
    { path: '/report', name: 'Report', icon: ChartBarIcon },
  ];

  return (
    <nav className={`fixed left-0 top-0 h-screen bg-surface shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-secondary">
          <div className="flex items-center justify-center">
            {isCollapsed ? (
              <span className="text-2xl font-bold text-primary">F</span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">Fibi</span>
                <span className="text-2xl font-bold text-content-primary">Budget</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 mb-1 transition-colors ${
                  isActive(item.path)
                    ? 'bg-secondary text-primary border-r-4 border-primary'
                    : 'text-content-secondary hover:bg-background'
                }`}
              >
                <Icon className="w-6 h-6 shrink-0" />
                {!isCollapsed && (
                  <span className="ml-3 text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Collapse Button */}
        <div className="p-4 border-t border-secondary">
          <button
            onClick={() => onCollapsedChange(!isCollapsed)}
            className="flex items-center justify-center w-full p-2 text-content-secondary bg-background hover:bg-secondary rounded-md transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-6 h-6" />
            ) : (
              <>
                <ChevronLeftIcon className="w-6 h-6" />
                <span className="ml-2 text-sm font-medium">Collapse menu</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 