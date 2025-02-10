import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Receive from './pages/Receive';
import Send from './pages/Send';
import History from './pages/History';
import Settings from './pages/Settings';
import Assets from './pages/Assets';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';
const PrivateRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) {
        return <Navigate to="/auth"/>;
    }
    return children;
};
function AppRoutes() {
    return (<Routes>
      <Route path="/auth" element={<Auth />}/>
      <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>}/>
      <Route path="/receive" element={<PrivateRoute><Layout><Receive /></Layout></PrivateRoute>}/>
      <Route path="/send" element={<PrivateRoute><Layout><Send /></Layout></PrivateRoute>}/>
      <Route path="/history" element={<PrivateRoute><Layout><History /></Layout></PrivateRoute>}/>
      <Route path="/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>}/>
      <Route path="/assets" element={<PrivateRoute><Layout><Assets /></Layout></PrivateRoute>}/>
    </Routes>);
}
function App() {
    return (<BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Toaster position="top-right"/>
            <AppRoutes />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>);
}
export default App;
