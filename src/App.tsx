// src/App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store/store';
import LoginPage from './components/LoginPage';
import './styles/LoginPage.css';
import './styles/global.css';


const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* 추후 다른 라우트들 추가 */}
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;