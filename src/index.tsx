import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Use environment variable for API URL, fallback to proxy
const apiUrl = "http://localhost:8000";

const root = createRoot(document.getElementById("root")!);
root.render(<App api_url={apiUrl} />);
