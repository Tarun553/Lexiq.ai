import React from "react";
import Home from "./pages/Home";
import { ThemeProvider } from "./components/ui/theme-toggle";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import WriteArticle from "./pages/WriteArticle";
import GenerateImage from "./pages/GenerateImage";
import BlogTitle from "./pages/Blog-title";
import RemoveBg from "./pages/RemoveBg";
import RemoveObj from "./pages/RemoveObj";
import ReviewResume from "./pages/ReviewResume";
import Auth from "./pages/Auth";
import PrivateRoute from "./components/PrivateRoute";
const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/ai"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="write-article" element={<WriteArticle />} />
          <Route path="generate-image" element={<GenerateImage />} />
          <Route path="blog-title" element={<BlogTitle />} />
          <Route path="remove-background" element={<RemoveBg />} />
          <Route path="remove-object" element={<RemoveObj />} />
          <Route path="review-resume" element={<ReviewResume />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
