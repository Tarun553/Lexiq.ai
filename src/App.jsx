import React from "react";
import Home from "./pages/Home";
import { ThemeProvider } from "./components/ui/theme-toggle";

const App = () => {
  return (
    <ThemeProvider>
      <Home/>
    </ThemeProvider>
  );
};

export default App;
