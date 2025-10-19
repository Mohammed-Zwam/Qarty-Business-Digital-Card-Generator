import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import UserProvider from './context/UserProvider.jsx';
import AlertProvider from './context/AlertProvider.jsx';



createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserProvider>
      <AlertProvider>
        <App />
      </AlertProvider>
    </UserProvider>
  </BrowserRouter>
)


