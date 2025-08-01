import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ImageIcon, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImage = () => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);

  const { getToken } = useAuth();

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast.error("Please enter an image description");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, style },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.imageUrl) {
        setGeneratedImages([
          { url: data.imageUrl, prompt, style },
          ...generatedImages,
        ]);
        toast.success("Image generated successfully!");
      } else {
        throw new Error(data.message || "Failed to generate image");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate image. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
                  disabled={loading}
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
                  disabled={loading}
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
                disabled={loading || !prompt.trim()}
                className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  loading || !prompt.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  "Generate Image"
                )}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Right Card - Generated Images */}
        <Card className="h-[75vh] overflow-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Generated Images
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4 p-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            ) : generatedImages.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {generatedImages.map((image, index) => (
                  <div key={index} className="space-y-2">
                    <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/500x500?text=Image+not+found";
                        }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium">Style: {image.style}</p>
                      <p className="truncate">{image.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                <ImageIcon className="size-12 mb-4 opacity-50" />
                <p>No images generated yet.</p>
                <p className="text-sm mt-2">
                  Enter a description and click "Generate Image" to get started.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerateImage;
