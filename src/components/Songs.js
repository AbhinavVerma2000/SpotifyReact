import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updaterec } from "../features/recentSlice";
import Nav from "./Nav";
import Playing from "./Playing";

const Songs = ({
  setOpen, setOpen2, open2, isMobile,
  open,
  selected,
  setSelected,
  songs,
  setPlaying,
  setPS,
  audioRef,
  setQ,
  q,
  r,
  g,
  b, bgColor, setBgColor, ps, playing
}) => {
  const recent = useSelector((state) => state.recentSlice.value);
  const vol = useSelector((state) => state.recentSlice.volume);
  const dispatch = useDispatch();
  const fav = useSelector((state) => state.favouriteSlice.value);
  const [sinp, setSinp] = useState("");
  const [res, setRes] = useState([]);

  const timeoutRef = useRef(null);

  const handleQ = (song) => {
    if (selected === "For You") {
      const ind = songs.findIndex((it) => it.id === song.id);
      setQ([...songs.slice(ind, songs.length), ...songs.slice(0, ind)]);
    }
    if (selected === "Recently Played") {
      const ind = recent.findIndex((it) => it.id === song.id);
      setQ([...recent.slice(ind, recent.length), ...recent.slice(0, ind)]);
    }
    if (selected === "Favourites") {
      const ind = fav.findIndex((it) => it.id === song.id);
      setQ([...fav.slice(ind, fav.length), ...fav.slice(0, ind)]);
    }
  };

  const sear = useCallback(
    (input) => {
      const regex = new RegExp(input, "i");
      if (input === "") {
        setRes(songs);
      } else {
        songs.forEach((item) => {
          if (regex.test(item.title)) {
            const ind = res.findIndex((it) => it.id === item.id);
            if (ind !== -1) {
              setRes((prevRes) => [
                item,
                ...prevRes.filter((_, i) => i !== ind),
              ]);
            } else {
              setRes((prevRes) => [...prevRes, item]);
            }
          }
          if (regex.test(item.artistName)) {
            const ind = res.findIndex((it) => it.id === item.id);
            if (ind !== -1) {
              setRes((prevRes) => [
                item,
                ...prevRes.filter((_, i) => i !== ind),
              ]);
            } else {
              setRes((prevRes) => [...prevRes, item]);
            }
          }
        });
      }
    },
    [songs, res]
  );

  const Search = useCallback(
    (e, sear, delay) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        sear(e.target.value);
        setSelected("");
      }, delay);
    },
    [setSelected, timeoutRef]
  );

  const debouncedSearch = useCallback(
    (e) => Search(e, sear, 1000),
    [sear, Search]
  );

  function handleClick(e, song) {
    handleQ(song);
    const x = e.clientX - e.target.offsetLeft;
    const y = e.clientY - e.target.offsetTop;
    const el = document.createElement("div");
    const title = song.title.replaceAll(" ", "");
    const id = song.id;
    const parent = document.querySelector(`#${title}${id}`);
    parent.appendChild(el);
    const list = document.querySelector(".list");
    const children = list.children;
    for (let i = 0; i < children.length; i++) {
      children[i].style.background = "";
    }
    parent.style.backgroundColor = "#bebebe44";
    el.classList.add("circle");
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    setTimeout(() => {
      el.remove();
    }, 1000);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    }
    let audio = new Audio(song.musicUrl);
    audio.play();
    setPlaying(true);
    audioRef.current = audio;
    audioRef.current.volume = parseFloat(vol / 100);
    dispatch(updaterec(song));
    setPS(song);
    if(isMobile){
      setOpen2(true)
    }
  }

  useEffect(()=>{
    if (open2) {
      document.querySelector(".playsm").style.transform = "translateY(0%)"
    }else{
      document.querySelector(".playsm").style.transform = "translateY(100%)"
    }
  },[open2])
  return (
    <div className="songs" style={{ overflow: "hidden", position: "relative" }}>
      <div className="leftsm">
        <Nav isMobile={isMobile}
          open={open}
          r={r}
          g={g}
          b={b}
          selected={selected}
          setSelected={setSelected}
        />
      </div>

      <div className="playsm">
        <Playing setOpen2={setOpen2} open2={open2}
          ps={ps} isMobile={isMobile}
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

      <div style={{ position: "relative"}}>
        <h1>{selected}</h1>
        <img
          style={{ position: "absolute", top: "0rem", zIndex: "10" }}
          onClick={() => {
            setOpen((open) => !open);
          }}
          className="ham"
          src={!open ? "hamburger.svg" : "close.svg"}
          alt=""
        />
      </div>

      <div className="searchbox">
        <input
          type="search"
          value={sinp}
          onChange={(e) => {
            setSinp(e.target.value);
            debouncedSearch(e, sear);
          }}
          placeholder="Search Songs, Artists"
          name=""
          id="search"
        />
        <div onClick={()=>{sear(sinp)}} id="sicon" style={{ position: "absolute" }}>
          <img src="search.svg" width={23} alt="" />
        </div>
      </div>

      <div className="list">
        {selected === "" &&
          res.length === 0 &&
          "Sorry, Couldn't find that Song."}
        {selected === "" &&
          res.length !== 0 &&
          res.map((song) => (
            <div
              key={song.id}
              onClick={(e) => handleClick(e, song)}
              id={song.title.replaceAll(" ", "") + song.id}
              className="song"
            >
              <div
                className="pic"
                style={{
                  background: `url(${song.thumbnail})`,
                  backgroundSize: "cover",
                }}
              />
              <div className="details">
                <p style={{ fontSize: "1.2rem" }}>{song.title}</p>
                <p className="album2">{song.artistName}</p>
              </div>
              <div className="duration">{song.duration}</div>
            </div>
          ))}

        {selected === "For You" && songs.length === 0 && "No Songs For You"}
        {selected === "For You" &&
          songs.length !== 0 &&
          songs.map((song) => (
            <div
              key={song.id}
              onClick={(e) => {
                handleClick(e, song);
              }}
              id={song.title.replaceAll(" ", "") + song.id}
              className="song"
            >
              <div
                className="pic"
                style={{
                  background: `url(${song.thumbnail})`,
                  backgroundSize: "cover",
                }}
              />
              <div className="details">
                <p style={{ fontSize: "1.2rem" }}>{song.title}</p>
                <p className="album2">{song.artistName}</p>
              </div>
              <div className="duration">{song.duration}</div>
            </div>
          ))}

        {selected === "Top Tracks" && "No Top Tracks to Display"}

        {selected === "Recently Played" &&
          recent.length === 0 &&
          "No Recently Played Songs Found"}
        {selected === "Recently Played" &&
          recent.length !== 0 &&
          recent.map((song) => (
            <div
              key={song.id}
              onClick={(e) => handleClick(e, song)}
              id={song.title.replaceAll(" ", "") + song.id}
              className="song"
            >
              <div
                className="pic"
                style={{
                  background: `url(${song.thumbnail})`,
                  backgroundSize: "cover",
                }}
              />
              <div className="details">
                <p style={{ fontSize: "1.2rem" }}>{song.title}</p>
                <p className="album2">{song.artistName}</p>
              </div>
              <div className="duration">{song.duration}</div>
            </div>
          ))}

        {selected === "Favourites" &&
          fav.length === 0 &&
          "No Favourite Songs Found"}
        {selected === "Favourites" &&
          fav.length !== 0 &&
          fav.map((song) => (
            <div
              key={song.id}
              onClick={(e) => handleClick(e, song)}
              id={song.title.replaceAll(" ", "") + song.id}
              className="song"
            >
              <div
                className="pic"
                style={{
                  background: `url(${song.thumbnail})`,
                  backgroundSize: "cover",
                }}
              />
              <div className="details">
                <p style={{ fontSize: "1.2rem" }}>{song.title}</p>
                <p className="album2">{song.artistName}</p>
              </div>
              <div className="duration">{song.duration}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Songs;
