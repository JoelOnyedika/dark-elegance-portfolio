import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Case from "./pages/Case";
import NotFound from "./pages/NotFound";
import Curtain from "./components/Curtain";

const App = () => (
  <BrowserRouter>
    <Curtain />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/work/:slug" element={<Case />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
export default App;
