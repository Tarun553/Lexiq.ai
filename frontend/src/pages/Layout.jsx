import React from "react";
import { Link, Outlet } from "react-router-dom";
import { UserButton, useUser } from '@clerk/clerk-react';
import { LogOut } from 'lucide-react';

const Layout = () => {
  const { user } = useUser();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 h-screen sticky top-0 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col">
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-6">AI Tools</h2>
          <nav className="space-y-2">
            <Link
              to="dashboard"
              className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Dashboard
            </Link>
            <Link
              to="write-article"
              className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Write Article
            </Link>
            <Link
              to="generate-image"
              className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Generate Image
            </Link>
            <Link
              to="blog-title"
              className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Blog Titles
            </Link>
            <Link
              to="remove-background"
              className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Remove Background
            </Link>
            <Link
              to="remove-object"
              className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Remove Object
            </Link>
            <Link
              to="review-resume"
              className="block px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Review Resume
            </Link>
          </nav>
        </div>

        {/* User Section */}
        <div className="border-t border-gray-300 dark:border-gray-700 pt-4 mt-4">
          {user && (
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <div className="relative">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: 'h-10 w-10',
                      avatarBox: 'h-full w-full',
                    }
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/'}
                className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;