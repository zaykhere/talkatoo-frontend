import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Chatpage from './Pages/Chatpage';

function App() {
  return (
    <div className="App">
      <Route path='/' component={Homepage} exact />
      <Route path = '/chat' component={Chatpage} exact />
    </div>
  );
}

export default App;
