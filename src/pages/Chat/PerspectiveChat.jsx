import { useNavigate } from "react-router-dom";
import ChatShell from "./ChatShell.jsx";

export default function PerspectiveChat() {
  const nav = useNavigate();
  return (
    <ChatShell
      condition="perspective"
      onDone={() => nav("/chat/satisfaction")}
    />
  );
}
