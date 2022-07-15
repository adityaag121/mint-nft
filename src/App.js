import "./App.css";
import { useAuth } from "./Auth";
import Connect from "./components/Connect";
import NFTForm from "./components/NFTForm";

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="App flex flex-col justify-center h-full">
      {isAuthenticated ? <NFTForm /> : <Connect />}
    </div>
  );
}

export default App;
