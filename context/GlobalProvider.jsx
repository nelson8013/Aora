import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser } from '../lib/appwrite';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext)

export const GlobalProvider = ({children}) => {
 //create states
 const [isLoggedIn, setIsLoggedIn] = useState(false)
 const [user, setUser] = useState(null)
 const [isLoading, setIsLoading] = useState(true)

 const fetchUser = async () => {
  try {
    const response = await getCurrentUser(); 
    if (response) {
      setIsLoggedIn(true);
      setUser(response);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setIsLoading(false);
  } 
};

 useEffect(() => {
  fetchUser(); 
}, []);

 return(
  <GlobalContext.Provider
     value={{
      isLoggedIn,
      setIsLoggedIn,
      user,
      setUser,
      isLoading
    }}
  >
  {children}
  </GlobalContext.Provider>
 )
}