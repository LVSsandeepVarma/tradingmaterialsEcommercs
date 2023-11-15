import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const withAuth = (WrappedComponent) => {


    // eslint-disable-next-line no-unused-vars
    const WithProtection = (props)=>{
        const navigate = useNavigate();
        const checkAuthentication = async()=>{
            const token = sessionStorage.getItem("client_token")?.length ? sessionStorage.getItem("client_token") : localStorage.getItem("client_token")
            console.log(token)
            if(token == null){
                const lsToken = localStorage.getItem("client_token")
                if(lsToken == null){
                    window.location.href="/login"
                }
                else{
                    navigate("/")
                }
                
            }
        }
        useEffect(()=>{
            checkAuthentication()
           
        },[checkAuthentication])
        // eslint-disable-next-line react/react-in-jsx-scope
        return <>
         {/* eslint-disable-next-line react/react-in-jsx-scope */}
        <WrappedComponent  />
        </> 
    }
    return WithProtection
    
  };


export default withAuth;