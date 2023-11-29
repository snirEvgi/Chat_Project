import  { useEffect, useState } from 'react';


export default function NotFound() {
  const [isSupportOn, setIsSupportOn] = useState<boolean>(false)
useEffect(()=>{
  document.title = `404 Not Found`
},[])
  const handleSupportChat = async () => {
    setIsSupportOn(!isSupportOn)
  };
  return (
    <div className="notFoundContainer">
     
      <div className="notFoundContent">
        <h1 className="notFoundHeader">404</h1>
        <h2 className="notFoundSubheader">Page Not Found</h2>
        <p className="notFoundMessage">
          Sorry, the page you are looking for might be in another universe.
        </p>
      </div>
    </div>
  );
}
