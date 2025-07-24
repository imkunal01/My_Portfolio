import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ theme, toggleTheme, activeTab, handleTabClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link
          to="/"
          className={`navbar-link ${activeTab === "home" ? "active" : ""}`}
          onClick={() => handleTabClick("home")}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`navbar-link ${activeTab === "about" ? "active" : ""}`}
          onClick={() => handleTabClick("about")}
        >
          About
        </Link>
        <Link
          to="/works"
          className={`navbar-link ${activeTab === "works" ? "active" : ""}`}
          onClick={() => handleTabClick("works")}
        >
          Works
        </Link>
        <Link
          to="/chat"
          className={`navbar-link ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => handleTabClick("chat")}
        >
          Chat With me
        </Link>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
    </nav>
  );
};

export default Navbar;
