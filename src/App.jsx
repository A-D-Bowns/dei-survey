// src/App.jsx
import "./index.css";
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { SurveyProvider, useSurvey } from "./store/surveyStore.jsx";
import DevToolbar from "./components/DevToolbar.jsx";

/* ---------- PRE / CORE ---------- */
import Welcome from "./pages/pre/Welcome.jsx";
import Consent from "./pages/pre/Consent.jsx";
import Stance from "./pages/pre/Stance.jsx";
import PreStanceText from "./pages/pre/PreStanceText.jsx";
import PreDeiStance from "./pages/pre/PreDeiStance.jsx";
import InfoSupport from "./pages/pre/InfoSupport.jsx";
import StrengthSupport from "./pages/pre/StrengthSupport.jsx";
import InfoOppose from "./pages/pre/InfoOppose.jsx";
import StrengthOppose from "./pages/pre/StrengthOppose.jsx";
import WarmIn from "./pages/pre/Warm-In.jsx";
import TraitsIn from "./pages/pre/Traits-In.jsx";
import WarmOut from "./pages/pre/Warm-Out.jsx";
import TraitsOut from "./pages/pre/Traits-Out.jsx";
import Complexity from "./pages/pre/Complexity.jsx";
import DeliberationIntro from "./pages/pre/DeliberationIntro.jsx";

/* ---------- CHAT BRANCH ---------- */
import Chat from "./pages/Chat.jsx"; // redirector → /chat/socratic | /chat/perspective | /control/...
import SocraticChat from "./pages/Chat/SocraticChat.jsx";
import PerspectiveChat from "./pages/Chat/PerspectiveChat.jsx";
import ChatSatisfaction from "./pages/Chat/ChatSatisfaction.jsx";

/* ---------- CONTROL BRANCH ---------- */
import ControlLikertPre from "./pages/Control/ControlLikertPre.jsx";
import ControlComments from "./pages/Control/ControlComments.jsx";
import ControlLikertPost from "./pages/Control/ControlLikertPost.jsx";
import ControlTaskSatisfaction from "./pages/Control/ControlTaskSatisfaction.jsx";

/* ---------- POST / DEMOGRAPHICS ---------- */
import PostOpenness from "./pages/post/PostOpeness.jsx";
import PostDeiStance from "./pages/post/PostDeiStance.jsx";
import PostRace from "./pages/post/PostRace.jsx";
import PostEducation from "./pages/post/PostEducation.jsx";
import PostEmployment from "./pages/post/PostEmployment.jsx";
import PostIncome from "./pages/post/PostIncome.jsx";
import PostZipCode from "./pages/post/PostZipCode.jsx"; // filename you showed
import PostDeviceBrowser from "./pages/post/PostDeviceBrowser.jsx";

/* ---------- DONE ---------- */
import Done from "./pages/Done.jsx";

/* --- Optional: ?reset=1 to clear state/localStorage --- */
function AppResetWatcher() {
  const { resetAll } = useSurvey();
  const loc = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const q = new URLSearchParams(loc.search);
    if (q.get("reset") === "1") {
      try {
        if (typeof resetAll === "function") resetAll();
        localStorage.removeItem("survey_answers");
        localStorage.removeItem("survey_condition");
        localStorage.removeItem("condition");
        localStorage.removeItem("participant_id");
      } catch {
        // ignore
      }
      q.delete("reset");
      const suffix = q.toString();
      nav(loc.pathname + (suffix ? `?${suffix}` : ""), { replace: true });
    }
  }, [loc.pathname, loc.search, nav, resetAll]);

  return null;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ---------- PRE FLOW ---------- */}
      <Route path="/" element={<Welcome />} />
      <Route path="/consent" element={<Consent />} />
      <Route path="/pre/stance" element={<Stance />} />
      <Route path="/pre/stance-text" element={<PreStanceText />} />
      <Route path="/pre/dei-stance" element={<PreDeiStance />} />
      <Route path="/pre/info-support" element={<InfoSupport />} />
      <Route path="/pre/strength-support" element={<StrengthSupport />} />
      <Route path="/pre/info-oppose" element={<InfoOppose />} />
      <Route path="/pre/strength-oppose" element={<StrengthOppose />} />
      <Route path="/pre/warm-in" element={<WarmIn />} />
      <Route path="/pre/traits-in" element={<TraitsIn />} />
      <Route path="/pre/warm-out" element={<WarmOut />} />
      <Route path="/pre/traits-out" element={<TraitsOut />} />
      <Route path="/pre/complexity" element={<Complexity />} />
      <Route path="/pre/deliberation-intro" element={<DeliberationIntro />} />

      {/* ---------- CHAT BRANCH ---------- */}
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/socratic" element={<SocraticChat />} />
      <Route path="/chat/perspective" element={<PerspectiveChat />} />
      <Route path="/chat/satisfaction" element={<ChatSatisfaction />} />

      {/* ---------- CONTROL BRANCH ---------- */}
      <Route path="/control/likert-pre" element={<ControlLikertPre />} />
      <Route path="/control/comments" element={<ControlComments />} />
      <Route path="/control/likert-post" element={<ControlLikertPost />} />
      <Route path="/control/satisfaction" element={<ControlTaskSatisfaction />} />

      {/* ---------- POST / DEMOGRAPHICS ---------- */}
      {/* Post-satisfaction → openness → DEI stance */}
      <Route path="/post/openness" element={<PostOpenness />} />
      <Route path="/post/dei-stance" element={<PostDeiStance />} />
      <Route path="/post/race" element={<PostRace />} />
      <Route path="/post/education" element={<PostEducation />} />
      <Route path="/post/employment" element={<PostEmployment />} />
      <Route path="/post/income" element={<PostIncome />} />
      <Route path="/post/zip" element={<PostZipCode />} />
      <Route path="/post/device-browser" element={<PostDeviceBrowser />} />

      {/* ---------- DONE ---------- */}
      <Route path="/done" element={<Done />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <SurveyProvider>
      <BrowserRouter>
        <AppResetWatcher />
        <DevToolbar />
        <AppRoutes />
      </BrowserRouter>
    </SurveyProvider>
  );
}
