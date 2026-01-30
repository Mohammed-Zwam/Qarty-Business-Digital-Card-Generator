import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './components/Auth';
import Shape from './components/Shape';
import Card from './pages/Card';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useRef, useState } from 'react';
import CreateDigitalCard from './pages/CreateDigitalCard';
import ManageDigitalCard from './pages/ManageDigitalCard';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';

function App() {
  const [viewAnimationCongrats, setViewAnimationCongrats] = useState(false);
  const dotLottieRef = useRef(null);

  const location = useLocation();
  useEffect(() => {
    if (viewAnimationCongrats) {
      dotLottieRef.current?.stop();
      dotLottieRef.current?.play();
      setTimeout(() => {
        setViewAnimationCongrats(false)
      }, 3000);
    }
  }, [viewAnimationCongrats]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, [location.pathname]);

  return (
    <div className='App'>
      <Shape classes="btm lft cir" />
      <Shape classes="rgt ctr sq" />
      <Shape classes="top ctr tr" />
      <Header />

      <div className='container min-h-100'>
        <Routes>
          <Route path='/' element={<Auth />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/card" element={<Card />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/create-card" element={<CreateDigitalCard setViewAnimationCongrats={setViewAnimationCongrats} />} />
            <Route path="/manage-card" element={<ManageDigitalCard />} />
          </Route>
          <Route path="/*" element={<NotFound />} />

        </Routes>
      </div>



      <div className='congrats-container' style={{ visibility: viewAnimationCongrats ? 'visible' : 'hidden' }}>
        <DotLottieReact
          src="https://lottie.host/9b1f3564-471c-4e73-a928-0326628c252c/xSSMYPYGn7.lottie"
          autoplay={false}
          speed={1.25}
          dotLottieRefCallback={(dotLottie) => {
            dotLottieRef.current = dotLottie;
          }} />
      </div>



      <Footer />
    </div>
  )
}

export default App
