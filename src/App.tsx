import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import { lazy, Suspense } from "react";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const Registration = lazy(() => import("./pages/Registration"));
const Requirements = lazy(() => import("./pages/Requirements"));
const Fees = lazy(() => import("./pages/Fees"));
const Centres = lazy(() => import("./pages/Centres"));
const Universities = lazy(() => import("./pages/Universities"));
const IJMBvsJAMB = lazy(() => import("./pages/IJMBvsJAMB"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const Contact = lazy(() => import("./pages/Contact"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminApplicationDetail = lazy(() => import("./pages/AdminApplicationDetail"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const LocationPage = lazy(() => import("./pages/LocationPage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const VerifyApplication = lazy(() => import("./pages/VerifyApplication"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <ScrollToTop />
          <main className="min-h-screen">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/ijmb-registration" element={<Registration />} />
                <Route path="/ijmb-admission-requirements" element={<Requirements />} />
                <Route path="/ijmb-fees" element={<Fees />} />
                <Route path="/ijmb-centres-in-nigeria" element={<Centres />} />
                <Route path="/universities-accepting-ijmb" element={<Universities />} />
                <Route path="/ijmb-vs-jamb" element={<IJMBvsJAMB />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/dashboard" element={<ProtectedRoute><ErrorBoundary><Dashboard /></ErrorBoundary></ProtectedRoute>} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/portal-admin" element={<AdminRoute><ErrorBoundary><AdminDashboard /></ErrorBoundary></AdminRoute>} />
                <Route path="/portal-admin/applications/:id" element={<AdminRoute><ErrorBoundary><AdminApplicationDetail /></ErrorBoundary></AdminRoute>} />
                <Route path="/ijmb-in-lagos" element={<LocationPage />} />
                <Route path="/ijmb-in-abuja" element={<LocationPage />} />
                <Route path="/ijmb-in-ibadan" element={<LocationPage />} />
                <Route path="/ijmb-in-ilorin" element={<LocationPage />} />
                <Route path="/ijmb-in-port-harcourt" element={<LocationPage />} />
                <Route path="/ijmb-in-benin" element={<LocationPage />} />
                <Route path="/ijmb-in-kano" element={<LocationPage />} />
                <Route path="/ijmb-in-kaduna" element={<LocationPage />} />
                <Route path="/ijmb-in-jos" element={<LocationPage />} />
                <Route path="/ijmb-in-enugu" element={<LocationPage />} />
                <Route path="/ijmb-in-owerri" element={<LocationPage />} />
                <Route path="/ijmb-in-aba" element={<LocationPage />} />
                <Route path="/ijmb-in-uyo" element={<LocationPage />} />
                <Route path="/ijmb-in-akure" element={<LocationPage />} />
                <Route path="/ijmb-in-ado-ekiti" element={<LocationPage />} />
                <Route path="/ijmb-in-abeokuta" element={<LocationPage />} />
                <Route path="/ijmb-in-osogbo" element={<LocationPage />} />
                <Route path="/ijmb-in-minna" element={<LocationPage />} />
                <Route path="/ijmb-in-lokoja" element={<LocationPage />} />
                <Route path="/ijmb-in-makurdi" element={<LocationPage />} />
                <Route path="/ijmb-in-:city" element={<LocationPage />} />
                <Route path="/verify/:applicationId" element={<VerifyApplication />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <StickyMobileCTA />
          <WhatsAppButton />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
