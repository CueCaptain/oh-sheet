import Landing from "pages/Landing/Landing";
import NotFound from "pages/NotFound/NotFound";
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
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    )
}

export default App
