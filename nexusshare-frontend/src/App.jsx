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
import FavoritesPage from "./pages/FavoritesPage";
import ManageStorage from "./pages/ManageStorage";
import SharedFileView from "./pages/SharedFileView";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordLink from "./pages/ResetPasswordLink";
import DuplicateManager from "./pages/DuplicateManager";
import Recents from "./pages/Recents";

function App() {
  return (
    <ToastProvider>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/404-not-found" element={<NotFound/>} />
        <Route path="/public/:shareId" element={<SharedFileView />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPasswordLink/>}/>

        <Route element={<MainLayout />}>
          {/* PRIVATE */}
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shared" element={<SharedLinks />} />
          <Route path="/favorites" element={<FavoritesPage />}/>
          <Route path="/bin" element={<Bin />} /> 
          <Route path="/recents" element={<Recents/>}/>

          <Route path="/assets" element={<FileExplorer />} />
          <Route path="/assets/details" element={<FolderDetail />}/>

          <Route path="/profile" element={<Profile />} /> 
          <Route path="/profile/update" element={<EditProfile />} /> 
          <Route path="/profile/update/credentials" element={<ChangePassword />}/>

          <Route path="/files" element={<MyFiles />} />
          <Route path="/files/details" element={<FileDetailsPage />} />   
 
          <Route path="/storage" element={<ManageStorage/>}/>
          <Route path="/storage/duplicates" element={<DuplicateManager/>}/>

        </Route>
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/404-not-found" replace />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;