
import React, { useState } from "react";
import Navbar from "../components/Navbar";

const policies = [
  {
    id: 1,
    title: "Piggery Development & Manuals (Meghalaya)",
    lead: "State-level manuals, training guides, and schemes supporting small & marginal pig farmers in Meghalaya.",
    focus: "Breed management, housing, vaccination, manure use, farm setup, workshops, modern piggery techniques.",
    eligibility: "Small & marginal farmers, SHGs, women entrepreneurs, tribal communities in Meghalaya.",
    authority: "Meghalaya Animal Husbandry & Veterinary Department.",
    subsidy: "Up to 50% subsidy on pig units, 75% for SC/ST farmers, ₹25,000-₹1,00,000 per unit.",
    documents: "Aadhaar, land documents, caste certificate (if applicable), bank account details.",
    link: "https://megahvt.gov.in/megh_piggery_mission.html",
  },
  {
    id: 2,
    title: "Rashtriya Gokul Mission (Pig Adaptation)",
    lead: "Central scheme for conservation and development of indigenous pig breeds with breeder training and financial support.",
    focus: "Breed conservation, farmer training, indigenous pig promotion, cooperative breeding centers, disease prevention, feed management, sustainability support.",
    eligibility: "Registered farmers, FPOs, pig breeders, cooperatives.",
    authority: "DAHD, Government of India.",
    subsidy: "100% assistance for Gokul Grams, ₹2-5 lakhs for breeding centers, training support.",
    documents: "Registration certificate, project proposal, land ownership proof, veterinary clearance.",
    link: "https://dahd.gov.in/schemes/programmes/rashtriya_gokul_mission",
  },
  {
    id: 3,
    title: "National Livestock Mission – Pig Component",
    lead: "Support for backyard piggery, breeding farms, and pig feed units with subsidies, training, and guidance.",
    focus: "Backyard piggery, breeding farms, pig feed units, training, biosecurity, health monitoring, market access support.",
    eligibility: "Individual farmers, FPOs, SHGs, entrepreneurs.",
    authority: "DAHD, Government of India.",
    subsidy: "25% general category, 33.33% SC/ST/Women, maximum ₹3.20 lakhs per beneficiary.",
    documents: "Project report, quotations, bank guarantee, caste certificate, land documents.",
    link: "https://www.dahd.gov.in/schemes/programmes/national_livestock_mission",
  },
  {
    id: 4,
    title: "NABARD Pig Farming Loan Scheme",
    lead: "Credit-linked subsidy for establishing pig farms, buying equipment, and feed production units through NABARD.",
    focus: "Loan subsidy, farm infrastructure, feed plants, training, technical guidance, health support, market linkages.",
    eligibility: "Farmers, entrepreneurs, SHGs, FPOs with viable project proposals.",
    authority: "NABARD / Partner Banks.",
    subsidy: "25% of project cost (max ₹10 lakhs), 4% interest subvention, working capital support.",
    documents: "DPR, land documents, quotations, NOC from pollution board, bank statements.",
    link: "https://www.nabard.org",
  },
  {
    id: 5,
    title: "North East Pig Breeding Program",
    lead: "Special program for North Eastern states providing piglets, training, and subsidies for hilly and tribal regions.",
    focus: "Piglet distribution, training, feed subsidy, health monitoring, cooperative support, market linkages, breed improvement.",
    eligibility: "Farmers in NE states, tribal communities, hill farmers, women groups.",
    authority: "DAHD / State AH Departments in NE States.",
    subsidy: "90% subsidy for infrastructure, free piglets, feed subsidy ₹50/pig/month for 6 months.",
    documents: "Residential proof, tribal certificate, land documents, group registration (if applicable).",
    link: "https://dahd.nic.in",
  },
  {
    id: 6,
    title: "Swine Fever Vaccination Program",
    lead: "National vaccination drive preventing swine fever outbreaks with free/subsidized vaccines and training.",
    focus: "Vaccination, disease control, training, biosecurity, farm monitoring, outbreak prevention, awareness campaigns.",
    eligibility: "All pig farmers across India.",
    authority: "DAHD, Government of India / State Veterinary Departments.",
    subsidy: "100% free vaccination, compensation for diseased animals, emergency response support.",
    documents: "Farm registration, animal inventory, health records, farmer ID.",
    link: "https://dahd.nic.in",
  },
  {
    id: 7,
    title: "Pig Feed Subsidy Program",
    lead: "Reduces pig feed costs with subsidies covering 30–50% of feed expenses, including storage and feed production units.",
    focus: "Feed units, storage, quality nutrition, subsidy application, training, health management, cost reduction strategies.",
    eligibility: "Small pig farmers, feed manufacturers, cooperatives, SHGs.",
    authority: "Ministry of Agriculture & Farmers Welfare.",
    subsidy: "30-50% on feed cost, ₹2-5 per kg feed subsidy, storage infrastructure support.",
    documents: "Pig inventory, feed purchase bills, bank account, registration certificate.",
    link: "https://agricoop.nic.in",
  },
  {
    id: 8,
    title: "Pig Manure Management & Biogas Program",
    lead: "Encourages pig manure use for biogas and organic farming with subsidies for renewable energy and sustainable management.",
    focus: "Manure recycling, biogas plants, organic farming, subsidy support, technical guidance, energy sustainability, training.",
    eligibility: "Pig farmers with minimum 10 pigs, rural entrepreneurs, cooperatives.",
    authority: "Ministry of New & Renewable Energy / DAHD.",
    subsidy: "30-80% subsidy on biogas plants, ₹15,000-₹41,000 per unit, maintenance support.",
    documents: "Environmental clearance, technical feasibility report, land documents, pig farm registration.",
    link: "https://mnre.gov.in",
  },
  {
    id: 9,
    title: "Tribal Pig Farming Development Scheme",
    lead: "Scheme for tribal farmers promoting piggery livelihood with piglets, training, and cooperative support.",
    focus: "Tribal farmer support, cooperative farms, piglets, training, disease prevention, feed subsidy, market access.",
    eligibility: "Scheduled Tribes, tribal cooperatives, SHGs in tribal areas.",
    authority: "Ministry of Tribal Affairs / State Tribal Development Departments.",
    subsidy: "75-90% subsidy, free piglets, skill training, market linkage support, ₹50,000-₹2,00,000 per unit.",
    documents: "Tribal certificate, residential proof, group registration, project proposal, bank account.",
    link: "https://tribal.nic.in",
  }, 
  {
    id: 10,
    title: "State Livestock Mission – Pig Focus (Various States)",
    lead: "State-level missions support pig farms with subsidies, infrastructure, training, and health monitoring for productivity improvement.",
    focus: "State subsidies, training, health monitoring, breeding, infrastructure, biosecurity, market development.",
    eligibility: "Residents of respective states, varies by state policy.",
    authority: "State Animal Husbandry Departments / SLDBs.",
    subsidy: "State-specific rates, typically 25-50% subsidy, additional support for SC/ST/Women.",
    documents: "State-specific requirements, generally includes residence proof, project report, land documents.",
    link: "https://dahd.nic.in",
  },
];

export default function PigPolicies() {
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState({});
  
    const toggle = (id) => {
      setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };
  
    const filteredPolicies = policies.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.lead.toLowerCase().includes(search.toLowerCase()) ||
        p.focus.toLowerCase().includes(search.toLowerCase())
    );
  
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Navbar at top */}
        <Navbar />
  
        {/* Header */}
        <header className="bg-gradient-to-r from-teal-700 to-blue-800 text-white py-8 shadow-md text-center mt-16 md:mt-20">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold px-4">
            🐖 Pig Programs – Official Govt Links
          </h1>
        </header>
  
        {/* Search */}
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 text-center">
            <input
              type="text"
              className="w-11/12 sm:w-8/12 lg:w-2/3 p-3 rounded-full border-2 border-gray-300 
                         shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
              placeholder="Search policies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
  
          {/* Policies (stacked like poultry version) */}
          <div className="space-y-6">
            {filteredPolicies.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-lg shadow-md p-5 border-l-4 border-teal-700 relative 
                           transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Toggle Button */}
                <span
                  className="absolute top-3 right-3 bg-orange-400 text-white px-3 py-1 rounded-full 
                             cursor-pointer font-semibold text-xs sm:text-sm shadow-sm"
                  onClick={() => toggle(p.id)}
                >
                  {expanded[p.id] ? "− Less Info" : "+ More Info"}
                </span>
  
                {/* Title */}
                <h3 className="text-teal-700 text-lg sm:text-xl font-semibold mb-2">
                  {p.id}. {p.title}
                </h3>
  
                {/* Lead */}
                <p className="text-gray-600 mb-2 text-sm sm:text-base">{p.lead}</p>
  
                {/* Focus */}
                <p className="text-gray-800 font-medium text-sm sm:text-base">
                  <strong>Focus:</strong> {p.focus}
                </p>
  
                {/* Expanded Details */}
                {expanded[p.id] && (
                  <div className="mt-3 p-3 bg-orange-50 border-l-4 border-teal-700 rounded text-sm sm:text-base">
                    <p className="text-gray-700 mb-2">
                      <strong>Eligibility:</strong> {p.eligibility}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Authority:</strong> {p.authority}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Subsidy Details:</strong> {p.subsidy}
                    </p>
                    <p className="text-gray-700">
                      <strong>Required Documents:</strong> {p.documents}
                    </p>
                  </div>
                )}
  
                {/* Apply Button */}
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded 
                             font-semibold text-sm sm:text-base transition"
                >
                  Apply / Learn More
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

