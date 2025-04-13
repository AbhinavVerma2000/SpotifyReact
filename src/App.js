import React, { useEffect, useRef, useState } from "react";
import "./App.scss";
import Nav from "./components/Nav";
import Songs from "./components/Songs";
import Playing from "./components/Playing";
import { useSelector } from "react-redux";

function App() {
  const [selected, setSelected] = useState("For You");
  const [songs, setSongs] = useState([]);
  const [bgColor, setBgColor] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [q, setQ] = useState([]);
  const [ps, setPS] = useState({});
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const audioRef = useRef(null);

  const recent = useSelector((state) => state.recentSlice.value);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function getSongs() {
      const response = await fetch("data.json");
      const data = await response.json();
      setSongs(data);
      if (!loaded) {
        if (recent.length !== 0) {
          setPS(recent[0]);
        } else {
          setPS(data[0]);
        }
        setLoaded(true);
      }
    }
    getSongs();
    const mediaQuery = window.matchMedia('(min-width: 1400px)');
    setIsMobile(!mediaQuery.matches);
    if (open) {
      // Make sure it's visible BEFORE triggering the transition
      // document.querySelector(".leftsm").style.display = "block";
      // Force reflow to make sure the browser picks up the display change
      // void document.querySelector(".leftsm").offsetWidth;
      // Then trigger the slide-in animation
      document.querySelector(".leftsm").style.transform = "translateX(0%)";
    } else {
      document.querySelector(".leftsm").style.transform = "translateX(100%)";
      // document.querySelector(".leftsm").addEventListener(
      //   "transitionend",
      //   () => {
      //     document.querySelector(".leftsm").style.display = "none";
      //   },
      //   { once: true }
      // );
    }
    if(open2){

    }
  }, [loaded, recent, open, open2]);
  return (
    <div
      className="container"
      style={{
        background: `linear-gradient(45deg, rgba(${bgColor[0]}, ${bgColor[1]}, ${bgColor[2]}, 0.712) 0%, rgba(0, 0, 0, 1) 100%)`,
      }}
    >
      {open && isMobile && (
        <div
          style={{
            backdropFilter: "blur(2px)",
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: "3",
          }}
        />
      )}
      <div className="left">
        <Nav isMobile={isMobile}
          open={open}
          r={bgColor[0]}
          g={bgColor[1]}
          b={bgColor[2]}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
      <Songs setBgColor={setBgColor} bgColor={bgColor} ps={ps} isMobile={isMobile}
        setOpen={setOpen} setOpen2={setOpen2} open2={open2}
        open={open}
        setPS={setPS}
        r={bgColor[0]}
        g={bgColor[1]}
        b={bgColor[2]}
        q={q}
        setQ={setQ}
        setSelected={setSelected}
        audioRef={audioRef}
        songs={songs}
        selected={selected}
        setPlaying={setPlaying}
        playing={playing}
      />
      <div className="playlg">
        <Playing isMobile={isMobile}
          ps={ps}
          setPS={setPS}
          q={q}
          selected={selected}
          audioRef={audioRef}
          bgColor={bgColor}
          setBgColor={setBgColor}
          setPlaying={setPlaying}
          playing={playing}
          songs={songs}
        />
      </div>
    </div>
  );
}

export default App;
