import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store/store';
import LoginPage from './components/LoginPage';
import './styles/LoginPage.css';
import './styles/global.css';
import { HomePage } from './components/HomePage';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/dashboard"
              element={
                <HomePage />
              }
            />

            <Route
              path="/"
              element={
                <HomePage />
              }
            />

          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;