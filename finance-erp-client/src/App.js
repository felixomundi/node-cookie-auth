import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
const App = () => {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />        
        </Routes>
      </Router>
      <ToastContainer />
    </Fragment>
  );
};

export default App;
