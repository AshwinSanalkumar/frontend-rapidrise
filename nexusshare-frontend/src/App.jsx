import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/common/ToastContent"; // Your new global context
import MainLayout from "./components/layout/MainLayout"; 
import Dashboard from "./pages/private/Dashboard";
import MyFiles from "./pages/private/MyFiles";
import SharedLinks from "./pages/private/SharedLinks";  
import FileExplorer from "./pages/private/FileExplorer";  
import FileDetailsPage from "./pages/private/FileDetailsPage";
import Bin from "./pages/private/Bin";
import Profile from "./pages/private/Profie";
import EditProfile from "./pages/private/EditProfile";
import ChangePassword from "./pages/auth/ChangePassword";
import FolderDetail from "./pages/private/FolderDetailsPage";
import Landing from "./pages/public/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/private/not-found";
import FavoritesPage from "./pages/private/FavoritesPage";
import ManageStorage from "./pages/private/ManageStorage";
import SharedFileView from "./pages/public/SharedFileView";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPasswordLink from "./pages/auth/ResetPasswordLink";
import DuplicateManager from "./pages/private/DuplicateManager";
import Recents from "./pages/private/Recents";

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