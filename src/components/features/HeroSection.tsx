import React, { useState } from 'react';

const HeroSection: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [title, setTitle] = useState('Invisioned Marketing');
  const [subtitle, setSubtitle] = useState('Dreams Don\'t Come True, Visions Do');

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = async () => {
    const response = await fetch('/api/update-hero', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, subtitle }),
    });

    if (response.ok) {
      setIsEditMode(false);
      alert('Hero section updated!');
    } else {
      alert('Failed to update hero section.');
    }
  };

  return (
    <div className="relative h-[80vh] flex items-center justify-center text-white">
      <div className="absolute inset-0">
        <img
          src="/images/hero-image.jpg"
          alt="Invisioned Marketing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050206]" />
      </div>
      <div className="relative text-center space-y-4 p-8">
        {isEditMode ? (
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-black"
              placeholder="Title"
            />
            <textarea
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="text-black"
              placeholder="Subtitle"
            />
            <button onClick={handleSaveClick}>Save</button>
            <button onClick={() => setIsEditMode(false)}>Cancel</button>
          </div>
        ) : (
          <div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              {title}
            </h1>
            <p className="text-2xl font-light text-blue-200">{subtitle}</p>
            <button onClick={handleEditClick}>Edit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
