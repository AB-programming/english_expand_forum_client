import "./App.less";
import Header from "./components/Header";
import routes from "./routes";
import { useNavigate, useRoutes } from "react-router-dom";

function App() {
  const element = useRoutes(routes);
  const navigate = useNavigate();

  const changeRoute = (route: string) => {
    switch (route) {
      case "c1":
        navigate("/home/" + "null", {
          replace: true,
        });
        break;
      case "c2":
        navigate("/message", {
          replace: true,
        });
        break;
      case "c3":
        navigate("/mine", {
          replace: true,
        });
    }
  };

  return (
    <div>
      <div className={"header"}>
        <Header router={changeRoute} />
      </div>
      <div className={"body"}>{element}</div>
    </div>
  );
}

export default App;
