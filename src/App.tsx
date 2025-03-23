import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import moon from "./assets/moon.svg";
import PomodoroOption from "./PomadoroOption";
import { useGlobalStore } from "./useGlobalStore";
import { Option } from "./Store";

type MenuOptionInfo = Array<{
  text: string;
  icon: string;
}>;

const pomodoroOptions: MenuOptionInfo = [
  {
    text: "close",
    icon: "❌",
  },
];

const homeOptions: MenuOptionInfo = [
  {
    text: "pomodoro",
    icon: "🍅",
  },
  {
    text: "notes",
    icon: "📝",
  },
  {
    text: "settings",
    icon: "⚙️",
  },
];

function App() {
  const { count, setCount, selectedOption, setSelectedOption } =
    useGlobalStore();

  const [isPinned, setIsPinned] = useState(false);

  const [expanded, setExpanded] = useState(false);
  
  // currently available set of options
  const [options, setOptions] = useState<MenuOptionInfo>(homeOptions);
  
  const menuItems = 3; // Number of orbiting buttons
  const radius = 80; // Distance from center
  
  const [menuOption, setMenuOption] = useState<Array<boolean>>(
    Array<boolean>(menuItems).fill(false)
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.electronAPI) {
      window.electronAPI.togglePin(isPinned);
    }
  }, [isPinned]);

  const [showMovingWindow, setShowMovingWindow] = useState(false);

  const handleDragMouseDown = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.electronAPI) {
      window.electronAPI.startDrag({ x: e.screenX, y: e.screenY });

      setShowMovingWindow(true);

      const handleDragMouseMove = (moveEvent: MouseEvent) => {
        window.electronAPI.updateDrag({
          x: moveEvent.screenX,
          y: moveEvent.screenY,
        });
      };

      const handleDragMouseUp = () => {
        window.electronAPI.stopDrag();
        window.removeEventListener("mousemove", handleDragMouseMove);
        window.removeEventListener("mouseup", handleDragMouseUp);

        setShowMovingWindow(false);
      };

      window.addEventListener("mousemove", handleDragMouseMove);
      window.addEventListener("mouseup", handleDragMouseUp);
    }
  };

  return (
    <div
      id="window"
      className={`flex items-center justify-center relative overflow-visible h-fit w-fit transition-opacity duration-300 ease-in-out ${
        showMovingWindow
          ? "border border-gray-300 rounded-xl border-opacity-100"
          : "border-opacity-0"
      }`}
    >
      <div className="relative flex items-center justify-center h-[250px] w-[250px]">
        {/* Orbiting menu items */}
        <AnimatePresence>
          {expanded && (
            <>
              {/* Pin Button */}
              <motion.button
                id="pinBadge"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0, width: "40px" }}
                animate={{
                  x: Math.cos(140 * (Math.PI / 180)) * radius,
                  y: Math.sin(140 * (Math.PI / 180)) * radius,
                  opacity: 1,
                  scale: 1,
                  width: "40px",
                  height: "40px",
                }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 600,
                  damping: 30,
                  delay: 0.1,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute flex items-center justify-center cursor-pointer"
                onClick={() => setIsPinned(!isPinned)}
              >
                <div className="w-full h-full aspect-square rounded-full bg-gradient-to-tr from-red-800 via-red-600 to-red-200 flex items-center justify-center text-sm text-white btn-orange">
                  📌
                </div>
              </motion.button>

              {/* Drag Button */}
              <motion.button
                id="dragBadge"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0, width: "40px" }}
                animate={{
                  x: Math.cos(175 * (Math.PI / 180)) * radius,
                  y: Math.sin(175 * (Math.PI / 180)) * radius,
                  opacity: 1,
                  scale: 1,
                  width: "40px",
                  height: "40px",
                }}
                exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 600,
                  damping: 30,
                  delay: 0.2,
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute flex items-center justify-center cursor-grab"
                onMouseDown={handleDragMouseDown}
              >
                <div className="w-full h-full aspect-square rounded-full bg-gradient-to-tr from-blue-800 via-indigo-600 to-purple-200 flex items-center justify-center text-sm text-white btn-purple">
                  🖐️
                </div>
              </motion.button>
            </>
          )}
          {expanded &&
            options.map((option, i) => {
              const angle = (-45 + i * 50) * (Math.PI / 180);
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.button
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0, width: "50px" }}
                  animate={{
                    x: x + (menuOption[i] === true ? 30 : 0),
                    y,
                    opacity: 1,
                    scale: 1,
                    width: menuOption[i] === true ? "100px" : "50px",
                    height: "50px",
                  }}
                  exit={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: menuOption[i] === true ? 400 : 600,
                    damping: 30,
                    delay: i * 0.1,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute flex items-center justify-center cursor-pointer"
                  // onClick={() => {
                  //   setMenuOption((prev) => {
                  //     const next = [...Array(menuItems).fill(false)];
                  //     next[i] = !prev[i]; // Toggle the clicked item
                  //     return next.map((val, index) =>
                  //       index === i ? val : false
                  //     ); // Hide others
                  //   });
                  // }}
                  onClick={() => {
                    setSelectedOption(options[i].text as Option);
                  }}
                >
                  <div
                    className="w-full h-full aspect-square rounded-full bg-gradient-to-tr from-green-800 via-lime-600 to-yellow-200 flex items-center justify-center text-white btn-blue"
                    title={options[i].text}
                  >
                    <motion.span
                      initial={{ opacity: 1 }}
                      animate={{ opacity: menuOption[i] ? 0 : 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: "absolute",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        zIndex: 10,
                      }}
                      className="text-2xl font-bold"
                    >
                      {options[i].icon}
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: menuOption[i] ? 1 : 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      style={{
                        position: "absolute",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        zIndex: 20,
                      }}
                      className="text-xs font-bold"
                    >
                      {options[i].text}
                    </motion.span>
                  </div>
                </motion.button>
              );
            })}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            if (expanded) {
              setMenuOption(Array<boolean>(menuItems).fill(false));
            }
            setExpanded((prev) => !prev);

            setCount((prev) => prev + 1);
          }}
          className="relative w-24 h-24 rounded-full shadow-lg flex items-center justify-center cursor-pointer btn-green"
        >
          {/* <p className="absolute font-semibold text-white">{count}</p> */}
          {selectedOption === "home" ? (
            <img
              src={moon}
              alt=""
              className="delay-100 transition-transform duration-300 ease-in-out hover:scale-110"
            />
          ) : (
            <PomodoroOption />
          )}
        </motion.button>
      </div>
    </div>
  );
}

export default App;

{
  /* <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={
          idx === 0
            ? { width: "130px", height: "130px" }
            : { width: "100px", height: "100px" }
        }
        transition={{
          type: "spring",
          stiffness: idx === 0 ? 400 : 600,
          damping: 30,
        }}
        style={{
          position: "relative",
          width: "100px",
          height: "100px",
        }}
        className={`aspect-square inset-0 rounded-full ${
          idx == 0 && "p-1 text-base"
        } cursor-pointer hover:border-none
        hover:z-30 z-10 flex items-center justify-center relative`}
        onMouseOver={() => setIdx(0)}
        onMouseLeave={() => setIdx(-1)}
        onClick={() => setCount(count + 1)}
      >
        <p className="absolute z-40 h-full w-full flex font-semibold items-center justify-center">
          {count}
        </p>
        <span
          className="absolute rounded-full w-full h-full blur-xs
          bg-gradient-to-tr from-green-800 via-lime-600 to-yellow-200
          hover:shadow-2xl"
        />
      </motion.button> */
}
