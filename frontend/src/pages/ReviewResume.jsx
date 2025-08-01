import React, { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  FileText,
  Upload,
  X,
  Download,
  Star,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [resume, setResume] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [review, setReview] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const { getToken } = useAuth();

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setResume(file);
      setPreview(URL.createObjectURL(file));
      setReview(null);
    } else if (file) {
      toast.error("Please upload a PDF file");
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
    if (file && file.type === "application/pdf") {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setResume(file);
      setPreview(URL.createObjectURL(file));
      setReview(null);
    } else if (file) {
      toast.error("Please upload a PDF file");
    }
  }, []);

  const handleRemoveResume = () => {
    setResume(null);
    setPreview(null);
    setReview(null);
  };

  const handleReviewResume = async (e) => {
    e.preventDefault();
    if (!resume) {
      toast.error("Please upload a resume first");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    if (jobDescription.trim()) {
      formData.append("jobDescription", jobDescription);
    }

    setIsProcessing(true);
    try {
      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        const transformedData = {
          ...data.data,
          overallAssessment: "Your resume has been analyzed. Here are the key findings:",
          strengths: {
            technicalSkills: {
              description: "Technical Skills",
              examples: data.data.strengths || []
            }
          },
          areasForImprovement: {
            formatting: data.data.weaknesses?.filter(w => w.includes("formatting") || w.includes("spacing")),
            content: data.data.weaknesses?.filter(w => !w.includes("formatting") && !w.includes("spacing"))
          },
          actionableRecommendations: {
            immediateActions: data.data.suggestions?.slice(0, 3) || [],
            contentEnhancements: data.data.suggestions?.slice(3, 6) || [],
            writingImprovements: data.data.suggestions?.slice(6) || []
          },
          priorityLevels: {
            high: data.data.suggestions?.slice(0, 2) || [],
            medium: data.data.suggestions?.slice(2, 4) || [],
            low: data.data.suggestions?.slice(4) || []
          }
        };
        
        setReview(transformedData);
        toast.success("Resume reviewed successfully!");
      } else {
        throw new Error(data.message || "Failed to review resume");
      }
    } catch (error) {
      console.error("Error reviewing resume:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to review resume. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadReport = () => {
    if (!review) return;

    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(review, null, 2)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = `resume-review-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Report downloaded successfully!");
  };

  const renderPriorityBadge = (priority) => {
    const priorityColors = {
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    };
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          priorityColors[priority] || "bg-gray-100 text-gray-800"
        }`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const ProgressBar = ({ score }) => {
    const getColor = (score) => {
      if (score >= 80) return "bg-green-500";
      if (score >= 60) return "bg-blue-500";
      if (score >= 40) return "bg-yellow-500";
      return "bg-red-500";
    };

    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
        <div
          className={`h-2.5 rounded-full ${getColor(score)}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card - Upload Form */}
        <Card className="h-[70vh] sticky top-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="size-5 text-indigo-400" /> Resume Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleReviewResume}
              className="h-full flex flex-col"
            >
              <div
                className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center ${
                  isDragging
                    ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <FileText className="size-16 text-indigo-400 mb-4" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {resume?.name || "Resume.pdf"}
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
                      </label>{" "}
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
                  disabled={isProcessing}
                />
              </div>

              <button
                type="submit"
                disabled={!resume || isProcessing}
                className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing...</span>
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
        <Card className="h-full overflow-hidden">
          <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                Resume Analysis
              </CardTitle>
              {review?.score !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {review.score}
                      <span className="text-lg text-gray-500 dark:text-gray-400">
                        /100
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Overall Score
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <Star className="size-8 text-yellow-500 fill-current" />
                  </div>
                </div>
              )}
            </div>
            {review?.score && <ProgressBar score={review.score} />}
          </CardHeader>
          <CardContent className="h-full overflow-y-auto p-0">
            {review ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {/* Overall Assessment */}
                {review.overallAssessment && (
                  <div className="p-6 bg-white dark:bg-gray-900">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <svg
                        className="size-5 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      Overall Assessment
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {review.overallAssessment}
                    </p>
                  </div>
                )}

                {/* Strengths */}
                {review.strengths &&
                  Object.keys(review.strengths).length > 0 && (
                    <div className="p-6 bg-white dark:bg-gray-900">
                      <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                        <svg
                          className="size-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        Key Strengths
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(review.strengths).map(
                          ([key, section]) => (
                            <div
                              key={key}
                              className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
                            >
                              <h4 className="font-medium text-green-800 dark:text-green-200">
                                {section.description}
                              </h4>
                              <ul className="mt-2 space-y-1">
                                {section.examples.map((example, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-green-700 dark:text-green-300 flex items-start"
                                  >
                                    <span className="text-green-500 mr-2">
                                      •
                                    </span>
                                    <span>{example}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Areas for Improvement */}
                {review.areasForImprovement &&
                  Object.keys(review.areasForImprovement).length > 0 && (
                    <div className="p-6 bg-white dark:bg-gray-900">
                      <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                        <svg
                          className="size-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          ></path>
                        </svg>
                        Areas for Improvement
                      </h3>
                      <div className="space-y-4">
                        {Object.entries(review.areasForImprovement).map(
                          ([area, items]) => (
                            <div
                              key={area}
                              className="border-l-4 border-amber-500 pl-3 py-1"
                            >
                              <h4 className="font-medium text-amber-800 dark:text-amber-200">
                                {area.replace(/([A-Z])/g, " $1").trim()}
                              </h4>
                              <ul className="mt-1 space-y-1">
                                {items.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-amber-700 dark:text-amber-300 flex items-start"
                                  >
                                    <span className="text-amber-500 mr-2">
                                      •
                                    </span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Action Items */}
                {review.actionableRecommendations && (
                  <div className="p-6 bg-white dark:bg-gray-900">
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2">
                      <svg
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        ></path>
                      </svg>
                      Recommended Actions
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(review.actionableRecommendations).map(
                        ([category, actions]) => (
                          <div
                            key={category}
                            className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg"
                          >
                            <h4 className="font-medium text-blue-800 dark:text-blue-200">
                              {category
                                .split(/(?=[A-Z])/)
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                            </h4>
                            <ul className="mt-2 space-y-2">
                              {actions.map((action, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm text-blue-700 dark:text-blue-300 flex items-start"
                                >
                                  <span className="text-blue-500 mr-2">•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Priority Items */}
                {review.priorityLevels && (
                  <div className="p-6 bg-white dark:bg-gray-900">
                    <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-2">
                      <svg
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        ></path>
                      </svg>
                      Priority Items
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(review.priorityLevels).map(
                        ([priority, items]) => (
                          <div
                            key={priority}
                            className="border rounded-lg overflow-hidden"
                          >
                            <div
                              className={`px-4 py-2 ${
                                priority === "high"
                                  ? "bg-red-50 dark:bg-red-900/30"
                                  : priority === "medium"
                                  ? "bg-yellow-50 dark:bg-yellow-900/30"
                                  : "bg-blue-50 dark:bg-blue-900/30"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">
                                  {priority.charAt(0).toUpperCase() +
                                    priority.slice(1)}{" "}
                                  Priority
                                </h4>
                                {renderPriorityBadge(priority)}
                              </div>
                            </div>
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                              {items.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <FileText className="size-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  No Review Yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upload your resume to get detailed analysis and improvement
                  suggestions.
                </p>
              </div>
            )}
          </CardContent>
          {review && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={handleDownloadReport}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Download className="size-4" />
                Download Full Report
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ReviewResume;
