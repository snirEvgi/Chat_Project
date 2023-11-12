import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css';
import { classNames } from 'primereact/utils';
import { userData } from '../../handlers/hashData';
import { Rating } from 'primereact/rating';
import newUserGuideVideo from "../../../upload/newHere.mp4"
import { motion as m, useScroll } from "framer-motion"
import Header from '../../UI-Components/header';
import SingleChatComponent from '../singleChat';
import List from '../../UI-Components/list/list';

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
  const [isSupportOn, setIsSupportOn] = useState<boolean>(false)
  const [chats, setChats] = useState<Array<any>>([{ chatId:1,firstUserId:1, secondUserId:2}])
  const headerRef = useRef(null);

  



  useEffect(() => {
    document.title = `Home`
  }, []);

 
  
  return (
    <div className="homePageDiv">
  <div className="chatHeader">
    <Header title="This is header" />
  </div>

  <div className="flexedContent">   
  <div className="leftSideList">
    <List chats={chats} />
  </div>
  <div className="rightSideContainer">
<SingleChatComponent/>
  </div>
  </div>
    </div>
  );
};

export default HomePage;
