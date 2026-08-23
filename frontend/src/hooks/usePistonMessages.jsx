import { useState, useRef, useEffect } from "react";

function usePistonMessages(loading, messages) {
  const [message, setMessage] = useState(messages[0]);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!loading) {
      indexRef.current = 0;
      setMessage(messages[0]);
      return;
    }

    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % messages.length;
      setMessage(messages[indexRef.current]);
    }, 2000);

    return () => clearInterval(interval);
  }, [loading, messages]);

  return message;
}

export default usePistonMessages;