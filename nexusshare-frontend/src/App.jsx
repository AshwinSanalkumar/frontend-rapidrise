import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ui/ToastContent"; // Your new global context
import MainLayout from "./components/layout/MainLayout"; 
import Dashboard from "./pages/Dashboard";
import MyFiles from "./pages/MyFiles";
import SharedLinks from "./pages/SharedLinks";  
import FileExplorer from "./pages/FileExplorer";  
import FileDetailsPage from "./pages/FileDetailsPage";
import Bin from "./pages/Bin";
import Profile from "./pages/Profie";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    /* Wrapping the entire App in the Provider */
    <ToastProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/files" element={<MyFiles />} />
          <Route path="/shared" element={<SharedLinks />} />
          <Route path="/file-explore" element={<FileExplorer />} />
          <Route path="/file-details" element={<FileDetailsPage />} />   
          <Route path="/profile" element={<Profile />} />  
          <Route path="/bin" element={<Bin />} />         
          <Route path="/profile-edit" element={<EditProfile />} /> 
          <Route path="/password-change" element={<ChangePassword />}/>
        </Route>
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;