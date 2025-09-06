import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CodingSessions from "./pages/CodingSessions";
import OutdoorActivities from "./pages/OutdoorActivities";
import RewardsStore from "./pages/RewardsStore";
import Leaderboard from "./pages/Leaderboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes with Sidebar */}
            <Route path="/*" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full bg-background">
                    {/* Global Header with Sidebar Toggle */}
                    <header className="fixed top-0 left-0 right-0 h-12 flex items-center border-b border-border/50 bg-background/80 backdrop-blur-sm z-50 px-4">
                      <SidebarTrigger />
                      <div className="ml-4 font-semibold text-foreground">
                        Code-to-Nature Dashboard
                      </div>
                    </header>
                    
                    <AppSidebar />
                    
                    <main className="flex-1 pt-12">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/coding" element={<CodingSessions />} />
                        <Route path="/activities" element={<OutdoorActivities />} />
                        <Route path="/rewards" element={<RewardsStore />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;