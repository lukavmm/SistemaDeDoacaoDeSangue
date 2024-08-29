import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../src/components/context/ThemeContext";
import { createRoot } from "react-dom/client";
import reportWebVitals from "../src/utils/reportWebVitals";

// Note: Remove the following line if you want to disable the API mocks. tft
// import "./mocks";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
