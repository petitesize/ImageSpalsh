import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// React.StrictMode 제거 시 console 디버그 로그 한 번만 찍힌다.
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
