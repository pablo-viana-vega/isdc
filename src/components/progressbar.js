import React, { useState, useEffect } from "react";

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 80 ? 0 : prevProgress + 10
      );
    }, 2000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "10px",
        backgroundColor: "#ddd",
        borderRadius: "5px",
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: "#4caf50",
          borderRadius: "5px",
          position: "absolute",
          transition: "width 0.5s ease-in",
        }}
      />
    </div>
  );
};
