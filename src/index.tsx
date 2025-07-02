import React from "react";
import { createRoot } from "react-dom/client";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import App from "./App";

// Prevent FontAwesome from adding its CSS since we did it manually above
config.autoAddCss = false;

// Use environment variable for API URL, fallback to proxy
const apiUrl = "http://localhost:8006";

const root = createRoot(document.getElementById("root")!);
// page name from pathname, like  `*/edit/{page_path}`
let page_name = "index";
let path = window.location.pathname;

if (path.split("/edit/").length > 1) {
  page_name = path.split("/edit/")[1];
}

root.render(<App api_url={apiUrl} page_name={page_name} />);
