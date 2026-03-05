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
import FolderDetail from "./pages/FolderDetailsPage";
import Landing from "./pages/LandingPage";
import Login from "./pages/login";
import Register from "./pages/Register";
import NotFound from "./pages/not-found";

function App() {
  return (
    /* Wrapping the entire App in the Provider */
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/404-not-found" element={<NotFound/>} />
        <Route element={<MainLayout />}>

          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/files" element={<MyFiles />} />
          <Route path="/shared" element={<SharedLinks />} />
          <Route path="/file-explore" element={<FileExplorer />} />
          <Route path="/file-details" element={<FileDetailsPage />} />   
          <Route path="/profile" element={<Profile />} />  
          <Route path="/bin" element={<Bin />} />         
          <Route path="/profile-edit" element={<EditProfile />} /> 
          <Route path="/password-change" element={<ChangePassword />}/>
          <Route path="/folder-detail" element={<FolderDetail />}/>
        </Route>
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/404-not-found" replace />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;