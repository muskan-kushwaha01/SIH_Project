import React, { useState } from "react";
import Navbar from "../components/Navbar";

const policies = [
  {
    id: 1,
    title: "Poultry Development Scheme (State-level)",
    lead: "State governments provide training, subsidies, and infrastructure support for small-scale poultry farmers.",
    focus: "Backyard poultry, vaccination, training, sheds.",
    eligibility: "Small & marginal farmers, SHGs, women entrepreneurs.",
    authority: "Respective State Animal Husbandry Department.",
    link: "https://dahd.gov.in/schemes-programmes",
  },
  {
    id: 2,
    title: "Rashtriya Gokul Mission (Poultry Component)",
    lead: "Promotes indigenous poultry breeds, conservation, and improved productivity.",
    focus: "Breed improvement, training, Gokul Grams.",
    eligibility: "Registered farmers, FPOs, poultry breeders.",
    authority: "DAHD, Government of India.",
    link: "https://dahd.gov.in/schemes/programmes/rashtriya_gokul_mission",
  },
  {
    id: 3,
    title: "Poultry Venture Capital Fund (PVCF)",
    lead: "Credit-linked subsidy scheme for establishing poultry units and hatcheries.",
    focus: "Capital subsidy, infrastructure support, feed facilities.",
    eligibility: "Entrepreneurs, FPOs, SHGs.",
    authority: "NABARD / DAHD.",
    link: "https://www.nabard.org/content.aspx?id=599",
  },
  {
    id: 4,
    title: "National Livestock Mission (NLM) – Poultry",
    lead: "Central mission supporting small poultry farmers and backyard units.",
    focus: "Entrepreneurship, poultry feed & management, skill development.",
    eligibility: "Individual farmers, FPOs, groups.",
    authority: "DAHD, Government of India.",
    link: "https://dahd.gov.in/schemes/programmes/national_livestock_mission",
  },
  {
    id: 5,
    title: "Entrepreneurship Development & Employment Generation (EDEG)",
    lead: "Financial support for setting up commercial poultry units under NLM.",
    focus: "Promote poultry entrepreneurship via credit and subsidy.",
    eligibility: "Farmers, SHGs, FPOs, private entrepreneurs.",
    authority: "DAHD / NABARD.",
    link: "https://dahd.gov.in/nlm-scheme-brochure",
  },
  {
    id: 6,
    title: "State Livestock Development Boards – Poultry",
    lead: "State-level boards provide support for poultry sheds, vaccination, and extension services.",
    focus: "Subsidies, veterinary care, local infrastructure.",
    eligibility: "Residents of the state; rules vary by state.",
    authority: "State AH Departments / SLDBs.",
    link: "https://dahd.gov.in/schemes-programmes",
  },
  {
    id: 7,
    title: "Rural Backyard Poultry Development",
    lead: "Promote backyard poultry units for nutrition, income, and women empowerment.",
    focus: "Free chicks, training, inputs for BPL households.",
    eligibility: "Rural families, SHGs, BPL households.",
    authority: "DAHD / State AH Departments.",
    link: "https://www.myscheme.gov.in/schemes/sebpu",
  },
  {
    id: 8,
    title: "Pradhan Mantri Matsya Sampada Yojana (PMMSY) – Poultry Feed Support",
    lead: "Strengthens feed infrastructure and integration to reduce poultry feed cost.",
    focus: "Feed units, quality improvement, cost reduction.",
    eligibility: "Entrepreneurs, farmers, cooperatives.",
    authority: "Department of Fisheries (GoI).",
    link: "https://pmmsy.dof.gov.in/",
  },
  {
    id: 9,
    title: "National Animal Disease Control Programme (NADCP) – Poultry",
    lead: "Mass vaccination and disease control targeting poultry, FMD, Brucellosis.",
    focus: "Disease surveillance, vaccination campaigns, awareness.",
    eligibility: "All poultry farmers.",
    authority: "DAHD, Govt. of India.",
    link: "https://www.dahd.gov.in/schemes/programmes/nadcp",
  },
  {
    id: 10,
    title: "Livestock Health & Disease Control Programme (LH&DC)",
    lead: "Improve veterinary services, mobile veterinary units, and poultry disease surveillance.",
    focus: "Vaccination, affordable veterinary services, diagnostics.",
    eligibility: "Poultry owners; implemented via states.",
    authority: "DAHD, Government of India.",
    link: "https://dahd.gov.in/schemes-programmes/lh-dc",
  },
];

function Policies() {
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
        <Navbar />
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-700 to-blue-900 mt-16 md:mt-20 text-white py-6 shadow-md text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center justify-center gap-2">
          <i className="fas fa-leaf"></i> Poultry Programs – Official Govt Links
        </h1>
      </header>

      {/* Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 text-center">
          <input
            type="text"
            placeholder="Search policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-11/12 sm:w-8/12 lg:w-2/3 p-3 rounded-full border-2 border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
          />
        </div>

        {/* Policies */}
        <div className="space-y-6">
          {filteredPolicies.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-md p-5 border-l-4 border-teal-700 relative transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Toggle Button */}
              <span
                className="absolute top-3 right-3 bg-orange-400 text-white px-3 py-1 rounded-full cursor-pointer font-semibold text-xs sm:text-sm shadow-sm"
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

              {/* Extra Details */}
              {expanded[p.id] && (
                <div className="mt-3 p-3 bg-orange-50 border-l-4 border-teal-700 rounded">
                  <p className="text-sm sm:text-base">
                    <strong>Eligibility:</strong> {p.eligibility}
                  </p>
                  <p className="text-sm sm:text-base">
                    <strong>Authority:</strong> {p.authority}
                  </p>
                </div>
              )}

              {/* Link */}
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded font-semibold text-sm sm:text-base transition"
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

export default Policies;
