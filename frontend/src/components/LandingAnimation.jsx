import { useEffect } from "react";

const LandingAnimation = ({ onComplete }) => {
  useEffect(() => {
    const timeout = setTimeout(onComplete, 4000);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="landing-overlay" role="status" aria-live="polite" aria-label="Loading portfolio">
      <div className="landing-content">
        <p className="landing-kicker">Welcome</p>
        <h1 className="landing-title">Kunal Dhangar</h1>
        <p className="landing-subtitle">Crafting digital experiences</p>
        <div className="landing-loader" aria-hidden="true" />
      </div>
    </div>
  );
};

export default LandingAnimation;