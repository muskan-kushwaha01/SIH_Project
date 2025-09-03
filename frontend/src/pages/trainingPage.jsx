import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Menu, ChevronLeft } from 'lucide-react';
import logo from "../assets/images/logo2.jpg";
import { useNavigate } from 'react-router-dom';


const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-3 sm:p-4 border-b flex justify-between items-center rounded-t-xl sm:rounded-t-2xl">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Content</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-3 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Initial data
const allVideos = [
  { id: 'C4jK8eZVY5c', title: 'Coccidiosis in Poultry Symptoms, Prevention 2025' },
  { id: 'KH6NNaC8NKM', title: 'Stop Poultry Losses! Spot & Prevent Coli 2025' },
  { id: 'hHNdNg96xls', title: 'Stop Bird Flu! Must Know Poultry Protect 2025' },
  { id: 'UbyjwNg3QBs', title: 'Stop ASF in Its Tracks Save Your Pigs 2025' },
  { id: 'NO18evknirQ', title: 'Pig Farmers Beat Salmonellosis Fast! 2025' },
  { id: 'Um6WUBPj_nY', title: 'How to Keep Your Pigs Mange Free 2025' },
];

const initialArticles = [
  {
    id: 'article-1',
    title: 'Farm-level risk factors and biosecurity practices in poultry',
    summary: 'A case-control study identifying risk factors linked to poor biosecurity in poultry farms.',
    full: 'Biosecurity in poultry farming is a comprehensive set of preventive measures designed to minimize the risk of introducing and spreading infectious diseases within a flock and to other farms. It is the first line of defense in protecting poultry health and welfare. Effective biosecurity is not just about preventing disease; it is a critical investment in the economic viability of the farm.',
    author: 'biomedcentral',
    date: '2025-08-31',
    readTime: '15 min read',
    link: 'https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-022-03243-2'
  },
  {
    id: 'article-2',
    title: 'Effectiveness of hygiene and sanitation in poultry farms',
    summary: 'Research analyzing how sanitation and hygiene reduce Salmonella and Campylobacter infections.',
    full: 'Hygiene and sanitation are the cornerstones of a healthy and profitable poultry operation. They refer to the practices and procedures used to maintain a clean environment and prevent the spread of disease-causing microorganisms.',
    author: 'MDPI',
    date: '2025-08-31',
    readTime: '15 min read',
    link: 'https://www.mdpi.com/2076-2615/12/19/2564'
  },
];

const initialScenarios = [
  {
    id: 'scenario-1',
    title: "Disease-Free Flock Brings Higher Egg Production",
    summary: "A poultry farmer improved egg output and profits through strict biosecurity.",
    image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop",
    full: "In Tamil Nadu, a poultry farmer with 1,500 layers faced reduced egg production due to repeated disease outbreaks. He decided to change his approach and applied strict biosecurity measures. Entry to the poultry shed was restricted; workers had to change into farm clothes and dip their shoes in disinfectant before entering."
  },
  {
    id: 'scenario-2',
    title: "Clean Practices Lead to Healthy Piglets",
    summary: "A farmer reduced piglet mortality by improving hygiene and management.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    full: "A farmer in Karnataka faced frequent piglet deaths due to diarrhea and weakness. Instead of continuing with the same routine, he improved hygiene in the farrowing pens. He disinfected the sheds before introducing sows, provided dry bedding, and ensured piglets received colostrum soon after birth."
  },
];

const Training = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("scenarios");
  const [searchTerm, setSearchTerm] = useState("");
  const [readModalOpen, setReadModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  const [articles] = useState(initialArticles);
  const [scenarios, setScenarios] = useState(initialScenarios);

  const [storyForm, setStoryForm] = useState({
    title: "",
    summary: "",
    full: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);

  const [filteredVideos, setFilteredVideos] = useState(allVideos);
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const [filteredScenarios, setFilteredScenarios] = useState(scenarios);

  // Handle scroll for mobile search bar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        if (currentScrollY > scrollY && currentScrollY > 100) {
          setSearchVisible(false);
        } else if (currentScrollY < scrollY || currentScrollY <= 50) {
          setSearchVisible(true);
        }
      } else {
        setSearchVisible(true);
      }
      
      setScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  // Filter content based on search
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    setFilteredVideos(
      allVideos.filter((v) => v.title.toLowerCase().includes(lower))
    );
    setFilteredArticles(
      articles.filter(
        (a) =>
          a.title.toLowerCase().includes(lower) ||
          a.summary.toLowerCase().includes(lower)
      )
    );
    setFilteredScenarios(
      scenarios.filter(
        (s) =>
          s.title.toLowerCase().includes(lower) ||
          s.summary.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, scenarios, articles]);

  const handleReadMore = (content, type) => {
    setModalContent(content);
    setModalType(type);
    setReadModalOpen(true);
  };

  const handleStoryInputChange = (e) => {
    const { name, value } = e.target;
    setStoryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewStoryClick = () => {
    setEditingId(null);
    setStoryForm({ title: "", summary: "", full: "", image: "" });
    setStoryModalOpen(true);
  };

  const handleEditClick = (story) => {
    setEditingId(story.id);
    setStoryForm(story);
    setReadModalOpen(false);
    setStoryModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      setScenarios(scenarios.filter((s) => s.id !== id));
      setReadModalOpen(false);
    }
  };

  const handleStoryFormSubmit = (e) => {
    e.preventDefault();
    if (!storyForm.title || !storyForm.summary || !storyForm.full) {
      alert("Please fill out title, summary, and full story.");
      return;
    }

    if (editingId) {
      setScenarios(
        scenarios.map((s) =>
          s.id === editingId ? { ...storyForm, id: editingId } : s
        )
      );
    } else {
      const newId = `scenario-${Date.now()}`;
      const storyToAdd = {
        ...storyForm,
        id: newId,
        image: storyForm.image || "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop",
      };
      setScenarios([storyToAdd, ...scenarios]);
    }

    setStoryModalOpen(false);
    setEditingId(null);
    setStoryForm({ title: "", summary: "", full: "", image: "" });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "videos":
        return (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filteredVideos.map((video, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        );
      case "articles":
        return (
          <div className="space-y-4 sm:space-y-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg sm:text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {article.title}
                </a>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-2 mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded-full">By {article.author}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full">{article.date}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded-full">{article.readTime}</span>
                </div>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">{article.summary}</p>
                <button
                  onClick={() => handleReadMore(article, "article")}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm sm:text-base"
                >
                  Read More
                  <ChevronLeft className="rotate-180" size={16} />
                </button>
              </div>
            ))}
          </div>
        );
      case "scenarios":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-end">
              <button
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                onClick={handleAddNewStoryClick}
              >
                <Plus size={18} />
                Share Your Story
              </button>
            </div>
            {filteredScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 lg:w-64 md:flex-shrink-0">
                    <img
                      src={scenario.image}
                      alt={scenario.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="p-4 sm:p-6 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      {scenario.title}
                    </h3>
                    <p className="text-gray-700 mb-4 text-sm sm:text-base line-clamp-3">{scenario.summary}</p>
                    <button
                      onClick={() => handleReadMore(scenario, "scenario")}
                      className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base"
                    >
                      Read Full Story
                      <ChevronLeft className="rotate-180" size={16} />
                    </button>
                  </div>
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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:relative top-0 left-0 h-full w-72 sm:w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white z-50 transform transition-transform duration-300 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Close button for mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        {/* Logo Section */}
        <div
  className="p-4 sm:p-6 border-b border-gray-700 flex-shrink-0 cursor-pointer"
  onClick={() => navigate("/")}
>
  <div className="flex items-center gap-3 sm:gap-4 mb-2">
    <div className="w-12 sm:w-16 md:w-20 h-10 sm:h-12 flex items-center">
      <img src={logo} alt="Logo" className="h-full object-contain" />
    </div>
    <div>
      <h1 className="text-xl sm:text-2xl font-bold">
        <span className="text-green-400">Bio</span>
        <span className="text-blue-400">Raksha</span>
      </h1>
      <p className="text-xs sm:text-sm text-gray-400">Interactive Training</p>
    </div>
  </div>
</div>


        {/* Navigation */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <h2 className="text-xs sm:text-sm uppercase tracking-wider text-gray-400 mb-4 font-semibold">
            Content Categories
          </h2>
          <nav className="space-y-2">
            {[
              { key: "scenarios", label: "Real-life Stories", icon: "📖" },
              { key: "articles", label: "Research Articles", icon: "📄" },
              { key: "videos", label: "Educational Videos", icon: "🎥" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-lg"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                <span className="text-lg sm:text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-700 flex-shrink-0">
          <p className="text-xs text-gray-400 text-center">
            Empowering farmers through knowledge sharing
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Search Header */}
        <div className={`bg-white/95 backdrop-blur-md border-b border-gray-200 z-30 transition-transform duration-300 flex-shrink-0 ${
          searchVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'
        }`}>
          <div className="p-3 sm:p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                  />
                </div>
                <button className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap text-sm sm:text-base">
                  Search Content
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Read Modal */}
      <Modal isOpen={readModalOpen} onClose={() => setReadModalOpen(false)}>
        {modalContent && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{modalContent.title}</h2>
              {modalContent.author && (
                <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-4">
                  <span className="bg-gray-100 px-2 py-1 rounded-full">By {modalContent.author}</span>
                  {modalContent.date && <span className="bg-gray-100 px-2 py-1 rounded-full">{modalContent.date}</span>}
                  {modalContent.readTime && <span className="bg-gray-100 px-2 py-1 rounded-full">{modalContent.readTime}</span>}
                </div>
              )}
            </div>
            
            {modalContent.image && (
              <img
                src={modalContent.image}
                alt={modalContent.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            
            <div className="prose max-w-none">
              {Array.isArray(modalContent.full) 
                ? modalContent.full.map((section, index) => (
                    <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                      {section}
                    </p>
                  ))
                : <p className="text-gray-700 leading-relaxed">{modalContent.full}</p>
              }
            </div>
            
            {modalType === "scenario" && (
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => handleEditClick(modalContent)}
                >
                  <Edit size={16} />
                  Edit Story
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  onClick={() => handleDeleteClick(modalContent.id)}
                >
                  <Trash2 size={16} />
                  Delete Story
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Story Form Modal */}
      <Modal isOpen={storyModalOpen} onClose={() => setStoryModalOpen(false)}>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editingId ? "Edit Your Story" : "Share Your Real-Life Story"}
            </h2>
            <p className="text-gray-600 mt-2">
              Help other farmers learn from your experience
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Story Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Give your story a compelling title"
                value={storyForm.title}
                onChange={handleStoryInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={storyForm.image}
                onChange={handleStoryInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Summary
              </label>
              <textarea
                name="summary"
                placeholder="A brief summary that captures the essence of your story"
                value={storyForm.summary}
                onChange={handleStoryInputChange}
                required
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Story
              </label>
              <textarea
                name="full"
                placeholder="Tell your complete story with details about the challenges, solutions, and outcomes"
                value={storyForm.full}
                onChange={handleStoryInputChange}
                required
                rows="8"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setStoryModalOpen(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleStoryFormSubmit}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                {editingId ? "Update Story" : "Share Story"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Training;