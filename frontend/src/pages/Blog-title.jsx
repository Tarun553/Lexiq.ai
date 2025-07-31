import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PenLine } from "lucide-react";

const BlogTitle = () => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");

  const handleGenerate = (e) => {
    e.preventDefault();
    // Blog title generation logic will go here
    alert(`Generating ${tone} blog title for: ${topic}`);
  };

  return (
    <div className="flex justify-center min-h-screen w-full p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card - Input Form */}
        <Card className="h-[60vh]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <PenLine className="size-5 text-green-400" /> Generate Blog Title
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Blog Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter your blog topic..."
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="tone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Tone
                </label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="humorous">Humorous</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Generate Titles
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Right Card - Generated Titles */}
        <Card className="h-[75vh]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Generated Blog Titles
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-10">
            <div className="flex items-center justify-center">
              <PenLine className="size-8 text-green-400" />
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-center py-8">
              Your generated blog titles will appear here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogTitle;
