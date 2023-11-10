import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';
import { classNames } from 'primereact/utils';
import { userData } from '../../handlers/hashData';
import { Rating } from 'primereact/rating';
import newUserGuideVideo from "../../../upload/newHere.mp4"
import { motion as m, useScroll } from "framer-motion"

const initialReviews = [
  {
    author: 'Nikol Malul',
    rating: 5,
    text: 'I had an amazing experience with Fly-High! The trip was well-organized, and I got to explore beautiful destinations. Highly recommended!',
    image: "https://media.istockphoto.com/id/468382096/photo/scottish-fold-shorthair-cat-resting-on-chair.jpg?s=612x612&w=0&k=20&c=h4wd1YM47fJgJwi9B-HnFxaFYE1M1WUB-d7atkH7mG8=",

  },
  {
    author: 'Yuval Chen',
    rating: 4,
    text: 'Fly-High exceeded my expectations! The accommodations were top-notch, and the activities were so much fun. I\'ll definitely book again.',
    image: "https://media.istockphoto.com/id/1476170969/photo/portrait-of-young-man-ready-for-job-business-concept.jpg?s=612x612&w=0&k=20&c=w8SlKv-4u6xYyU07CXeBRvfW6F0iYx-a7HR2ChM8ZbU="


  },
  {
    author: 'Max Brenner',
    rating: 5,
    text: 'I\'m a frequent traveler, and Fly-High is one of the best travel companies I\'ve come across. Their customer service is outstanding!',
    image: "https://media.istockphoto.com/id/537406958/photo/max-brenner.jpg?s=612x612&w=0&k=20&c=aqutOseyz64rojpc2407FYFI41_k2rJ9oFQ6NuK-iWw=",
  }

];

const { id, role, first_name, last_name } = userData;
const userRole = role;
type IReview = typeof initialReviews
const HomePage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState(initialReviews);
  const [userId, setUserId] = useState<number>(0);
  const [isSupportOn, setIsSupportOn] = useState<boolean>(false)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const headerRef = useRef(null);
  const trainingGuideRef = useRef(null);
  const whyChooseUsRef = useRef(null);
  const featuredDestinationsRef = useRef(null);
  const customerReviewsRef = useRef(null);
  const footerRef = useRef(null);

  



  useEffect(() => {
    document.title = `Home`
    setUserId(Number(id));
  }, []);

 
  const scrollToSection = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setCurrentSectionIndex(0);
  };

  const handleSupportChat = async () => {
    setIsSupportOn(!isSupportOn)
  };

  return (
    <div className="mainHomePageDiv">
    <div className="homepage">
    
      <div className="scrollUp" onClick={() => { scrollToSection() }}>
        <i className="pi pi-angle-double-up"></i>
      </div>
     
       
        <header className="header" ref={headerRef}>


          <h1 className="title">Welcome to Our Chat</h1>
        </header>


     
      <footer className="footer" ref={footerRef}>
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Fly-High</p>
          <div className="contact-support">
            <p>Contact Our Support Team:</p>
            <a href="mailto:support@flyhigh.com">support@flyhigh.com</a>
          </div>
        </div>
      </footer>
    </div>
    </div>
  );
};

export default HomePage;
