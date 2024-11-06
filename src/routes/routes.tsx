import SidebarLayout from "@/layouts/sidebarLayout";
import AboutPage from "@/pages/About";
import HomePage from "@/pages/Home";
import { createBrowserRouter } from "react-router-dom";


const routes = createBrowserRouter([
    {
        path: "/",
        element: <SidebarLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/about",
                element: <AboutPage />
            }
        ]
    }
]);


export default routes;