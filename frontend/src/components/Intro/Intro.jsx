// src/components/Intro.js
import React, { useEffect, useState } from "react";
import "./Intro.css";

const Intro = ({ onFinish }) => {
  const [stage, setStage] = useState("show-text"); // "show-text" → "hide-text" → "hide-bg"

  useEffect(() => {
    const textTimer = setTimeout(() => setStage("hide-text"), 2200);
    const bgTimer = setTimeout(() => setStage("hide-bg"), 3200);

    // trigger onFinish AFTER background fade finishes (4s total here)
    const finishTimer = setTimeout(() => onFinish, 7200);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(bgTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`intro-overlay ${stage === "hide-bg" ? "fade-out" : ""}`}>
  {stage !== "hide-bg" && (
    <h1 className={`intro-name ${stage === "hide-text" ? "fade-out-text" : ""}`}>
      Being eager Being me
    </h1>
  )}
</div>

  );
};

export default Intro;
