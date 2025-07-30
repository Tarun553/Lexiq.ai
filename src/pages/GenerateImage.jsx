import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";

const GenerateImage = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");

  const handleGenerate = (e) => {
    e.preventDefault();
    // Image generation logic will go here
    alert(`Generating ${style} image with prompt: ${prompt}`);
  };

  return (
    <div className="flex justify-center min-h-screen w-full p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card - Input Form */}
        <Card className="h-[62vh]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <ImageIcon className="size-5 text-purple-400" /> Generate Image
              with AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label
                  htmlFor="prompt"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Image Description
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg h-32 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Describe the image you want to generate..."
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="style"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Style
                </label>
                <select
                  id="style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="realistic">Realistic</option>
                  <option value="cartoon">Cartoon</option>
                  <option value="anime">Anime</option>
                  <option value="watercolor">Watercolor</option>
                  <option value="pixel-art">Pixel Art</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Generate Image
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Right Card - Generated Images */}
        <Card className="h-[75vh]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Generated Images
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-10">
            <div className="flex items-center justify-center">
              <ImageIcon className="size-8 text-purple-400" />
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-center py-8">
              Your generated images will appear here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerateImage;
