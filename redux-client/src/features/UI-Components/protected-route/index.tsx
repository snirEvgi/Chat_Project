import { Navigate } from "react-router-dom";
import NotFound from "../../pages/notFound";


export function ProtectedRoute(props: { children: any }) {
  const userData = JSON.parse(localStorage.getItem("userRecord") as any)
    const token = localStorage.getItem("token");
  
    if (token  ){
      return props.children;
    } 
    // else if (!token ) {
    //   return <NotFound/>
      
    //       }
    else {
      return <Navigate to="/login" />;
    }
  }
 