import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import Gouvernement from "./pages/Gouvernement";
import Services from "./pages/Services";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/gouvernement" element={<Gouvernement />} />
      <Route path="/securite" element={<Placeholder />} />
      <Route path="/justice" element={<Placeholder />} />
      <Route path="/economie" element={<Placeholder />} />
      <Route path="/sante" element={<Placeholder />} />
      <Route path="/services" element={<Services />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
