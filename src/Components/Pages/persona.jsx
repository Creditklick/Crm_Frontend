
// import React, { useState } from 'react';
// import { MdArrowDropDown } from "react-icons/md";
// import { IoMdArrowDropright } from "react-icons/io";
// import ShowDetails from './ShowDetails';
// import { Link } from 'react-router-dom';

// const Persona = ({ isDarkMode }) => {
//     const [isactive, setactive] = useState('basic');

//     const handleClick = (view) => {
//         setactive(view === isactive ? '' : view);
//         console.log("Active state are ", view);
//     };

//     return (
//         <div className="h-screen bg-gradient-to-r from-purple-600 to-indigo-500 ">
//             <div className="container max-w-full px-4 h-screen  py-8 mt-12">
//                 <button>  <Link to="/home" className="text-yellow-200 text-sm hover:text-white transition-all ">Back</Link></button>


//                 <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg">
//                     {/* Sidebar */}
//                     <div className="md:w-1/4 bg-gray-50 p-4 rounded-lg shadow-md">
//                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Sections</h2>
//                         <div className="space-y-2">
//                             {[
//                                 { name: 'Basic Information', value: 'basic' },
//                                 { name: 'Payment Information', value: 'payment' },
//                                 { name: 'Contact Details', value: 'contact' },
//                                 { name: 'Process and Product Information', value: 'product' },
//                                 { name: 'Permanent Address', value: 'permanentaddress' },
//                                 { name: 'Work Address and Details', value: 'workaddress' },
//                                 { name: 'Other Details', value: 'otherdetails' }
//                             ].map((item, index) => (
//                                 <div key={index} onClick={() => handleClick(item.value)}
//                                     className={`flex items-center justify-between text-lg font-medium p-3 rounded-md cursor-pointer transition-all duration-300 
//                                     ${isactive === item.value ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-blue-400 hover:text-white'}`}>
//                                     <button className="text-left">{item.name}</button>
//                                     <span className="text-xl">{isactive === item.value ? <IoMdArrowDropright /> : <MdArrowDropDown />}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Main Content */}
//                     <div className="md:w-3/4 bg-white p-6 rounded-lg shadow-md border-l border-gray-300">
//                         <h1 className="text-2xl font-bold text-gray-800 mb-6">Show Details</h1>
//                         <ShowDetails isactive={isactive}  />
//                     </div>
//                 </div>
//             </div>
//         </div >
//     );
// };

// export default Persona;

// --------------------------------------------------------------------------------------------------------




// import React, { useState } from 'react';
// import { MdArrowDropDown } from "react-icons/md";
// import { IoMdArrowDropright } from "react-icons/io";
// import ShowDetails from './ShowDetails';
// import { Link } from 'react-router-dom';

// const Persona = ({ isDarkMode }) => {
   
//     const [isactive, setactive] = useState('basic');

//     const handleClick = (view) => {
//         setactive(view === isactive ? '' : view);
//         console.log("Active state is ", view);
//     };

//     const sections = [
//         { name: 'Basic Information', value: 'basic' },
//         { name: 'Payment Information', value: 'payment' },
//         { name: 'Contact Details', value: 'contact' },
//         { name: 'Process and Product Information', value: 'product' },
//         { name: 'Permanent Address', value: 'permanentaddress' },
//         { name: 'Work Address and Details', value: 'workaddress' },
//         { name: 'Other Details', value: 'otherdetails' }
//     ];

//     return (
      
//             <div className="w-full mx-auto relative z-10">
                
              

//                 {/* Main Layout */}
//                 <div className="bg-white h-screen rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-4 relative top-16 overflow-visible">

                   
//                     <div className="bg-gray-100 p-5 space-y-3 md:col-span-1 border-r border-gray-300">
//                         <div className="text-xl font-bold text-gray-800 mb-4 space-x-3">
                             
//                         <Link
//                         to="/home"
//                         className=" text-gray-900 px-4 py-2 rounded-md text-sm  relative"
//                     >
//                         ⬅ Back
//                       </Link>
                             
                            
//                             <span>Payment Details</span></div>
//                         {sections.map((item, index) => (
//                             <div
//                                 key={index}
//                                 onClick={() => handleClick(item.value)}
//                                 className={`flex space-y-3 items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all group 
//                                     ${isactive === item.value
//                                         ? 'bg-blue-600 text-white shadow-md'
//                                         : 'bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-700'}`}
//                             >
//                                 <span className="text-sm font-medium">{item.name}</span>
//                                 <span className="text-xl transition-transform duration-300 group-hover:rotate-90">
//                                     {isactive === item.value ? <IoMdArrowDropright /> : <MdArrowDropDown />}
//                                 </span>
//                             </div>
//                         ))}

                        
//                     </div>

                 
//                     <div className="md:col-span-3 p-6 bg-white relative z-0 overflow-visible">
//                         <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">View Details</h1>
//                         <div className="relative z-10">
//                             <ShowDetails isactive={isactive} />
//                         </div>
//                     </div> 
//                 </div>

                
//             </div>
       
//     );
// };

// export default Persona;







import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import ShowDetails from './ShowDetails'; // Your component to show details

// Import lucide-react icons
import {
    ArrowLeft,
    User,
    CreditCard,
    Phone,
    Package,
    Home,
    Building2,
    ClipboardList,
    ChevronRight,
    LayoutGrid // Default icon
} from 'lucide-react';


// --- Helper Data ---
const LOCAL_STORAGE_KEY = 'personaActiveSection'; // Consistent key

// Map section values to icons
const sectionIcons = {
    basic: User,
    payment: CreditCard,
    contact: Phone,
    product: Package,
    permanentaddress: Home,
    workaddress: Building2,
    otherdetails: ClipboardList
};

const sections = [
    { name: 'Basic Information', value: 'basic' },
    { name: 'Payment Information', value: 'payment' },
    { name: 'Contact Details', value: 'contact' },
    { name: 'Product & Process', value: 'product' }, // Shortened name
    { name: 'Permanent Address', value: 'permanentaddress' },
    { name: 'Work Address', value: 'workaddress' }, // Shortened name
    // { name: 'Other Details', value: 'otherdetails' }
];



const Persona = ({ ...allDataProps }) => {

    const getInitialActiveState = () => {
        const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedState || 'basic';
    };
    const [activeSection, setActiveSection] = useState(getInitialActiveState);
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, activeSection);
    }, [activeSection]);

  
    const handleSectionClick = (view) => {
        setActiveSection(view);
        console.log("Active section set to:", view);
    };

   
    return (
       
        <div className="flex min-h-screen bg-background">
            <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 border-r bg-muted/30 flex flex-col">
                <div className=" p-4 border-b sticky top-200 text-white bg-muted/30 z-10">
                     <Button variant="secondary" size="sm" className="w-full justify-start text-sm hover:bg-gray-200" asChild>
                         <Link to="/home"> 
                             <ArrowLeft className="mr-2 h-4 w-4" />
                             Back to Home
                         </Link>
                    </Button>
                   
                </div>

               
                <ScrollArea className="flex-grow">
                    <nav className="p-4 space-y-1">
                        {sections.map((item) => {
                            const Icon = sectionIcons[item.value] || LayoutGrid; 
                            const isActive = activeSection === item.value;
                            return (
                                <Button
                                    key={item.value}
                                    variant={isActive ? "secondary" : "ghost"} 
                                    className={`w-full justify-start text-sm font-medium h-10 ${isActive ? 'text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    onClick={() => handleSectionClick(item.value)}
                                >
                                    <Icon className={`mr-2 h-4 w-4 ${isActive ? '' : 'opacity-80'}`} />
                                    {item.name}
                                    {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-70" />}
                                </Button>
                            );
                        })}
                    </nav>
                </ScrollArea>

                
            </aside>

           
            <main className="flex-grow  mt-12 p-4 md:p-6 lg:p-8 overflow-y-auto relative">
               
                 <motion.div
                    key={activeSection} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                 >
                 
                    
                   
                    <ShowDetails isactive={activeSection}  objectdata = {allDataProps}  />
                 </motion.div>
            </main>

        </div>
    );
};

export default Persona;










// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion'; // For animations
// import { Link } from 'react-router-dom'; // For the Back button link
// import { Button } from "@/Components/ui/button"; // Shadcn Button
// import { ScrollArea } from "@/components/ui/scroll-area"; // For scrollable sidebar nav
// import ShowDetails from './ShowDetails'; // Your component that renders Basic, Payment, etc.

// // Import lucide-react icons
// import {
//     ArrowLeft,
//     User,
//     CreditCard,
//     Phone,
//     Package,
//     Home,
//     Building2,
//     ClipboardList,
//     ChevronRight,
//     LayoutGrid // Default/Fallback icon
// } from 'lucide-react';

// // --- Helper Data ---
// const LOCAL_STORAGE_KEY = 'personaActiveSection'; // Key for localStorage

// // Map section values to corresponding lucide-react icons
// const sectionIcons = {
//     basic: User,
//     payment: CreditCard,
//     contact: Phone,
//     product: Package,
//     permanentaddress: Home,
//     workaddress: Building2,
//     otherdetails: ClipboardList
// };

// // Define the sections for navigation
// const sections = [
//     { name: 'Basic Information', value: 'basic' },
//     { name: 'Payment Information', value: 'payment' },
//     { name: 'Contact Details', value: 'contact' },
//     { name: 'Product & Process', value: 'product' }, // Using slightly shorter names for clarity
//     { name: 'Permanent Address', value: 'permanentaddress' },
//     { name: 'Work Address', value: 'workaddress' },
//     { name: 'Other Details', value: 'otherdetails' }
// ];

// // --- Component ---

// // Removed unused isDarkMode prop. Added ...allDataProps to pass necessary data down.
// const Persona = ({ ...allDataProps }) => {

//     // --- State with Persistence ---
//     // Function to get the initial state from localStorage or default
//     const getInitialActiveState = () => {
//         try {
//              const storedState = localStorage.getItem(LOCAL_STORAGE_KEY);
//              // Check if the stored state is a valid section value, otherwise default
//              const isValid = sections.some(section => section.value === storedState);
//              return isValid ? storedState : 'basic';
//         } catch (error) {
//             console.error("Error reading localStorage key “" + LOCAL_STORAGE_KEY + "”:", error);
//             return 'basic'; // Default on error
//         }
//     };

//     const [activeSection, setActiveSection] = useState(getInitialActiveState);

//     // Effect hook to save the active section to localStorage whenever it changes
//     useEffect(() => {
//         try {
//              localStorage.setItem(LOCAL_STORAGE_KEY, activeSection);
//         } catch (error) {
//             console.error("Error setting localStorage key “" + LOCAL_STORAGE_KEY + "”:", error);
//         }
//     }, [activeSection]); // Dependency array ensures this runs only when activeSection changes

//     // --- Handlers ---
//     // Handles clicking on a navigation section in the sidebar
//     const handleSectionClick = (view) => {
//         setActiveSection(view);
//         // console.log("Active section set to:", view); // Keep for debugging if needed
//     };

//     // --- Render Logic ---
//     return (
//         // Main layout container: Uses Flexbox, ensures minimum screen height
//         <div className="flex min-h-screen bg-background text-foreground">

//             {/* --- Sidebar Navigation --- */}
//             <aside className="w-full md:w-60 lg:w-64 xl:w-72 flex-shrink-0 border-r bg-muted/30 flex flex-col">
//                 {/* Sidebar Header: Back button */}
//                 <div className="p-3 border-b sticky top-0 bg-muted/30 z-10">
//                      <Button variant="ghost" size="sm" className="w-full justify-start text-sm font-medium text-muted-foreground hover:text-foreground" asChild>
//                          <Link to="/home"> {/* Ensure this path is correct */}
//                              <ArrowLeft className="mr-2 h-4 w-4" />
//                              Back to Home
//                          </Link>
//                     </Button>
//                 </div>

//                 {/* Scrollable Navigation Area */}
//                 <ScrollArea className="flex-grow"> {/* Allows scrolling if many sections */}
//                     <nav className="px-3 py-4 space-y-1">
//                         {sections.map((item) => {
//                             const Icon = sectionIcons[item.value] || LayoutGrid; // Get icon or fallback
//                             const isActive = activeSection === item.value;
//                             return (
//                                 <Button
//                                     key={item.value}
//                                     variant={isActive ? "secondary" : "ghost"} // Highlight active item
//                                     size="sm" // Slightly smaller buttons
//                                     className={`w-full justify-start text-sm h-9 ${isActive ? 'font-semibold' : 'font-normal text-muted-foreground hover:text-foreground'}`}
//                                     onClick={() => handleSectionClick(item.value)}
//                                     aria-current={isActive ? 'page' : undefined} // Accessibility
//                                 >
//                                     <Icon className={`mr-2 h-4 w-4 ${isActive ? '' : 'opacity-80'}`} />
//                                     {item.name}
//                                     {/* Optional: Add indicator for active item */}
//                                     {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-60" />}
//                                 </Button>
//                             );
//                         })}
//                     </nav>
//                 </ScrollArea>

//                 {/* Optional Sidebar Footer */}
//                 {/* <div className="p-4 border-t mt-auto"> Footer content </div> */}
//             </aside>

//             {/* --- Main Content Area --- */}
//             <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto relative">
//                 {/* Animation wrapper for content changes */}
//                  <motion.div
//                     key={activeSection} // Unique key triggers animation on change
//                     initial={{ opacity: 0, x: 10 }} // Start slightly to the right, faded out
//                     animate={{ opacity: 1, x: 0 }} // Animate to fully visible, original position
//                     transition={{ duration: 0.3, ease: 'easeInOut' }}
//                     className="h-full" // Ensure motion div takes height if needed
//                  >
//                     {/* Render the specific details component based on activeSection */}
//                     {/* Pass down the active section state and ALL other necessary props */}
//                     <ShowDetails activeSection={activeSection} {...allDataProps} />
//                  </motion.div>
//             </main>

//         </div>
//     );
// };

// export default Persona;