import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import AppLayout from "./components/Layout/AppLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Learn from "./pages/Learn/Learn.jsx";
import Practice from "./pages/Practice/Practice.jsx";
import Quests from "./pages/Quests/Quests.jsx";
import Leaderboards from "./pages/Leaderboards/Leaderboards.jsx";
import Shop from "./pages/Shop/Shop.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import LessonSession from "./pages/Lesson/LessonSession.jsx";
import Documentation from "./pages/Documentation/Documentation.jsx";
import TtsTestPage from "./pages/TtsTestPage/TtsTestPage.jsx";
import CompletionPreview from "./pages/CompletionPreview/CompletionPreview.jsx";
import ThemePreview from "./pages/ThemePreview/ThemePreview.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import { applyThemeToDocument, getActiveEquippedTheme } from "./services/userService.js";

function App() {
    useEffect(() => {
        // Apply active theme immediately on app startup
        const activeTheme = getActiveEquippedTheme();
        applyThemeToDocument(activeTheme);

        const handleUserUpdate = (e) => {
            const equipped = e.detail?.user?.equipped_theme;
            applyThemeToDocument(equipped);
        };

        window.addEventListener("duoclongo:user-updated", handleUserUpdate);
        return () => window.removeEventListener("duoclongo:user-updated", handleUserUpdate);
    }, []);

    return (

        <AuthProvider>
            <Routes>
                {/* Public routes & UI Test Environments */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/completion-preview" element={<CompletionPreview />} />
                <Route path="/theme-preview" element={<ThemePreview />} />

                {/* Authenticated routes guarded by ProtectedRoute */}
                <Route element={<ProtectedRoute />}>
                    {/* Focused lesson session & Unit Mastery routes (no sidebar) */}
                    <Route path="/lesson/:lessonId" element={<LessonSession />} />
                    <Route path="/unit/:unitId/mastery" element={<LessonSession />} />

                    {/* Application routes wrapped in global AppLayout (Sidebar + MobileNav) */}
                    <Route element={<AppLayout />}>
                        <Route path="/learn" element={<Learn />} />
                        <Route path="/practice" element={<Practice />} />
                        <Route path="/quests" element={<Quests />} />
                        <Route path="/leaderboards" element={<Leaderboards />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/documentation" element={<Documentation />} />
                        <Route path="/test-tts" element={<TtsTestPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;
