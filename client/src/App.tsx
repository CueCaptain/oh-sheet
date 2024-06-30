import Landing from "pages/Landing/Landing";
import WatchLiveStream from "pages/Livestream/WatchLiveStream";
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
        path:"/timesheet/",
        children: [
            {
                path:"controller",
                element: <Controller/> 
            },
            {
                path:"operator",
                element: <Operator />
            },
            {
                path:"stage",
                element: <Stage />
            },
        ]
    },
    {
        path:"/watch",
        element: <WatchLiveStream />
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
