import { Navigate } from "react-router-dom";
import NotFound from "../../pages/notFound";
import { userData } from "../../handlers/hashData";
const { id, role } = userData

export function ProtectedRoute(props: { children: any }) {
    const token = localStorage.getItem("token");
  
    if (token && role) {
      return props.children;
    } 
    else if (!token||!role ) {
      return <NotFound/>
      
          }
    else {
      return <Navigate to="/login" />;
    }
  }
 