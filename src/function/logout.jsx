import axios from 'axios'
import { toast } from 'react-toastify';
export const handleLogout = async (setIsAuthenticated,navigate) => {
    console.log("Logout call in dashboard")
    const token = localStorage.getItem('token');
    console.log("token is ",token);
    try {

     const response = await axios.post('https://crm-backend-msk3.onrender.com/searchapp/api/user/logout',{},
       {
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         }
       }
     );
     
        localStorage.removeItem("token");
       
        setIsAuthenticated(false);
        alert("Logout successfully");
       
    
            navigate('/', { replace: true });
          
        
        console.log("log out successfully");
       

    } catch (error) {
        console.error('Error logging out:', error.response ? error.response.data : error.message);
        toast.error('Logout failed. Please try again.');
    }
};