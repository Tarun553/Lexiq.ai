import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PenBoxIcon, Sparkle } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState("short");

  const { getToken } = useAuth();

  const generateArticle = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    try {
      setLoading(true);
      const prompt = `Write an article about ${topic} with ${length} length`;

      const { data } = await axios.post(
        "/api/ai/generate-article",
        {
          prompt,
          length: length === "short" ? 300 : length === "medium" ? 600 : 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.content) {
        setArticles([{ content: data.content, prompt }, ...articles]);
        toast.success("Article generated successfully!");
      } else {
        throw new Error(data.message || "Failed to generate article");
      }
    } catch (error) {
      console.error("Error generating article:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate article"
      );
    } finally {
      setLoading(false);
    }
  };

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
            <form onSubmit={generateArticle} className="space-y-4">
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
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter your article topic..."
                  disabled={loading}
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
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  disabled={loading}
                >
                  <option value="short">Short (~300 words)</option>
                  <option value="medium">Medium (~600 words)</option>
                  <option value="long">Long (~1000 words)</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className={`w-full px-4 py-2 rounded-lg transition-colors ${
                  loading || !topic.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? "Generating..." : "Generate Article"}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Right Card - Generated Articles */}
        <Card className="h-[75vh] overflow-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Generated Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : articles.length > 0 ? (
              <div className="space-y-6">
                {articles.map((article, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <h3 className="font-semibold mb-2 text-lg">
                      {article.prompt}
                    </h3>
                    <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                      {article.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <PenBoxIcon className="size-12 mb-4 opacity-50" />
                <p>No articles generated yet.</p>
                <p className="text-sm mt-2">
                  Enter a topic and click "Generate Article" to get started.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WriteArticle;
