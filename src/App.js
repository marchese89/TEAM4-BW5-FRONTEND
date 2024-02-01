import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/Register";
import Login from "./components/Login";
import AreaProtetta from "./components/AreaProtetta";
import Clienti from "./components/Clienti";
import DettagliCliente from "./components/DettagliCliente";
import Province from "./components/Province";
import Comuni from "./components/Comuni";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="area_protetta" element={<AreaProtetta />}>
            <Route path="clienti" element={<Clienti />} />
            <Route
              path="clienti/dettagli/:idCliente"
              element={<DettagliCliente />}
            />
            <Route path="province" element={<Province />} />
            <Route path="comuni" element={<Comuni />} />
          </Route>

          {/* 
          <Route index element={<Home />} />
          <Route path="jobs/" element={<Jobs />} />
          <Route path="in/me/" element={<Profile />} />
          <Route path="profile/:idProfile" element={<Profile />} />
          <Route path="rete/" element={<Rete />} />
          <Route
            path="in/me/details/experience/"
            element={<ExperienceToModify />}
          /> 
          */}
          {/* <Route path="in/me/details/esperienze" element={<Esperienzepage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
