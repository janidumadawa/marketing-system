import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Ads from "./pages/Ads";
import AuthPage from "./pages/AuthPage";
// import Analytics from './pages/Analytics';
// import AudioFiles from './pages/AudioFiles';
import ClientsAnalysis from "./pages/ClientsAnalysis";
import AddOldClient from "./pages/AddOldClient";

import OldClients from "./pages/OldClients";
import AddAdvertisement from "./pages/AddAdvertisement";
import AddTarget from "./pages/AddTarget";
import ManageTargets from "./pages/ManageTargets";

import GoToDashboard from "./pages/GoToDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/goto-dashboard" element={<GoToDashboard />} />
          {/* <Route path="/" element={<GoToDashboard />} /> */}
          <Route path="/auth" element={<AuthPage />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/ads" element={<Ads />} />

          <Route path="/old-clients" element={<OldClients />} />

          <Route path="/clients-analysis" element={<ClientsAnalysis />} />

          <Route path="/add-client" element={<AddOldClient />} />
          <Route path="/add-advertisement" element={<AddAdvertisement />} />
          <Route path="/add-target" element={<AddTarget />} />

          <Route path="/manage-targets" element={<ManageTargets />} />

   

        </Routes>
      </div>
    </Router>
  );
}

export default App;
