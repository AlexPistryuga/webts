import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import './App.css';
// import { useEffect } from 'react';
// import { fetchEspDevices } from './graphql/query/fetchEspDevices.query';

function App() {

  /*
  const retrieveEspDevices = async () => {
    const result = await fetchEspDevices()
    console.log(result)
  } 

  useEffect(() => {
    retrieveEspDevices()
    //fetchEspDevices().then((response) => console.log(response))
    console.log('privet')
  }, [])
  */

  

  return (
    <Router>
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/main" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
