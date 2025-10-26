import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import "./index.css";

import { createTheme, ThemeProvider } from "flowbite-react";

// To customize the theme refer to:
// https://flowbite-react.com/docs/customize/theme
const customTheme = createTheme({
  button: {
    color: {
      testColor: "bg-blue-500 hover:bg-red-600",
    },
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={customTheme}>
          <App />
        </ThemeProvider>
      </BrowserRouter>
      {/* uncomment the line below to use React Query Devtools */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </StrictMode>,
);
