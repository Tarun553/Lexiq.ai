import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PenBoxIcon, Sparkle } from "lucide-react";

const WriteArticle = () => {
  return (
    <div className="flex justify-center min-h-screen w-full p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card - Input Form */}
        <Card className="h-[60vh]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkle className="size-5 text-blue-400" /> Write Article with AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Article Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter your article topic..."
                />
              </div>
              <div>
                <label
                  htmlFor="length"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Article Length
                </label>
                <select
                  id="length"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  defaultValue="short"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Generate Article
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Right Card - Generated Articles */}
        <Card className="h-[75vh] ">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Generated Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-10">
            <div className="flex items-center justify-center">
             <PenBoxIcon className="size-8"/>
            </div>
            
            <div className="text-gray-500 dark:text-gray-400 text-center py-8">
              Your generated articles will appear here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WriteArticle;
