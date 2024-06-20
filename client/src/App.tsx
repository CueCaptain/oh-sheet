import Landing from "pages/Landing/Landing";
import NotFound from "pages/NotFound/NotFound";
import Controller from "pages/Timesheet/Controller";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing/>,
        errorElement: <NotFound />,
    },
    {
        path:"/timesheet/controller",
        element: <Controller/>
    }
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default App
