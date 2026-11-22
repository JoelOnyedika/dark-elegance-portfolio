import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";
import App from "./App";

if (matchMedia("(prefers-reduced-motion: reduce)").matches) document.documentElement.classList.add("rm");

createRoot(document.getElementById("root")!).render(<App />);
