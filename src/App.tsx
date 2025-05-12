
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FitAssistantProvider } from "@/contexts/FitAssistantContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateGarment from "./pages/garment/CreateGarment";
import MeasurementsGarment from "./pages/garment/MeasurementsGarment";
import FitGarment from "./pages/garment/FitGarment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FitAssistantProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/garment/create" element={<CreateGarment />} />
            <Route path="/garment/create/measurements" element={<MeasurementsGarment />} />
            <Route path="/garment/create/fit" element={<FitGarment />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FitAssistantProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
