const HeroSection = () => {
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
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          Invisioned Marketing
        </h1>
        <p className="text-2xl font-light text-blue-200">Dreams Don't Come True, Visions Do</p>
      </div>
    </div>
  );
};

export default HeroSection;
