import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import logo from "../assets/images/logo2.jpg";
import { useNavigate } from 'react-router-dom';

// Initial data for the component
const allVideos = [
    { id: 'C4jK8eZVY5c', title: 'Shinchan Cartoon' },
    { id: 'KH6NNaC8NKM', title: 'Inside a Giant Pig Farm' },
    { id: 'hHNdNg96xls', title: 'Free Range Chicken Farming Business' },
    { id: 'UbyjwNg3QBs', title: 'Pasture Raised Pigs - Everything To Know' },
    { id: 'NO18evknirQ', title: 'Egg-Laying Hen Farm Tour' },
    { id: 'Um6WUBPj_nY', title: '65 Expensive Agricultural Machines' },
   
];

const initialArticles = [
    {
        id: 'new-article-1',
        title: 'Farm-level risk factors and biosecurity practices in poultry',
        summary: 'A case-control study identifying risk factors linked to poor biosecurity in poultry farms.',
        full: [
            'Section 1: Introduction to Biosecurity in Poultry Farms Biosecurity in poultry farming is a comprehensive set of preventive measures designed to minimize the risk of introducing and spreading infectious diseases within a flock and to other farms. It is the first line of defense in protecting poultry health and welfare. Effective biosecurity is not just about preventing disease; it is a critical investment in the economic viability of the farm, ensuring food safety for consumers and maintaining public trust in the poultry industry. A strong biosecurity program is a sign of a well-managed and responsible poultry operation.',
            '\nSection 2: Common Risk Factors for Poor Biosecurity Several factors can compromise biosecurity on a poultry farm, creating pathways for disease to enter and spread. Understanding these risks is the first step towards mitigating them. Management and Housing: Inadequate ventilation can lead to poor air quality and increased pathogen survival. Overstocking birds can cause stress and increase disease transmission. Poorly maintained housing with structural damages can allow entry for pests and wild birds. Contact with Other Birds: The most significant risk is direct or indirect contact with infected poultry. This includes proximity to other poultry farms, and contact with wild birds, which can be carriers of diseases like Avian Influenza.Farm Characteristics: A lack of secure fencing around the farm perimeter makes it easy for unauthorized people, vehicles, and animals to enter. The absence of clear signage indicating restricted access and biosecurity protocols can lead to unintentional breaches. Hygiene and Sanitation: Failure to properly clean and disinfect poultry houses between flocks allows pathogens to persist and infect new birds. Shared equipment between farms without proper cleaning is a major source of cross-contamination.Personnel Practices: Farm staff and visitors can unknowingly carry pathogens on their clothing, footwear, and hands. The lack of a strict policy for changing clothes and footwear and a lack of hand hygiene stations are major vulnerabilities.',
            '\nSection 3: Practical Biosecurity Measures for Poultry Farms (Entry and Exit protocols) Implementing robust entry and exit protocols is fundamental to a successful biosecurity program. These measures are designed to create a barrier between the farm and the outside world. Perimeter Security: The entire farm should be enclosed by a secure fence with a lockable gate. This gate should be the single point of entry and exit for all traffic. Visitor Policy: All visitors, including veterinarians, service personnel, and suppliers, must adhere to a strict biosecurity protocol. This includes signing a visitor log, showering in and out if possible, or at a minimum, wearing clean, farm-provided protective clothing and boots.Vehicle Disinfection: All vehicles entering the farm must pass through a disinfection station. This can be a wheel bath or a spray disinfectant system. The driver\'s cabin should also be considered a potential source of contamination. Personnel Hygiene: All farm personnel must follow strict hygiene protocols. This includes showering or changing into dedicated farm clothing and footwear upon arrival and washing hands frequently, especially before and after handling birds.',
            '\nSection 4: Biosecurity in Feed and Water Management Feed and water are essential for poultry health, but they can also be sources of contamination if not managed properly. Feed Storage: All feed should be stored in sealed, pest-proof bins or silos. Any spilled feed should be cleaned up immediately to prevent attracting rodents and wild birds. Water Quality: The water supply for the birds should be from a clean source and tested regularly for contaminants. Water lines should be flushed and sanitized between flocks to prevent biofilm buildup, which can harbor pathogens.Feed and Water Spills: Promptly cleaning up any feed and water spills is crucial. Spilled feed can attract pests, and stagnant water can become a breeding ground for bacteria and insects.',
            '\nSection 5: Pest and Rodent Control as a Biosecurity Measure Pests and rodents are significant threats to biosecurity as they can carry and transmit a wide range of diseases. Integrated Pest Management (IPM): An effective pest control program uses a multi-faceted approach. This includes eliminating potential food and water sources, sealing entry points into poultry houses, and using traps and baits strategically.Vegetation Management: The area around poultry houses should be kept free of tall grass and weeds, as these provide shelter and breeding grounds for pests. A gravel or concrete strip around the houses can be an effective deterrent. Waste Management: Proper management of manure and dead birds is critical. Manure should be removed and stored away from the poultry houses. Dead birds should be disposed of promptly and hygienically, for example, through composting or incineration.',
            '\nSection 6: Training and Education for Farm Workers on Biosecurity The success of any biosecurity program depends on the people who implement it. Therefore, training and education are paramount. Regular Training Sessions: All farm workers should receive regular training on the principles of biosecurity and the specific protocols in place on the farm. This training should be refreshed periodically. Clear Communication: Biosecurity procedures should be communicated clearly and concisely. Using visual aids like posters and checklists can be very effective. All training materials should be available in the languages spoken by the workers. Worker Responsibility: It is essential to create a culture of biosecurity on the farm, where every worker understands their role and responsibility in protecting the health of the flock. Workers should be encouraged to report any potential biosecurity risks they observe.',
            '\nSection 7: Challenges in Implementing Biosecurity and Overcoming Them While the benefits of biosecurity are clear, there can be challenges to its implementation. Cost: Some biosecurity measures, such as building new fences or installing a vehicle disinfection system, can be expensive. However, the cost of a disease outbreak is almost always higher. Farmers can start with low-cost measures and gradually invest in more comprehensive solutions. Government programs and subsidies may also be available. Complacency: It is easy to become complacent about biosecurity, especially when there have been no recent disease outbreaks. Regular audits, refresher training, and reminders can help to maintain a high level of vigilance.Lack of Awareness: Some farmers and farm workers may not fully understand the importance of biosecurity. Raising awareness through training, workshops, and extension services is crucial. Demonstrating the economic benefits of good biosecurity can be a powerful motivator.'
        ],
        author: 'biomedcentral',
        date: '2025-08-31',
        readTime: '15 min read', 
        link: 'https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-022-03243-2'
    },       
    {     
        id: 'new-article-2',
        title: 'Effectiveness of hygiene and sanitation in poultry farms',
        summary: 'Research analyzing how sanitation and hygiene reduce Salmonella and Campylobacter infections.',
        full: [
            'Section 1: Introduction to Hygiene and Sanitation in Poultry Farms\nHygiene and sanitation are the cornerstones of a healthy and profitable poultry operation. They refer to the practices and procedures used to maintain a clean environment and prevent the spread of disease-causing microorganisms, known as pathogens. In poultry farming, this is particularly important for controlling foodborne pathogens like Salmonella and Campylobacter, which can cause serious illness in humans. A comprehensive hygiene and sanitation program is not just about cleaning; it\'s about creating a system that minimizes the risk of contamination at every stage of production, from the hatchery to the processing plant.',
            'Section 2: The Link Between Hygiene and Reduction of Salmonella and Campylobacter\nSalmonella and Campylobacter are two of the most common causes of food poisoning worldwide, and poultry is a major source of these bacteria. These pathogens can colonize the intestines of chickens without causing any visible signs of illness. However, they can contaminate the meat and eggs during processing and pose a significant risk to consumers. Research has shown a direct link between the level of hygiene on a farm and the prevalence of Salmonella and Campylobacter in the flock. Farms with high standards of hygiene and sanitation have been shown to have significantly lower levels of these pathogens.',
            'Section 3: Practical Cleaning and Disinfection Protocols\nA thorough cleaning and disinfection (C&D) protocol between flocks is one of the most effective ways to reduce the pathogen load in a poultry house.\n- Dry Cleaning: The first step is to remove all visible dirt and organic matter, such as manure, litter, and feed, from the house. This is a crucial step because disinfectants are less effective in the presence of organic material.\n- Washing: After dry cleaning, the entire house, including walls, floors, and equipment, should be washed with a detergent and hot water. This helps to remove any remaining organic matter and grease.\n- Disinfection: Once the surfaces are clean and dry, a broad-spectrum disinfectant should be applied. It is important to choose a disinfectant that is effective against Salmonella and Campylobacter and to follow the manufacturer\'s instructions for concentration and contact time.\n- Downtime: The house should be left empty for a period of time (downtime) after disinfection to allow it to dry completely and to break the life cycle of any remaining pathogens.',
            'Section 4: Personal Hygiene for Farm Workers\nFarm workers can be a major source of cross-contamination. Therefore, strict personal hygiene practices are essential.\n- Hand Washing: All personnel should wash their hands thoroughly with soap and water before and after entering a poultry house, and after handling birds, eggs, or manure.\n- Dedicated Clothing and Footwear: All workers and visitors should wear clean, dedicated clothing and footwear that are only used on the farm. Footbaths with disinfectant should be placed at the entrance of each poultry house.\n- Health and Sickness: Workers who are sick, especially with gastrointestinal symptoms, should not be allowed to work with the birds.',
            'Section 5: Monitoring the Effectiveness of Sanitation\nIt is important to regularly monitor the effectiveness of the sanitation program to ensure that it is working as intended.\n- Visual Inspection: After cleaning and disinfection, the poultry house should be visually inspected to ensure that it is clean and free of any visible dirt or organic matter.\n- Microbiological Testing: Samples can be taken from various surfaces in the poultry house and tested for the presence of bacteria. This can help to identify any areas where the cleaning and disinfection process may not be effective.\n- Record Keeping: Detailed records of all cleaning and disinfection procedures, as well as the results of any monitoring, should be kept. This can help to identify trends and make improvements to the sanitation program over time.',
            'Section 6: Common Challenges in Maintaining Hygiene and Sanitation\nMaintaining a high level of hygiene and sanitation can be challenging, but it is essential for food safety.\n- Time and Labor: Thorough cleaning and disinfection is a time-consuming and labor-intensive process.\n- Cost: The cost of detergents, disinfectants, and personal protective equipment can be a significant expense.\n- Water Availability: In some areas, the availability of clean water for washing can be a limiting factor.\n- Old or Poorly Designed Facilities: Older poultry houses with rough or porous surfaces can be difficult to clean and disinfect effectively.',
            'Section 7: Training Farm Workers on Hygiene and Sanitation Best Practices\nProper training is essential to ensure that all farm workers understand and follow the hygiene and sanitation protocols.\n- Initial and Ongoing Training: All new employees should receive comprehensive training on the farm\'s hygiene and sanitation procedures. Refresher training should be provided to all employees on a regular basis.\n- Practical Demonstrations: Training should include practical demonstrations of how to properly clean and disinfect equipment and facilities.\n- Importance of Compliance: It is important to explain to workers why hygiene and sanitation are so important for food safety and the success of the farm.\n- Language and Culture: Training materials and instructions should be provided in a language and format that is easily understood by all workers.'
        ],
        author: 'MPDI',
        date: '2025-08-31',
        readTime: '15 min read',
        link: 'https://www.mdpi.com/2076-2615/12/19/2564'
    },
   
    { 
        id: 3,
        title: "Biosecurity in pig farms: a review", 
        summary: "This review article explains both external and internal biosecurity measures to prevent diseases like ASF and PED.", 
        full: Array(7).fill("This review article explains both external and internal biosecurity measures to prevent diseases like asf and ped. with additional details, examples, and explanations. It explains how biosecurity is applied in real farm conditions, challenges faced, and training methods. Workers are guided with simple, actionable advice while maintaining academic rigor."),
        author: "Porcine Health Management", 
        date: "2023-09-01", 
        readTime: "18 min read",
        link: "https://porcinehealthmanagement.biomedcentral.com/articles/10.1186/s40813-020-00181-z"
    },
    {
        id: 4,
        title: "Biosecurity and Hygiene Procedures in Pig Farms: Tailor‑Made Approach",
        summary: "This study measures the effectiveness of tailor-made hygiene and cleaning protocols for pig farms.",
        full: Array(7).fill("This study measures the effectiveness of tailor-made hygiene and cleaning protocols for pig farms. with additional details, examples, and explanations. It explains how biosecurity is applied in real farm conditions, challenges faced, and training methods. Workers are guided with simple, actionable advice while maintaining academic rigor."),
        author: "MDPI",
        date: "2023-09-05",
        readTime: "20 min read",
        link: "https://www.mdpi.com/2076-2615/13/7/1262"
    },
    {
        id: 5,
        title: "Modern biosecurity measures in pig farming",
        summary: "This article discusses modern internal and external biosecurity technologies for sustainable pig farming.",
        full: Array(7).fill("This article discusses modern internal and external biosecurity technologies for sustainable pig farming. with additional details, examples, and explanations. It explains how biosecurity is applied in real farm conditions, challenges faced, and training methods. Workers are guided with simple, actionable advice while maintaining academic rigor."),
        author: "Veterinary World",
        date: "2023-09-10",
        readTime: "15 min read",
        link: "https://dx.doi.org/10.22271/veterinary.2025.v10.i1c.2017"
    },
    {
        id: 6,
        title: "Evaluation of biosecurity measures with sow vaccination",
        summary: "Research evaluating vaccination combined with farm-level biosecurity to prevent influenza A virus.",
        full: Array(7).fill("Research evaluating vaccination combined with farm-level biosecurity to prevent influenza a virus. with additional details, examples, and explanations. It explains how biosecurity is applied in real farm conditions, challenges faced, and training methods. Workers are guided with simple, actionable advice while maintaining academic rigor."),
        author: "BMC Veterinary Research",
        date: "2023-09-12",
        readTime: "22 min read",
        link: "https://doi.org/10.1186/s12917-022-03494-z"
    },
    {
        id: 7,
        title: "Biosecurity in poultry management: A review",
        summary: "This article reviews biosecurity practices to reduce disease incidence in poultry production systems.",
        full: Array(7).fill("This article reviews biosecurity practices to reduce disease incidence in poultry production systems. with additional details, examples, and explanations. It explains how biosecurity is applied in real farm conditions, challenges faced, and training methods. Workers are guided with simple, actionable advice while maintaining academic rigor."),
        author: "ScienceDirect",
        date: "2023-09-18",
        readTime: "19 min read",
        link: "https://www.sciencedirect.com/science/article/pii/S0034528819303156"
    },
    {
        id: 8,
        title: "Biosecurity compliance in poultry farms in Nepal",
        summary: "Survey-based study analyzing compliance and gaps in biosecurity in Nepalese poultry farms.",
        full: Array(7).fill("Survey-based study analyzing compliance and gaps in biosecurity in nepalese poultry farms. with additional details, examples, and explanations. It explains how biosecurity is applied in real farm conditions, challenges faced, and training methods. Workers are guided with simple, actionable advice while maintaining academic rigor."),
        author: "BMC Veterinary Research",
        date: "2023-09-21",
        readTime: "25 min read",
        link: "https://bmcvetres.biomedcentral.com/articles/10.1186/s12917-023-03817-0"
    },
    {
        id: 9,
        title: "Enhancing poultry biosecurity through training and awareness",
        summary: "Discusses worker training programs and awareness building as a core pillar of poultry biosecurity.",
        full: Array(7).fill("Discusses worker training programs and awareness building as a core pillar of poultry biosecurity. with additional details, examples, and explanations. It explains how biosecurity is applied in real farm conditions, challenges faced, and training methods. Workers are guided with simple, actionable advice while maintaining academic rigor."),
        author: "Frontiers in Veterinary Science",
        date: "2023-09-25",
        readTime: "14 min read",
        link: "https://www.frontiersin.org/articles/10.3389/fvets.2022.1023456/full"
    },
    {
        id: 10,
        title: "Avian influenza and biosecurity",
        summary: "Explains avian influenza risks and outlines biosecurity measures for disease control in poultry.",
        full: Array(7).fill("Explains avian influenza risks and outlines biosecurity measures for disease control in poultry. with additional details, examples, and explanations. It explains how biosecurity is applied in real farm conditions, challenges faced, and training methods. Workers are guided with simple, actionable advice while maintaining academic rigor."),
        author: "NCBI",
        date: "2023-09-28",
        readTime: "16 min read",
        link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7159574/"
    }
];

const initialScenarios = [
  { id: `scenario-1`, title: "Disease-Free Flock Brings Higher Egg Production", summary: "A poultry farmer improved egg output and profits through strict biosecurity.", image: "https://tse4.mm.bing.net/th/id/OIP.n8Jov4kuxkoX-ux-WjRsxwHaLG?w=735&h=1102&rs=1&pid=ImgDetMain&o=7&rm=3", full: "In Tamil Nadu, a poultry farmer with 1,500 layers faced reduced egg production due to repeated disease outbreaks. He decided to change his approach and applied strict biosecurity measures. Entry to the poultry shed was restricted; workers had to change into farm clothes and dip their shoes in disinfectant before entering. Feed bins were covered tightly, and wild bird entry was blocked using wire mesh. He also followed a proper vaccination schedule and cleaned the water tanks regularly. As a result, disease cases dropped significantly. Egg production increased by nearly 20%, and the farmer was able to sell fresh, clean eggs at a premium price in the local market. This proved that a disease-free flock means both healthier birds and higher profits.." },
  { id: `scenario-2`, title: "Clean Practices Lead to Healthy Piglets", summary: "A farmer reduced piglet mortality by improving hygiene and management.", image: "https://danbred.com/wp-content/uploads/2023/04/Graphic_landing-page_weaning-healthy-piglets.png", full: "A farmer in Karnataka faced frequent piglet deaths due to diarrhea and weakness. Instead of continuing with the same routine, he improved hygiene in the farrowing pens. He disinfected the sheds before introducing sows, provided dry bedding, and ensured piglets received colostrum soon after birth. He also limited visitors and made separate tools for pig and poultry units to avoid cross-contamination. Within a few months, the piglet survival rate increased sharply, and mortality dropped from 40% to less than 10%. With healthier piglets reaching market size, the farmer gained higher income and confidence to expand his piggery. This story highlights how basic hygiene and biosecurity can transform losses into success." },
  { id: `scenario-3`, title: "Biosecurity Brings Growth and Profit in Pig Farming", summary: "A farmer increased pig survival and profit by following strict biosecurity practices.", image: "https://farmerdb.com/wp-content/uploads/2023/07/Biosecurity-on-pig-farms-800x512.jpg", full: "Another farmer in Assam started with 20 pigs and decided to follow proper biosecurity from day one. He fenced the farm to prevent stray animals from entering, installed a disinfectant footbath for workers, and made sure feed and water were always clean. He also vaccinated his pigs on schedule and separated sick animals immediately when he noticed unusual behavior. Because of these measures, his pigs grew healthy and fast, with almost zero mortality. He sold them at market weight and earned double the expected profit. Buyers trusted him for providing disease-free pigs, and he expanded his farm successfully. This success proves that biosecurity not only saves animals but also builds long-term profit and reputation for pig farmers." },
  { id: `scenario-4`, title: "A Lesson from Neglected Biosecurity in Pig Farming", summary: "A farmer lost many pigs due to poor hygiene and lack of disease control.", image: "https://tse1.mm.bing.net/th/id/OIP.L3lvXyztr02UhlJif3LNJAHaGh?w=591&h=521&rs=1&pid=ImgDetMain&o=7&rm=3", full: "A pig farmer in West Bengal was running a small farm with 30 pigs. To save costs, he ignored basic biosecurity. Visitors walked inside without disinfecting shoes, feed was left uncovered, and pigs had access to contaminated water. One day, several pigs developed fever and stopped eating. The farmer assumed it was a minor problem and delayed calling the veterinarian. Within a week, the infection spread, and he lost 10 pigs, causing a heavy financial loss. This incident showed how neglecting biosecurity measures like clean water, safe feed storage, visitor restrictions, and timely treatment can turn into a tragedy for pig farmers." },
  { id: `scenario-5`, title: "Quarantine Saves the Flock", summary: "New chicks were quarantined before mixing with old birds, preventing a possible disease outbreak.", image: "https://tse3.mm.bing.net/th/id/OIP.ROe99OntOwm3p7QXEVoHngAAAA?w=300&h=300&rs=1&pid=ImgDetMain&o=7&rm=3", full: "A poultry farmer purchased 200 chicks from a hatchery. Instead of mixing them immediately with his existing 1,000 birds, he prepared a separate quarantine shed away from the main flock. Workers handling these chicks did not enter the main poultry house on the same day to avoid cross-contamination. The new chicks were closely monitored for 14 days, checking feed intake, droppings, and health. Only after ensuring they were disease-free, the farmer introduced them gradually into the main flock. This careful biosecurity step prevented any disease outbreak and protected the farmer from heavy economic loss." },

].map((scenario, index) => ({ ...scenario, id: `scenario-${Date.now()}-${index}` }));

const Training = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("scenarios");
  const [searchTerm, setSearchTerm] = useState("");
  const [readModalOpen, setReadModalOpen] = useState(false);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalType, setModalType] = useState(null);

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
        image:
          storyForm.image ||
          `https://via.placeholder.com/150/87CEEB/000000?Text=User+Story`,
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
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
            {filteredVideos.map((video, index) => (
              <div key={index} className="video-item">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  className="w-full h-52 rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <p className="mt-2 text-gray-800 font-medium">{video.title}</p>
              </div>
            ))}
          </div>
        );
      case "articles":
        return (
          <div className="flex flex-col gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white border border-gray-200 border-l-4 border-l-blue-500 p-5 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
              >
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-semibold text-gray-900"
                >
                  {article.title}
                </a>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-1 mb-3">
                  <span>By {article.author}</span>
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
                <p className="text-gray-700">{article.summary}</p>
                <button
                  onClick={() => handleReadMore(article, "article")}
                  className="mt-3 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700"
                >
                  Read More →
                </button>
              </div>
            ))}
          </div>
        );
      case "scenarios":
        return (
          <div className="flex flex-col gap-6">
            <div className="text-right -mb-2">
              <button
                className="px-5 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                onClick={handleAddNewStoryClick}
              >
                + Share Your Story
              </button>
            </div>
            {filteredScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="flex flex-col sm:flex-row bg-white border border-gray-200 p-5 rounded-lg hover:shadow-lg hover:-translate-y-1 transition"
              >
                <img
                  src={scenario.image}
                  alt={scenario.title}
                  className="w-full sm:w-32 h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-5"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {scenario.title}
                  </h3>
                  <p className="text-gray-700">{scenario.summary}</p>
                  <button
                    onClick={() => handleReadMore(scenario, "scenario")}
                    className="mt-3 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700"
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
    <div className="flex flex-col md:flex-row h-screen font-poppins bg-gray-50">
      {/* Left Panel */}
      <div className="w-full md:w-64 bg-gray-900 text-gray-200 p-6 flex flex-col rounded-none md:rounded-r-xl transition-all">
         <div
                className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="w-12 sm:w-16 md:w-20 h-10 sm:h-12 flex items-center">
                  <img src={logo} alt="Logo" className="h-full object-contain" />
                </div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                  <span className="text-green-600">Bio</span>
                  <span className="text-blue-900">Raksha</span>
                </h1>
              </div>
        <h2 className="text-sm uppercase tracking-wide text-gray-400 mb-4">
          Training
        </h2>
        <ul className="flex md:flex-col gap-2 md:gap-0">
          {["videos", "articles", "scenarios"].map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer rounded-md px-3 py-2 ${
                activeTab === tab
                  ? "bg-blue-500 text-white font-semibold"
                  : "hover:bg-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Panel */}
      <div className="flex-1 p-6 flex flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="px-5 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600">
            Search
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-2">{renderContent()}</div>
      </div>

      {/* Read Modal */}
      <Modal isOpen={readModalOpen} onClose={() => setReadModalOpen(false)}>
        {modalContent && (
          <div>
            <h2 className="text-xl font-bold mb-3">{modalContent.title}</h2>
            {modalContent.image && (
              <img
                src={modalContent.image}
                alt={modalContent.title}
                className="w-full rounded-lg mb-4"
              />
            )}
            <p className="text-gray-700">{modalContent.full}</p>
            {modalType === "scenario" && (
              <div className="flex justify-end gap-3 mt-5 border-t pt-3">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => handleEditClick(modalContent)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={() => handleDeleteClick(modalContent.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Story Modal */}
      <Modal isOpen={storyModalOpen} onClose={() => setStoryModalOpen(false)}>
        <form
          onSubmit={handleStoryFormSubmit}
          className="flex flex-col gap-4 text-gray-800"
        >
          <h2 className="text-lg font-semibold">
            {editingId ? "Edit Story" : "Share Your Real-Life Story"}
          </h2>
          <input
            type="text"
            name="title"
            placeholder="Story Title"
            value={storyForm.title}
            onChange={handleStoryInputChange}
            required
            className="p-3 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL (optional)"
            value={storyForm.image}
            onChange={handleStoryInputChange}
            className="p-3 border border-gray-300 rounded-lg"
          />
          <textarea
            name="summary"
            placeholder="A brief summary of your story"
            value={storyForm.summary}
            onChange={handleStoryInputChange}
            required
            className="p-3 border border-gray-300 rounded-lg min-h-20"
          ></textarea>
          <textarea
            name="full"
            placeholder="Your full story"
            value={storyForm.full}
            onChange={handleStoryInputChange}
            required
            className="p-3 border border-gray-300 rounded-lg min-h-36"
          ></textarea>
          <button
            type="submit"
            className="self-end px-5 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
          >
            {editingId ? "Update Story" : "Submit Story"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Training;
