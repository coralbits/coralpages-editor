import React from "react";
import { createRoot } from "react-dom/client";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import App from "./App";

// Prevent FontAwesome from adding its CSS since we did it manually above
config.autoAddCss = false;

// Use environment variable for API URL, fallback to proxy
const apiUrl = "http://localhost:8000";

const root = createRoot(document.getElementById("root")!);
root.render(<App api_url={apiUrl} />);
