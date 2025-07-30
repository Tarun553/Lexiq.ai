import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, Upload, X, Download, Star, Sparkles } from "lucide-react";

const ReviewResume = () => {
  const [resume, setResume] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [review, setReview] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
      setPreview(URL.createObjectURL(file));
      setReview(null);
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
    if (file && file.type === 'application/pdf') {
      setResume(file);
      setPreview(URL.createObjectURL(file));
      setReview(null);
    }
  }, []);

  const handleRemoveResume = () => {
    setResume(null);
    setPreview(null);
    setReview(null);
  };

  const handleReviewResume = async (e) => {
    e.preventDefault();
    if (!resume) return;
    
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Mock review data
      setReview({
        score: 85,
        strengths: [
          "Strong technical skills in React and Node.js",
          "Good project experience",
          "Clear work history"
        ],
        areasForImprovement: [
          "Could include more metrics in work experience",
          "Consider adding a skills section",
          "Education section could be more detailed"
        ],
        suggestions: [
          "Tailor your resume to include keywords from the job description",
          "Add more quantifiable achievements",
          "Consider adding a summary section"
        ]
      });
    } catch (error) {
      console.error('Error reviewing resume:', error);
      alert('Failed to review resume. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadReport = () => {
    if (!review) return;
    
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(review, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = `resume-review-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex justify-center min-h-screen w-full p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card - Upload Resume */}
        <Card className="h-[70vh]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="size-5 text-indigo-400" /> Resume Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReviewResume} className="h-full flex flex-col">
              <div 
                className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center ${
                  isDragging ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <FileText className="size-16 text-indigo-400 mb-4" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {resume?.name || 'Resume.pdf'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      {(resume?.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      className="px-3 py-1 text-sm bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="size-12 text-indigo-400 mb-4" />
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <label 
                        htmlFor="resume-upload" 
                        className="font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer"
                      >
                        Click to upload
                      </label>{' '}
                      or drag and drop
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PDF only (max. 5MB)
                    </p>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              {/* Job Description */}
              <div className="mt-4">
                <label 
                  htmlFor="job-description" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Job Description (Optional)
                </label>
                <textarea
                  id="job-description"
                  rows="3"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Paste the job description to get tailored feedback..."
                />
              </div>

              <button
                type="submit"
                disabled={!resume || isProcessing}
                className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Review My Resume
                  </>
                )}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Right Card - Review Results */}
        <Card className="h-[70vh]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>Review Results</span>
              {review && (
                <div className="flex items-center gap-2 text-yellow-500">
                  <Star className="size-5 fill-current" />
                  <span className="text-lg font-semibold">{review.score}/100</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full flex flex-col">
            {review ? (
              <div className="flex-1 overflow-y-auto pr-2">
                <div className="space-y-6">
                  {/* Strengths */}
                  <div>
                    <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Strengths
                    </h3>
                    <ul className="space-y-2 pl-7">
                      {review.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300 relative before:content-['•'] before:absolute before:-left-4 before:text-green-500">
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div>
                    <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2">
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2 pl-7">
                      {review.areasForImprovement.map((area, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300 relative before:content-['•'] before:absolute before:-left-4 before:text-amber-500">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Suggestions
                    </h3>
                    <ul className="space-y-2 pl-7">
                      {review.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-700 dark:text-gray-300 relative before:content-['•'] before:absolute before:-left-4 before:text-blue-500">
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={handleDownloadReport}
                  className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="size-4" />
                  Download Full Report
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                  <FileText className="size-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No resume reviewed yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Upload your resume to get a detailed review and improvement suggestions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewResume;