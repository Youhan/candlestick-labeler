import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./pages/Root";
import Help from "./pages/Help";
import ChartSingle from "./pages/ChartSingle";

import "./index.css";
import Home from "./pages/Home";

// add routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/chart/:id",
        element: <ChartSingle />,
      },
      {
        path: "/help",
        element: <Help />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
