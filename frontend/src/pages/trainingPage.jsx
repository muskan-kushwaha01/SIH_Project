
import React, { useState, useEffect } from 'react';
//import Modal from './Modal';

import Navbar from '../components/Navbar';

// Initial data for the component
const allVideos = [
    { id: '46_VFYFDk5g', title: 'Shinchan Cartoon' },
    { id: 'lD0OOqj1zYo', title: 'Inside a Giant Pig Farm' },
    { id: 'CkzAwNRbGBI', title: 'Free Range Chicken Farming Business' },
    { id: '594ITLAyL1o', title: 'Pasture Raised Pigs - Everything To Know' },
    { id: 'K7-3JNOZkJU', title: 'Egg-Laying Hen Farm Tour' },
    { id: 's-XVd3_Wc-0', title: '65 Expensive Agricultural Machines' },
    { id: 'uOUkOJcO9_b', title: 'World Modern Agriculture Technology' },
    { id: 'lfjGnPn0x3h', title: '300 Unbelievable Agriculture Technology' },
    { id: 'dUrvqE-B89k', title: '50 Modern Agriculture Machines' },
    { id: 'K3_uXgqRYRE', title: 'Advanced Agriculture Planting Technology' },
    { id: 'tSqYvDic6ka', title: 'Super Advanced Vertical Farming System' },
    { id: 'HhlA8rWD0Ap', title: '10 Modern Agriculture Technology Farming Techniques' },
];

const initialArticles = [
    { id: 1, title: "Advanced Poultry Nutrition", summary: "Explore the latest in poultry feed formulations.", full: "Detailed content on poultry nutrition...", author: "Dr. Jane Doe", date: "2023-08-15", readTime: "8 min read" },
    { id: 2, title: "Disease Prevention in Pig Farming", summary: "Key strategies for biosecurity and vaccination.", full: "In-depth guide on preventing common swine diseases...", author: "John Smith, DVM", date: "2023-08-10", readTime: "12 min read" },
    { id: 3, title: "Optimizing Broiler House Environments", summary: "Control temperature, ventilation, and lighting.", full: "...", author: "Dr. A. Collins", date: "2023-08-05", readTime: "9 min read" },
    { id: 4, title: "Understanding Swine Genetics", summary: "Select the right genetics for your farm's goals.", full: "...", author: "GenetiPork Inc.", date: "2023-08-01", readTime: "15 min read" },
    { id: 5, title: "Water Quality in Poultry Farms", summary: "The importance of clean water and how to maintain it.", full: "...", author: "AquaVet Solutions", date: "2023-07-28", readTime: "7 min read" },
    { id: 6, title: "The Economics of Farrowing Crates", summary: "A cost-benefit analysis of different farrowing systems.", full: "...", author: "Farmonomics Weekly", date: "2023-07-22", readTime: "11 min read" },
    { id: 7, title: "Layer Hen Management for Peak Production", summary: "Strategies to keep your hens laying consistently.", full: "...", author: "Dr. H. Leman", date: "2023-07-19", readTime: "10 min read" },
    { id: 8, title: "Manure Management in Pig Operations", summary: "Sustainable and profitable ways to handle pig waste.", full: "...", author: "EcoFarm Consulting", date: "2023-07-15", readTime: "13 min read" },
    { id: 9, title: "Biosecurity for Backyard Poultry", summary: "Simple steps to protect your small flock from diseases.", full: "...", author: "Homestead Helper", date: "2023-07-11", readTime: "6 min read" },
    { id: 10, title: "The Transition from Gestation to Farrowing", summary: "Managing sows in the critical period before giving birth.", full: "...", author: "SowCare Specialists", date: "2023-07-08", readTime: "9 min read" },
    { id: 11, title: "Controlling Coccidiosis in Chickens", summary: "An overview of prevention and treatment.", full: "...", author: "PoultryHealth Int.", date: "2023-07-05", readTime: "8 min read" },
    { id: 12, title: "Weaning Management for Piglets", summary: "Techniques to reduce stress and post-weaning lag.", full: "...", author: "Dr. M. Rodriguez", date: "2023-07-01", readTime: "10 min read" },
];

const initialScenarios = [
  { id: `scenario-1`, title: "Case Study: The ASF Outbreak of '23", summary: "A look at how a farm battled an African Swine Fever outbreak.", image: "https://via.placeholder.com/150/FF6347/FFFFFF?Text=ASF+Case", full: "A detailed account of the ASF outbreak..." },
  { id: `scenario-2`, title: "Success Story: From 500 to 50,000 Layers", summary: "How automation and direct marketing led to massive expansion.", image: "https://via.placeholder.com/150/32CD32/FFFFFF?Text=Success", full: "The inspiring journey of a poultry farmer..." },
  { id: `scenario-3`, title: "The Financial Impact of a Feed Mill Error", summary: "A calculation error led to a 10% drop in broiler growth rates.", image: "https://via.placeholder.com/150/FFD700/000000?Text=Financials", full: "This scenario analyzes a real-life incident..." },
  { id: `scenario-4`, title: "Tragedy: The Barn Fire of '24", summary: "An electrical fault in a farrowing house led to a devastating fire.", image: "https://via.placeholder.com/150/B22222/FFFFFF?Text=Tragedy", full: "A tragic story of a family farm..." },
  { id: `scenario-5`, title: "Innovation: Using Black Soldier Flies", summary: "A pig farm successfully integrated a BSF system to convert manure.", image: "https://via.placeholder.com/150/6B8E23/FFFFFF?Text=Innovation", full: "A case study on circular economy in farming..." },
  { id: `scenario-6`, title: "Market Shock: The 2022 Grain Price Spike", summary: "How a 50% increase in feed costs tested a farm’s financial resilience.", image: "https://via.placeholder.com/150/4682B4/FFFFFF?Text=Market", full: "Detailed analysis of navigating market volatility..." },
  { id: `scenario-7`, title: "Biosecurity Breach: A PRRS Near-Miss", summary: "A lapse in visitor protocol almost introduced PRRS to a breeding herd.", image: "https://via.placeholder.com/150/FF4500/FFFFFF?Text=Biosecurity", full: "This report details the incident, the immediate quarantine response..." },
  { id: `scenario-8`, title: "Genetic Win: Selecting for Litter Size", summary: "A breeding program that increased average litter size by two piglets.", image: "https://via.placeholder.com/150/2E8B57/FFFFFF?Text=Genetics", full: "A look at the data-driven decisions and genetic selection..." },
  { id: `scenario-9`, title: "Heat Stress Crisis: The Summer of '23", summary: "Losing 5% of a broiler flock to a record-breaking heatwave.", image: "https://via.placeholder.com/150/DC143C/FFFFFF?Text=Heatwave", full: "How the farm implemented new cooling systems..." },
  { id: `scenario-10`, title: "Water Quality Mystery", summary: "A drop in egg production linked to a well water issue.", image: "https://via.placeholder.com/150/00BFFF/FFFFFF?Text=Water", full: "The step-by-step process of eliminating variables..." },
  { id: `scenario-11`, title: "The Wrong Vaccine: A Costly Cold Storage Failure", summary: "An entire batch of vaccines was rendered ineffective.", image: "https://via.placeholder.com/150/9932CC/FFFFFF?Text=Vaccine", full: "A case study on the importance of cold chain management..." },
  { id: `scenario-12`, title: "Community Conflict: Odor Complaints", summary: "How a growing pig farm navigated legal challenges and community relations.", image: "https://via.placeholder.com/150/F0E68C/000000?Text=Community", full: "The farm's strategy involving new manure management tech..." },
].map((scenario, index) => ({ ...scenario, id: `scenario-${Date.now()}-${index}` }));

const Training = () => {
  const [activeTab, setActiveTab] = useState('scenarios');
  const [searchTerm, setSearchTerm] = useState('');
  const [readModalOpen, setReadModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalType, setModalType] = useState(null); // To track if modal is for 'article' or 'scenario'

  const [articles] = useState(initialArticles);
  const [scenarios, setScenarios] = useState(initialScenarios);

  const [storyForm, setStoryForm] = useState({ title: '', summary: '', full: '', image: '' });
  const [editingId, setEditingId] = useState(null);

  const [filteredVideos, setFilteredVideos] = useState(allVideos);
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const [filteredScenarios, setFilteredScenarios] = useState(scenarios);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    setFilteredVideos(allVideos.filter(video => video.title.toLowerCase().includes(lowerCaseSearchTerm)));
    setFilteredArticles(articles.filter(article => article.title.toLowerCase().includes(lowerCaseSearchTerm) || article.summary.toLowerCase().includes(lowerCaseSearchTerm)));
    setFilteredScenarios(scenarios.filter(scenario => scenario.title.toLowerCase().includes(lowerCaseSearchTerm) || scenario.summary.toLowerCase().includes(lowerCaseSearchTerm)));
  }, [searchTerm, scenarios, articles]);

  const handleReadMore = (content, type) => {
    setModalContent(content);
    setModalType(type);
    setReadModalOpen(true);
  };

  const handleStoryInputChange = (e) => {
    const { name, value } = e.target;
    setStoryForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewStoryClick = () => {
    setEditingId(null);
    setStoryForm({ title: '', summary: '', full: '', image: '' });
    setStoryModalOpen(true);
  };

  const handleEditClick = (story) => {
    setEditingId(story.id);
    setStoryForm(story);
    setReadModalOpen(false);
    setStoryModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      setScenarios(scenarios.filter(s => s.id !== id));
      setReadModalOpen(false);
    }
  };

  const handleStoryFormSubmit = (e) => {
    e.preventDefault();
    if (!storyForm.title || !storyForm.summary || !storyForm.full) {
      alert('Please fill out title, summary, and full story.');
      return;
    }

    if (editingId) {
      setScenarios(scenarios.map(s => s.id === editingId ? { ...storyForm, id: editingId } : s));
    } else {
      const newId = `scenario-${Date.now()}`;
      const storyToAdd = { ...storyForm, id: newId, image: storyForm.image || `https://via.placeholder.com/150/87CEEB/000000?Text=User+Story` };
      setScenarios([storyToAdd, ...scenarios]);
    }

    setStoryModalOpen(false);
    setEditingId(null);
    setStoryForm({ title: '', summary: '', full: '', image: '' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "videos":
        return (
          <div className="video-section grid gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] max-lg:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {filteredVideos.map((video, index) => (
              <div key={index} className="video-item">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-[200px] rounded-lg"
                ></iframe>
                <p className="video-title mt-2 font-medium text-gray-800">
                  {video.title}
                </p>
              </div>
            ))}
          </div>
        );
      case "articles":
        return (
          <div className="article-section flex flex-col gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="article-item bg-white border border-gray-200 border-l-4 border-l-blue-400 p-5 rounded-lg transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-gray-900 font-semibold">{article.title}</h3>
                <div className="article-meta flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
                  <span>By {article.author}</span>
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                <p>{article.summary}</p>
                <button
                  onClick={() => handleReadMore(article, "article")}
                  className="px-4 py-2 mt-3 bg-gray-100 text-gray-700 rounded-md font-semibold hover:bg-gray-200"
                >
                  Read More
                </button>
              </div>
            ))}
          </div>
        );
      case "scenarios":
        return (
          <div className="scenario-section flex flex-col gap-6">
            <div className="add-story-container text-right -mb-2">
              <button
                className="add-story-btn px-5 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-700"
                onClick={handleAddNewStoryClick}
              >
                + Share Your Story
              </button>
            </div>
            {filteredScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="scenario-item bg-white border border-gray-200 p-5 rounded-lg flex items-start transition hover:-translate-y-1 hover:shadow-lg max-md:flex-col"
              >
                <img
                  src={scenario.image}
                  alt={scenario.title}
                  className="w-[120px] h-[120px] rounded-lg mr-5 object-cover max-md:w-full max-md:max-h-[200px] max-md:mr-0 max-md:mb-4"
                />
                <div className="scenario-content">
                  <h3 className="text-gray-900 font-semibold">{scenario.title}</h3>
                  <p>{scenario.summary}</p>
                  <button
                    onClick={() => handleReadMore(scenario, "scenario")}
                    className="px-4 py-2 mt-3 bg-gray-100 text-gray-700 rounded-md font-semibold hover:bg-gray-200"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fc] font-poppins">
    {/* ✅ Navbar on top */}
    <Navbar />
    <div className="training-container flex h-screen font-poppins bg-[#f7f8fc]">
      {/* Left Panel */}
      <div className="left-panel w-[250px] bg-gray-900 text-gray-200 p-6 flex flex-col rounded-r-[15px] transition-all duration-300 max-md:w-full max-md:rounded-none">
        <div className="logo-header flex items-center pb-5 border-b border-gray-700 mb-5">
          <img
            src="https://via.placeholder.com/30"
            alt="Logo"
            className="logo-img mr-2 rounded"
          />
          <span className="logo text-[28px] font-bold text-blue-400">
            BioRaksha
          </span>
        </div>
        <h2 className="uppercase tracking-wider text-gray-400 text-lg">
          Training
        </h2>
        <ul className="list-none p-0 max-md:flex max-md:justify-around max-md:flex-wrap max-md:gap-2">
          <li
            className={`px-2 py-3 cursor-pointer rounded-md mb-2 hover:bg-gray-700 transition-colors flex-1 text-center ${
              activeTab === "videos" ? "bg-blue-400 text-white font-semibold" : ""
            }`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </li>
          <li
            className={`px-2 py-3 cursor-pointer rounded-md mb-2 hover:bg-gray-700 transition-colors flex-1 text-center ${
              activeTab === "articles"
                ? "bg-blue-400 text-white font-semibold"
                : ""
            }`}
            onClick={() => setActiveTab("articles")}
          >
            Articles
          </li>
          <li
            className={`px-2 py-3 cursor-pointer rounded-md mb-2 hover:bg-gray-700 transition-colors flex-1 text-center ${
              activeTab === "scenarios"
                ? "bg-blue-400 text-white font-semibold"
                : ""
            }`}
            onClick={() => setActiveTab("scenarios")}
          >
            Real-Life Scenarios
          </li>
        </ul>
      </div>
  
      {/* Right Panel */}
      <div className="right-panel flex-grow p-8 overflow-hidden flex flex-col max-md:p-4">
        {/* Search Bar */}
        <div className="search-bar flex items-center mb-6 gap-3 max-md:flex-col">
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-5 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
          />
          <button className="px-5 py-3 ml-3 bg-blue-400 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors max-md:ml-0">
            Search
          </button>
        </div>
  
        <div className="content-area flex-grow overflow-y-auto pr-4 max-md:pr-1">
          {renderContent()}
        </div>
      </div>
  
      {/* Modal for Read */}
      <Modal isOpen={readModalOpen} onClose={() => setReadModalOpen(false)}>
        {modalContent && (
          <div>
            <h2 className="text-xl font-bold mb-3">{modalContent.title}</h2>
            {modalContent.image && (
              <img
                src={modalContent.image}
                alt={modalContent.title}
                className="modal-image max-w-full rounded-lg mb-4"
              />
            )}
            <p>{modalContent.full}</p>
            {modalType === "scenario" && (
              <div className="modal-actions mt-6 pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  className="edit-btn px-4 py-2 bg-blue-400 text-white rounded-md font-semibold hover:bg-blue-600"
                  onClick={() => handleEditClick(modalContent)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700"
                  onClick={() => handleDeleteClick(modalContent.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
  
      {/* Modal for Story Form */}
      <Modal isOpen={storyModalOpen} onClose={() => setStoryModalOpen(false)}>
        <form
          onSubmit={handleStoryFormSubmit}
          className="story-form flex flex-col gap-4"
        >
          <h2 className="text-xl font-bold">
            {editingId ? "Edit Story" : "Share Your Real-Life Story"}
          </h2>
          <input
            type="text"
            name="title"
            placeholder="Story Title"
            value={storyForm.title}
            onChange={handleStoryInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md text-base"
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL (optional)"
            value={storyForm.image}
            onChange={handleStoryInputChange}
            className="w-full p-3 border border-gray-300 rounded-md text-base"
          />
          <textarea
            name="summary"
            placeholder="A brief summary of your story"
            value={storyForm.summary}
            onChange={handleStoryInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md text-base min-h-[80px] resize-y"
          ></textarea>
          <textarea
            name="full"
            placeholder="Your full story"
            value={storyForm.full}
            onChange={handleStoryInputChange}
            required
            className="full-story-textarea w-full p-3 border border-gray-300 rounded-md text-base min-h-[150px] resize-y"
          ></textarea>
          <button
            type="submit"
            className="px-5 py-3 bg-blue-400 text-white rounded-lg font-semibold self-end hover:bg-blue-600"
          >
            {editingId ? "Update Story" : "Submit Story"}
          </button>
        </form>
      </Modal>
    </div>
    </div>
  );
};
export default Training;  