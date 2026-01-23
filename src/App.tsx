import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Exercises from "./pages/Exercises";
import Workouts from "./pages/Workouts";
import Programs from "./pages/Programs";
import WorkoutSession from "./pages/WorkoutSession";
import Analytics from "./pages/Analytics";
import AIAnalytics from "./pages/AIAnalytics";
import Calendar from "./pages/Calendar";
import DexaScans from "./pages/DexaScans";
import Imports from "./pages/Imports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
            <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
            <Route path="/programs" element={<ProtectedRoute><Programs /></ProtectedRoute>} />
            <Route path="/session/:id?" element={<ProtectedRoute><WorkoutSession /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/ai-analytics" element={<ProtectedRoute><AIAnalytics /></ProtectedRoute>} />
            <Route path="/dexa" element={<ProtectedRoute><DexaScans /></ProtectedRoute>} />
            <Route path="/imports" element={<ProtectedRoute><Imports /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
