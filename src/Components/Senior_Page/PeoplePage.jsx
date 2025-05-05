import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope, FaSearch } from 'react-icons/fa';
import developer1 from './../../assets/developer1.jpg'
import ceo from './../../assets/ceo.jpg'
import processhead1 from './../../assets/process1.jpg'
const people = [
  // CEO
  {
    id: 1,
    name: 'Dharmendra Kalra',
    designation: 'CEO',
    image: ceo,
    bio: 'Visionary leader driving innovation and strategic growth',
    links: { linkedin: '#', email: '#' }
  },
  // Team Leaders
  {
    id: 2,
    name: 'Liam Johnson',
    designation: 'Team Leader',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
    bio: 'Empowering teams to achieve technical excellence',
    links: { linkedin: '#', github: '#', twitter: '#' }
  },
  {
    id: 3,
    name: 'Olivia Chen',
    designation: 'Team Leader',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
    bio: 'Digital transformation expert with passion for AI',
    links: { linkedin: '#', github: '#' }
  },
  // Process Heads
  {
    id: 4,
    name: 'Chandan Singh',
    designation: 'Process Head',
    image: processhead1,
    bio: 'Optimizing workflows for maximum efficiency',
    links: { linkedin: '#', email: '#' }
  },
  {
    id: 5,
    name: 'Ava Martinez',
    designation: 'Process Head',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava',
    bio: 'Quality assurance and process improvement specialist',
    links: { linkedin: '#', twitter: '#' }
  },
  // Developers
  {
    id: 6,
    name: 'Gaurav Yadav',
    designation: 'Developer',
    image: developer1,
    bio: 'Full-stack developer with React expertise',
    links: { github: '#', twitter: '#' }
  },
  {
    id: 7,
    name: 'James Wilson',
    designation: 'Developer',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    bio: 'Mobile app development specialist',
    links: { linkedin: '#', github: '#' }
  }
];

function PeoplePage() {
  const [selectedDesignation, setSelectedDesignation] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const designations = ['all', 'CEO', 'Team Leader', 'Process Head', 'Developer'];

  const filteredPeople = people.filter(person => {
    const matchesDesignation = selectedDesignation === 'all' || 
      person.designation === selectedDesignation;
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDesignation && matchesSearch;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 100 
      }
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)'
    }
  };

  return (
    <div className="min-h-screen  mt-20 p-8 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #fca5a5 0%, #fde68a 30%, #d97706 70%, #d97706 100%)`,      }}   
    >
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl text-black font-bold mb-8  text-center drop-shadow-lg"
        >
          Our Amazing Team
        </motion.h1>

        {/* Search and Filter */}
        <motion.div 
          className="mb-8 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search team members..."
              className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-4 " />
          </div>
          
          <div className="flex gap-2 flex-wrap justify-center">
            {designations.map((designation) => (
              <motion.button
                key={designation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDesignation(designation)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors
                  ${selectedDesignation === designation
                    ? 'bg-white text-black-600 shadow-lg'
                    : 'bg-white/80 backdrop-blur-sm hover:bg-white text-black-500'}`}
              >
                {designation}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* People Grid */}
        <AnimatePresence>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredPeople.map((person) => (
              <motion.div
                key={person.id}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover="hover"
                className="bg-transparent backdrop-blur-sm rounded-xl p-6 shadow-lg
                  hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="flex flex-col items-center mb-4">
                  <motion.img
                    src={person.image}
                    alt={person.name}
                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 
                      border-purple-200 shadow-md"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: 'spring' }}
                  />
                  <h2 className="text-xl font-bold text-gray-800">{person.name}</h2>
                  <p className={`text-sm font-semibold ${
                    person.designation === 'CEO' ? 'text-purple-600' :
                    person.designation === 'Team Leader' ? 'text-pink-500' :
                    person.designation === 'Process Head' ? 'text-blue-500' :
                    'text-green-500'
                  }`}>
                    {person.designation}
                  </p>
                </div>
                
                <p className="text-gray-600 mb-4 text-center">{person.bio}</p>
                
                <motion.div 
                  className="flex justify-center space-x-4"
                  whileHover={{ scale: 1.1 }}
                >
                  {Object.entries(person.links).map(([key, value]) => {
                    const Icon = {
                      linkedin: FaLinkedin,
                      github: FaGithub,
                      twitter: FaTwitter,
                      email: FaEnvelope
                    }[key];
                    
                    return (
                      <motion.a
                        key={key}
                        href={value}
                        className="p-2 rounded-full bg-white shadow-md hover:shadow-lg"
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon 
                          className={
                            key === 'linkedin' ? 'text-blue-600' :
                            key === 'github' ? 'text-gray-800' :
                            key === 'twitter' ? 'text-sky-500' :
                            'text-purple-500'
                          } 
                          size={20}
                        />
                      </motion.a>
                    );
                  })}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {filteredPeople.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-white font-medium"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl mb-4"
              >
                👥
              </motion.div>
              No team members found matching your criteria
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PeoplePage;