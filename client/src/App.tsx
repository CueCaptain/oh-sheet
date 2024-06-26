import Landing from "pages/Landing/Landing";
import NotFound from "pages/NotFound/NotFound";
import Controller from "pages/Timesheet/Controller";
import Operator from "pages/Timesheet/Operator";
import Stage from "pages/Timesheet/Stage";
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
    },
    {
        path:"/timesheet/operator",
        element: <Operator />
    },
    {
        path:"/timesheet/stage",
        element: <Stage />
    },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default App
