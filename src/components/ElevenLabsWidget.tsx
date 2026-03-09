import { useEffect } from 'react';

export default function ElevenLabsWidget() {
  const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;

  useEffect(() => {
    if (!agentId) return;

    // Create the widget element if it doesn't exist
    if (!document.querySelector('elevenlabs-convai')) {
      const el = document.createElement('elevenlabs-convai');
      el.setAttribute('agent-id', agentId);
      document.body.appendChild(el);
    }

    return () => {
      const el = document.querySelector('elevenlabs-convai');
      if (el) el.remove();
    };
  }, [agentId]);

  return null;
}
