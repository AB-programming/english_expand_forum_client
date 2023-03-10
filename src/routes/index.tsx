import Home from "../pages/Home";
import Message from "../pages/Message";
import Mine from "../pages/Mine";

export default [
  {
    path: "/Home/:user",
    element: <Home />,
  },
  {
    path: "/message",
    element: <Message />,
  },
  {
    path: "/mine",
    element: <Mine />,
  },
  {
    path: "/",
    element: <Home />,
  },
];
