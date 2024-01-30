import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/Register";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="register" element={<Register />} />
          {/* <Route index element={<Home />} />
          <Route path="jobs/" element={<Jobs />} />
          <Route path="in/me/" element={<Profile />} />
          <Route path="profile/:idProfile" element={<Profile />} />
          <Route path="rete/" element={<Rete />} />
          <Route
            path="in/me/details/experience/"
            element={<ExperienceToModify />}
          /> */}
          {/* <Route path="in/me/details/esperienze" element={<Esperienzepage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
