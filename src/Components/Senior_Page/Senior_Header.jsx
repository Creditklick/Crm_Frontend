import React ,{useEffect, useState}from 'react'
import { MdDashboard, MdGroups, MdRateReview, MdSettings, MdExitToApp, MdMenu, MdClose } from "react-icons/md";
import image from './../../assets/logo.png'
import {  useNavigate } from 'react-router-dom';

import SeniorDashboard from './SeniorDashboard';
import Senior_Setting from './Senior_Setting';
import { Input } from "@/components/ui/input";
import { MdSearch } from 'react-icons/md';
import Senior_Footer from './Senior_Footer';
import PeoplePage from './PeoplePage';
import Review from './Review';
function Senior_Header() {
       
    const [ current_active_state , setCurrent_Active_State ] = useState('Dashboard');

    const [isOpen, setIsOpen] = useState(false);
    const [searchvalue,setSearchValue] = useState('');
    const navigate = useNavigate();

    const ListItem = [
        {
          name: "Dashboard",
          icons: <MdDashboard className="text-blue-500" />,
          color: "text-blue-500",
          onclick : ()=>{setCurrent_Active_State("Dashboard"),setIsOpen(false),window.scrollTo(0,0);
          }
        },
        {
          name: "People",
          icons: <MdGroups className="text-green-500" />,
          color: "text-green-500",
          onclick : ()=>{setCurrent_Active_State("People"),setIsOpen(false),window.scrollTo(0,0)}
        },
        {
          name: "Review",
          icons: <MdRateReview className="text-yellow-500" />,
          color: "text-yellow-500",
          onclick : ()=>{setCurrent_Active_State("Review"),setIsOpen(false),window.scrollTo(0,0)}
        },
        // {
        //   name: "Setting",
        //   icons: <MdSettings className="text-purple-500" />,
        //   color: "text-purple-500",
        //   onclick : ()=>{setCurrent_Active_State("Setting"),setIsOpen(false)}
        // },
        {
            name : "logout",
            icons: <MdExitToApp className="text-red-500" />,
            color: "text-red-500",
            onclick : ()=>hanldeLogout()
        }
      ];


      const hanldeLogout = ()=>{
          const token = localStorage.getItem('token');
    
               localStorage.removeItem('token');
               setTimeout(()=>{

               },1);
               navigate('/' , {repalce : true}) ;
         
         
      }

  


      useEffect(()=>{
         console.log("vlau is ",current_active_state);
      },[current_active_state]);


      const handleSetting = ()=>{
          console.log("call setting");
      }
      const handlePeople = ()=>{
        console.log("call people");

      }
      const handleDashboard = ()=>{
          navigate('/senior_dashboard/dashboard')
      }
      const handleReview = ()=>{
         console.log("cAll review");
      }



      const handleSearchUser = (e) => {
        const value = e.target.value;
        setSearchValue(value);
      
         const params = new URLSearchParams(location.search);
         console.log("this is params this time ",params);
        if (value.trim()) {
          params.set("search", value.trim());
        } else {
          params.delete("search");
        }
      
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
      };
      

      useEffect(()=>{
         console.log("value is = ",searchvalue)
      })
      
     
     

  return (
    <div className=''
   

    >
   
  <div className='fixed  bg-gradient-to-b from bg-gray-200  top-0 left-0 w-full z-50  flex justify-between px-4 py-1 shadow-lg shadow-red-400 items-center'>
          
             

             <div className='width-[20%] py-2'>
                 <div className='bg-white   rounded-full flex items-center'>
                 <img src={image} width={'60px'} height={"60px"} alt="creditklick"/>  
                 <h1 className=' text-lg font-bold  px-2 py-1  rounded-lg hidden md:block'>Credit Klick</h1>  
                </div>
               
             </div>


             <div className='hidden  sm:block width-[80%]  '>
                      <div className='grid grid-cols-3 gap-4 items-center'>

                        <div className='col-span-1'>
                           <div className='flex items-center relative  '>
                         
                           <Input
  value={searchvalue}
  onChange={handleSearchUser}
  type="text"
  placeholder="Search here.."
  className="bg-white shadow-lg shadow-red-400"
/>

                           <MdSearch className="absolute right-[10px] text-2xl  text-gray-600 cursor-pointer hover:scale-105 " />
                           </div>
                        
                          
                          </div>
                        <div className='col-span-2'>
                        <div className="bg-white  flex rounded-full space-x-5 ">

                  
  {
      ListItem.map((item,index)=>(
          <div key={index}
            onClick = {item.onclick}
          className='flex items-center  cursor-pointer hover:bg-gray-600 shadow-lg shadow-white hover:text-white gap-2 border-2 border-white rounded-full px-2 py-2'>
                  <span>{item.icons}</span>

                  <span>{item.name}</span>
          
          </div>
      )) 
  }
      </div>


                        </div>
                        
                        
                  
                        
                        </div>

             </div>   


             <div className="sm:hidden flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-2xl p-2 text-gray-700 focus:outline-none z-5-"
      >

        {isOpen ? <MdClose  /> : <MdMenu />}
      </button>
        

       <div 
      
        className={`
          absolute top-0 left-0 w-full bg-white shadow-lg z-40
          transform transition-all duration-500 origin-top
          ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}
        `}
     
       >

       {isOpen && (
        
        <div className="absolute top-20
         
          
         left-0 w-full shadow-md z-50">
              {
                         ListItem.map((item,index)=>(
                              <div key={index}
                               onClick = {item.onclick}
                              
                              className='flex 
                               bg-white hover:bg-gray-300
                              items-center cursor-pointer  font-medium   gap-2   px-2 py-1'>
                                     <span>{item.icons}</span>
 
                                     <span>{item.name}</span>
                              
                              </div>
                         )) 
                     }
                
         </div>
 
       

      )}
      </div> 
     
            </div>
            


             
  </div>
  <div>
  {
  current_active_state === 'Dashboard' ? <SeniorDashboard  /> :
  current_active_state === 'Setting' ? <Senior_Setting /> :
  current_active_state === 'People' ? <PeoplePage /> :
  current_active_state==='Review' ? <Review/> :
  null
}

    </div>
    
     <Senior_Footer/>
  </div>
  
  )
}

export default Senior_Header