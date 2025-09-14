import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store/store';
import LoginPage from './components/LoginPage';
import './styles/global.css';
import { HomePage } from './components/HomePage';
import { AuthCallback } from './components/AuthCallBack';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />


            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;