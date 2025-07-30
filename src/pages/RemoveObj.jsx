import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ImageIcon, Upload, X, Download, Eraser } from "lucide-react";

const RemoveObj = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState(null);
  const [isErasing, setIsErasing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResultImage(null);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResultImage(null);
    }
  }, []);

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
    setResultImage(null);
  };

  const handleProcessImage = async (e) => {
    e.preventDefault();
    if (!image) return;
    
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // For demo, we'll just use the same image
      setResultImage(preview);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `object-removed-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCanvasClick = (e) => {
    if (!isErasing || !preview) return;
    // In a real implementation, this would handle the object removal logic
    console.log('Erasing at position:', e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  return (
    <div className="flex justify-center min-h-screen w-full p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card - Upload and Edit Image */}
        <Card className="h-[70vh]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Eraser className="size-5 text-blue-400" /> Remove Object
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProcessImage} className="h-full flex flex-col">
              <div 
                className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center ${
                  isDragging ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleCanvasClick}
              >
                {preview ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="max-h-80 w-auto mx-auto object-contain cursor-crosshair"
                      style={{ pointerEvents: isErasing ? 'auto' : 'none' }}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="size-5 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="size-12 text-blue-400 mb-4" />
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <label 
                        htmlFor="image-upload" 
                        className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                      >
                        Click to upload
                      </label>{' '}
                      or drag and drop
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, JPEG (max. 5MB)
                    </p>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>
              
              {/* Brush Size Control */}
              {preview && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Brush Size: {brushSize}px
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsErasing(!isErasing)}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    isErasing 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  {isErasing ? 'Erasing...' : 'Erase Object'}
                </button>
                <button
                  type="submit"
                  disabled={!image || isProcessing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : 'Remove Object'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right Card - Result */}
        <Card className="h-[70vh]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Result
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full flex flex-col">
            {resultImage ? (
              <div className="flex-1 flex flex-col">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex-1 flex items-center justify-center">
                  <img 
                    src={resultImage} 
                    alt="Result with object removed" 
                    className="max-h-96 w-auto object-contain"
                    style={{ 
                      backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, #f3f4f6 25%, #f3f4f6 50%, #e5e7eb 50%, #e5e7eb 75%, #f3f4f6 75%, #f3f4f6 100%)', 
                      backgroundSize: '20px 20px' 
                    }}
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="size-4" />
                  Download Image
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                  <Eraser className="size-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No image processed yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Upload an image and remove objects to see the result here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RemoveObj;