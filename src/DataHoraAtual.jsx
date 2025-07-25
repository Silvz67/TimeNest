import React, { useEffect, useState } from "react";

export default function DataHoraAtual() {
  const [agora, setAgora] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      color: "#ff3385",
      fontSize: "1.1rem",
      marginBottom: "1rem",
      letterSpacing: "1px"
    }}>
      {agora.toLocaleDateString()} {agora.toLocaleTimeString()}
    </div>
  );
}