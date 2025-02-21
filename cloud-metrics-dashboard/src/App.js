import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AwsInputPage from "./pages/awsInputPage";
import Dashboard from "./pages/dashboard";
import LandingPage from "./pages/landingPage";
import LoadingAnimation from "./components/loadingAnimation";

function App() {
  const [metrics, setMetrics] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>}></Route>
        <Route path="/awsinput" element={<AwsInputPage></AwsInputPage>}></Route>
        <Route
          path="/load"
          element={<LoadingAnimation></LoadingAnimation>}
        ></Route>
        <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
