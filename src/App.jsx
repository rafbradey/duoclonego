import { Routes, Route } from "react-router";
import AppLayout from "./components/Layout/AppLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import Learn from "./pages/Learn/Learn.jsx";
import Practice from "./pages/Practice/Practice.jsx";
import Quests from "./pages/Quests/Quests.jsx";
import Leaderboards from "./pages/Leaderboards/Leaderboards.jsx";
import Shop from "./pages/Shop/Shop.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import LessonSession from "./pages/Lesson/LessonSession.jsx";
import Documentation from "./pages/Documentation/Documentation.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";

function App() {
    return (
        <Routes>
            {/* Public landing page */}
            <Route path="/" element={<Home />} />

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
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
