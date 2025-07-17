import React, { useState, useEffect } from 'react';
import Pages from './components/pages/Pages';
import SkeletonLoader from './components/Splash/SkeletonLoader';

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
      {loading ? <SkeletonLoader /> : <Pages />}
    </div>
  );
}

export default App;
