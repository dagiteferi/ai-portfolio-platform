import React, { useState, useEffect } from 'react';
import Pages from './components/pages/Pages';
import SplashScreen from './components/SplashScreen';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the delay as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {loading ? <SplashScreen /> : <Pages />}
    </div>
  );
}

export default App;
