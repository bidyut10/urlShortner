import Navbar from '../components/Navbar'
import ApiDocumentation from '../components/ApiDocumentation';
import Hero from '../components/Hero';
import { useState } from 'react';
import SideNavbar from '../components/SideNavbar';

const HomePage = () => {
    const [selectedTool, setSelectedTool] = useState("Home");
    const handleToolSelect = (tool) => {
      setSelectedTool(tool);
    };
  return (
    <div className='custom-scrollbar'>
      <Navbar />
      <SideNavbar onSelectTool={handleToolSelect} />
      <div>
        {selectedTool === "Home" && <Hero />}
        {selectedTool === "Documentation" && <ApiDocumentation />}
      </div>
    </div>
  );
}

export default HomePage