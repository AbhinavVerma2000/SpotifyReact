import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BackgroundColorDiv from "./BackgroundColorDiv";
import { updatefav } from "../features/favouriteSlice";
import { updaterec, updatevol } from "../features/recentSlice";

const Playing = ({
  songs,
  isMobile,
  selected,
  bgColor,
  setBgColor,
  setPlaying,
  playing,
  audioRef,
  q,
  ps,
  setPS,
  setOpen2,
  open2,
}) => {
  const dispatch = useDispatch();
  const recent = useSelector((state) => state.recentSlice.value);
  const fav = useSelector((state) => state.favouriteSlice.value);
  const vol = useSelector((state) => state.recentSlice.volume);

  const [liked, setLiked] = useState(false);
  const [volume, setVolume] = useState(vol);
  const [time, setTime] = useState(0);

  const ref = useRef();
  const mref = useRef();
  const likedref = useRef();

  const DragSeek = (e) => {
    const offsetmin = e.target.offsetLeft;
    const offsetmax = e.target.offsetLeft + e.target.offsetWidth;
    const x = e.clientX;
    if (x >= e.target.offsetLeft && x <= offsetmax && audioRef.current) {
      const dragRange = offsetmax - offsetmin;
      const duration = audioRef.current.duration;
      const relativeX = x - offsetmin;

      const newTime = parseFloat((relativeX / dragRange) * duration);

      audioRef.current.currentTime = newTime;

      const percent = parseFloat((newTime / duration) * 100);

      const seekbar = document.querySelectorAll(".seekbar");
      if (open2 && isMobile) {
        const skb1 = seekbar[0];
        skb1.style.left = `${percent}%`;
      } else {
        const skb2 = seekbar[1];
        skb2.style.left = `${percent}%`;
      }
      const currtime = document.querySelectorAll(".currtime");
      if (open2 && isMobile) {
        currtime[0].style.width = `${percent}%`;
      } else {
        currtime[1].style.width = `${percent}%`;
      }
    }
  }; // Ensure this closing brace properly ends the `getPrev` function

  const getNext = React.useCallback(
    async (song) => {
      let currentIndex = q.findIndex((item) => item.id === song.id);
      if (currentIndex < q.length - 1) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.src = "";
          audioRef.current.load(); // just to be extra safe
          setPlaying(false);
        }
        const audio = new Audio(q[currentIndex + 1].musicUrl);
        audioRef.current = audio;
        audioRef.current.volume = parseFloat(volume / 100);
        setPS(q[currentIndex + 1]);
        await audio.play();
        setPlaying(true);
        dispatch(updaterec(q[currentIndex + 1]));
        const mysong = q[currentIndex + 1];
        const title = mysong.title.replaceAll(" ", "").replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
        const parent = document.querySelector(`#${title}`);
        const list = document.querySelector(".list");
        const children = list.children;
        for (let i = 0; i < children.length; i++) {
          children[i].style.background = "";
        }
        parent.style.backgroundColor = "#bebebe44";
      }
    },
    [audioRef, setPlaying, dispatch, volume, q, setPS]
  );

  const getPrev = async (song) => {
    let currentIndex = q.findIndex((item) => item.id === song.id);
    if (currentIndex > 0) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = "";
        audioRef.current.load(); // just to be extra safe
        setPlaying(false);
      }
      const audio = new Audio(q[currentIndex - 1].musicUrl);
      audioRef.current = audio;
      audioRef.current.volume = parseFloat(volume / 100);
      setPS(q[currentIndex - 1]);
      await audio.play();
      setPlaying(true);
      dispatch(updaterec(q[currentIndex - 1]));
      const mysong = q[currentIndex - 1];
      const title = mysong.title.replaceAll(" ", "").replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
      const parent = document.querySelector(`#${title}`);
      const list = document.querySelector(".list");
      const children = list.children;
      for (let i = 0; i < children.length; i++) {
        children[i].style.background = "";
      }
      parent.style.backgroundColor = "#bebebe44";
    }
  };

  const changeVolume = (e) => {
    if (audioRef.current) {
      setVolume(e.target.value);
      audioRef.current.volume = parseFloat(e.target.value / 100);
      dispatch(updatevol(e.target.value));
    } else {
      setVolume(e.target.value);
    }
  };
  const checkLike = React.useCallback(() => {
    if (fav.findIndex((item) => item.id === ps.id) !== -1) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [fav, ps]);

  const playSong = async (songUrl) => {
    const audio = new Audio(songUrl);
    if (audioRef.current && playing) {
      setTime(audioRef.current.currentTime);
      audioRef.current.pause();
      audioRef.current.removeEventListener("timeupdate", (e) => {
        const seekbar = document.querySelectorAll(".seekbar");
        if (open2 && isMobile) {
          const skb1 = seekbar[0];
          skb1.style.left = `${
            parseFloat(
              audioRef.current.currentTime / audioRef.current.duration
            ) * 100
          }%`;
        } else {
          const skb2 = seekbar[1];
          skb2.style.left = `${
            parseFloat(
              audioRef.current.currentTime / audioRef.current.duration
            ) * 100
          }%`;
        }
        const currtime = document.querySelectorAll(".currtime");
        if (open2 && isMobile) {
          currtime[0].style.width = `${
            parseFloat(
              audioRef.current.currentTime / audioRef.current.duration
            ) * 100
          }%`;
        } else {
          currtime[1].style.width = `${
            parseFloat(
              audioRef.current.currentTime / audioRef.current.duration
            ) * 100
          }%`;
        }
      });
      audioRef.current.src = "";
      audioRef.current.load();
      setPlaying(false);
    }
    if (!playing) {
      audioRef.current = audio;
      audioRef.current.volume = parseFloat(volume / 100);
      audioRef.current.currentTime = time;
      audioRef.current.addEventListener("timeupdate", (e) => {
        const seekbar = document.querySelectorAll(".seekbar");
        if (open2 && isMobile) {
          const skb1 = seekbar[0];
          skb1.style.left = `${
            parseFloat(
              audioRef.current.currentTime / audioRef.current.duration
            ) * 100
          }%`;
        } else {
          const skb2 = seekbar[1];
          skb2.style.left = `${
            parseFloat(
              audioRef.current.currentTime / audioRef.current.duration
            ) * 100
          }%`;
        }
        const currtime = document.querySelectorAll(".currtime");
        if (open2 && isMobile) {
          currtime[0].style.width = `${
            parseFloat(
              audioRef.current.currentTime / audioRef.current.duration
            ) * 100
          }%`;
        } else {
          currtime[1].style.width = `${
            parseFloat(
              audioRef.current.currentTime / audioRef.current.duration
            ) * 100
          }%`;
        }
      });
      await audio.play();
      setPlaying(true);
    }
  };

  const Sound = (e) => {
    if (ref.current.style.visibility === "hidden") {
      ref.current.style.visibility = "visible";
      ref.current.style.bottom = "3rem";
      ref.current.style.opacity = "1";
    } else {
      ref.current.style.opacity = "0";
      ref.current.style.bottom = "0rem";
      ref.current.style.visibility = "hidden";
    }
  };

  const moreOptions = (e) => {
    if (mref.current.style.visibility === "hidden") {
      mref.current.style.visibility = "visible";
      mref.current.style.bottom = "3rem";
      mref.current.style.opacity = "1";
    } else {
      mref.current.style.opacity = "0";
      mref.current.style.bottom = "0rem";
      mref.current.style.visibility = "hidden";
    }
  };

  useEffect(() => {
    checkLike();
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", (e) => {
        const seekbar = document.querySelectorAll(".seekbar");
        if (open2 && isMobile) {
          const skb1 = seekbar[0];
          skb1.style.left = `${
            parseFloat(
              audioRef.current.currentTime / audioRef.current.duration
            ) * 100
          }%`;
        } else {
          const skb2 = seekbar[1];
          skb2.style.left = `${
            parseFloat(
              audioRef.current.currentTime / audioRef.current.duration
            ) * 100
          }%`;
        }
        const currtime = document.querySelectorAll(".currtime");
        if (open2 && isMobile) {
          currtime[0].style.width = `${
            parseFloat(
              audioRef.current.currentTime / audioRef.current.duration
            ) * 100
          }%`;
        } else {
          currtime[1].style.width = `${
            parseFloat(
              audioRef.current.currentTime / audioRef.current.duration
            ) * 100
          }%`;
        }
        if (audioRef.current.currentTime === audioRef.current.duration) {
          setPlaying(false);
          getNext(ps);
        }
      });
    }
  }, [
    audioRef,
    checkLike,
    getNext,
    ps,
    recent,
    selected,
    setPlaying,
    songs,
    setPS,
    open2,
    isMobile,
  ]); // Add a semicolon to properly terminate the useEffect

  return (
    <div className="playing mauto">
      {open2 && (
        <img
          src="close.svg"
          onClick={() => {
            setOpen2(false);
          }}
          style={{ position: "absolute", right: "1rem", top: "2rem" }}
          alt=""
        />
      )}
      <div style={{ width: "100%", height: "100%" }}>
        <h1>{ps.title}</h1>
        <p className="album">{ps.artistName}</p>
        <BackgroundColorDiv
          bgColor={bgColor}
          setBgColor={setBgColor}
          imageUrl={ps.thumbnail}
        />
        <div
          onClick={(e) => {
            DragSeek(e);
          }}
          className="totaltime"
        >
          <div
            className="currtime"
            style={{
              width: "0%",
              backgroundColor: "white",
              height: "100%",
              borderRadius: "4px",
            }}
          ></div>
          <div className="seekbar"></div>
        </div>
        <div
          id="panel"
          style={{ justifyContent: "space-between" }}
          className="flex align-center"
        >
          <div className="option">
            <div ref={mref} style={{ visibility: "hidden" }} className="more">
              <img
                ref={likedref}
                onClick={(e) => {
                  dispatch(updatefav(ps));
                }}
                src={liked ? "liked.svg" : "disliked.svg"}
                className="invert"
                style={{ cursor: "pointer" }}
                alt=""
              />
            </div>
            <img
              className="invert"
              onClick={() => {
                moreOptions();
              }}
              src="option.svg"
              alt=""
            />
          </div>
          <div
            style={{ justifyContent: "space-between", width: "10rem" }}
            className="flex align-center"
          >
            <img
              className=" prev"
              onClick={() => {
                getPrev(ps);
              }}
              src="next.svg"
              alt=""
            />
            <img
              onClick={() => {
                playSong(ps.musicUrl);
              }}
              className="invert play"
              src={!playing ? "play.svg" : "pause.svg"}
              alt=""
            />
            <img
              onClick={() => {
                getNext(ps);
              }}
              className=" next"
              src="next.svg"
              alt=""
            />
          </div>
          <div
            ref={ref}
            className="volslider"
            style={{ visibility: "hidden", bottom: "1rem" }}
          >
            <p>{volume}</p>
            <input
              value={volume}
              onChange={(e) => {
                changeVolume(e);
              }}
              style={{ width: "150px", rotate: "-90deg" }}
              type="range"
              name="volume"
              id="volume"
            />
            <img
              className="invert"
              style={{ height: "25px" }}
              src="volume.svg"
              alt=""
            />
          </div>
          <div className="vol">
            <div
              ref={ref}
              className="volslider"
              style={{ visibility: "hidden", bottom: "1rem" }}
            >
              <p>{volume}</p>
              <input
                value={volume}
                onChange={(e) => {
                  changeVolume(e);
                }}
                style={{ width: "150px", rotate: "-90deg" }}
                type="range"
                name="volume"
                id="volume"
              />
              <img
                className="invert"
                onClick={() => {}}
                style={{ height: "25px" }}
                src="volume.svg"
                alt=""
              />
            </div>
            <img
              onClick={() => {
                Sound();
              }}
              className="invert"
              src="volume.svg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playing;
