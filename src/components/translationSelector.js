import React, { useState } from "react";

export default function TranslationSelector() {
  const [language, setLanguage] = useState("English");

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div>
      <select value={language} onChange={handleLanguageChange}>
        <option value="English">English</option>
        <option value="Spanish">Español</option>
        <option value="German">Deutsch</option>
        <option value="French">Français</option>
      </select>
    </div>
  );
};

;
