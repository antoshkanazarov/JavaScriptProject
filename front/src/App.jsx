import './App.css';
import Header from './components/header/Header.jsx';
import Container from './components/container/Container.jsx';
import Route from './modules/Route.js';
import { useState, useEffect, useCallback } from 'react';


function App() {
  /**
   * dropdown value relative
   * components: Header, Menu, ...
   */
  let [currentPath, setCurrentPath] = useState('/');

  const setPath = useCallback(async () => {
    let r = new Route();
    setCurrentPath(r.getUrl())
  }, []);

  useEffect(
    () => {setPath()}, [setPath]
  )

  return (
    <div className="App">
      <Header curPath={currentPath}/>

      <Container curPath={currentPath}></Container>
    </div>
  );
}

export default App;
