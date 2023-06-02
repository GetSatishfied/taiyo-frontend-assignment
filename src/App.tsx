import React, { useState } from "react";
import Sidebar from "./components/Sidenav";
import ContactForm from "./components/ContactForm";
import ChartsAndMapsPage from "./components/ChartsAndMapsPage";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";

const App: React.FC = () => {
  const [activeLink, setActiveLink] = useState("contacts");
  const [showContactForm, setShowContactForm] = useState(false);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  const { data: contacts = [] } = useQuery("contacts", async () => {
    const response = await axios.get("https://taiyo-ai-server.onrender.com/contacts");
    return response.data;
  });

  const handleCreateContact = () => {
    setShowContactForm(true);
  };

  return (
    <Router>
      <div>
        <Sidebar activeLink={activeLink} />
        <Routes>
          <Route path="/" element={<ContactForm contacts={contacts} onCreateContact={handleCreateContact}/>} />
          <Route path="/contacts" element={<ContactForm contacts={contacts} onCreateContact={handleCreateContact}/>} />
          <Route path="/charts-and-maps" element={<ChartsAndMapsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;