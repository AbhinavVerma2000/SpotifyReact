import React, { useEffect } from "react";

const Nav = ({open, r, g, b, selected, setSelected, isMobile }) => {
  const changeSelected = (e) => {
    const choice = e.target.innerText;
    setSelected(choice);
    const items = document.querySelectorAll(".home ul li");
    items.forEach((item) => {
      item.style.color = "rgba(255, 254, 254, 0.536)";
    });
    e.target.style.color = "white";

  }
  useEffect(()=>{
    let itms = document.querySelectorAll(".home ul li");

    itms.forEach((item) => {
      if(item.innerHTML === selected){
        item.style.color = "white";
      }else{
        item.style.color = "rgba(255, 254, 254, 0.536)";
      }
    });
    const smscreen =  document.querySelectorAll("#bgsm")
    smscreen[1].style.width = "100%"
    // smscreen[1].style.background = `linear-gradient(45deg, rgba(${r}, ${g}, ${b}, 0.712) 0%, rgba(0, 0, 0,1) 100%)`
  }, [selected, open, r, g, b])
  return (
    <div
      className="flexcol" id="bgsm"
      style={{ 
        paddingLeft: "2rem",
        height: "100%",
        justifyContent: "space-between",
        position: "absolute", zIndex:"4"
      }}
    >
      <div className="home">
        <div className="logo">
          <img
            className="invert" style={{cursor:"pointer"}}
            src="logo.svg"
            alt=""
            height={60}
            width={130}
          />
        </div>
        <ul>
          <li onClick={(e) => changeSelected(e)}>For You</li>
          <li onClick={(e) => changeSelected(e)}>Top Tracks</li>
          <li onClick={(e) => changeSelected(e)}>Favourites</li>
          <li onClick={(e) => changeSelected(e)}>
            Recently Played
          </li>
        </ul>
      </div>
      <div id="prof" style={{position: "absolute"}}>
        <div className="profile" style={{ backgroundImage: "url(profile.png)" }}/>
      </div>
    </div>
  );
};

export default Nav;
