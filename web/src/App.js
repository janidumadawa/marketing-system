import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Ads from "./pages/Ads";
import AuthPage from "./pages/AuthPage";
import ClientsAnalysis from "./pages/ClientsAnalysis";
import AddOldClient from "./pages/AddOldClient";
import OldClients from "./pages/OldClients";
import AddAdvertisement from "./pages/AddAdvertisement";
import AddTarget from "./pages/AddTarget";
import ManageTargets from "./pages/ManageTargets";
import ProtectedRoute from "./components/ProtectedRoute";



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          } />
          <Route path="/ads" element={
            <ProtectedRoute>
              <Ads />
            </ProtectedRoute>
          } />
          <Route path="/old-clients" element={
            <ProtectedRoute>
              <OldClients />
            </ProtectedRoute>
          } />
          <Route path="/clients-analysis" element={
            <ProtectedRoute>
              <ClientsAnalysis />
            </ProtectedRoute>
          } />
          <Route path="/add-client" element={
            <ProtectedRoute>
              <AddOldClient />
            </ProtectedRoute>
          } />
          <Route path="/add-advertisement" element={
            <ProtectedRoute>
              <AddAdvertisement />
            </ProtectedRoute>
          } />
          <Route path="/add-target" element={
            <ProtectedRoute>
              <AddTarget />
            </ProtectedRoute>
          } />
          <Route path="/manage-targets" element={
            <ProtectedRoute>
              <ManageTargets />
            </ProtectedRoute>
          } />


        </Routes>

      </div>
    </Router>
  );
}

export default App;