import Authenticator from "./Authenticator";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "./HomePage";

function App() {
  return (
    <Authenticator></Authenticator>
  );
}

export default App
