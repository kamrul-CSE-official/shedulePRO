import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";

const Main = () => {
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
};

export default Main;
