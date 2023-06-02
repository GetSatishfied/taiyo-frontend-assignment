import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidenav.css";

interface SidenavProps {
  activeLink: string;
//   onLinkClick: (link: string) => void;
}

const Sidebar: React.FC<SidenavProps> = ({ activeLink }) => {
    const navigate = useNavigate();
    const handleLinkClick = (link: string) => {
        navigate(`${link}`);
    }
  return (
    <div className="sidebar">
      <button
        onClick={() => handleLinkClick("contacts")}
        className={activeLink === "contacts" ? "active" : ""}
      >
        Contacts
      </button>
      <button
        onClick={() => handleLinkClick("charts-and-maps")}
        className={activeLink === "charts-and-maps" ? "active" : ""}
      >
        Charts and Maps
      </button>
    </div>
  );
};

export default Sidebar;
