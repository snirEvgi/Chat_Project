import React from 'react';
import "./Header.css"; 

const Header = ({ title }:any) => {
  return (
    <div className="header">
    <h1 className="title">{title}</h1>
  </div>
  );
};

export default Header;
