import { useEffect, useState } from "react";
// import viteLogo from "/electron-vite.animate.svg";
import { AnimatePresence, motion } from "framer-motion";

type MenuOptionInfo = {
  [key: number]: {
    text: string;
    icon: string;
  };
};

function App() {
  const [count, setCount] = useState(0);
  const [isPinned, setIsPinned] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const menuItems = 3; // Number of orbiting buttons
  const radius = 80; // Distance from center
  const [menuOption, setMenuOption] = useState<Array<boolean>>(
    Array<boolean>(menuItems).fill(false)
  );

  const menuOptionInfo: MenuOptionInfo = {
    0: {
      text: "activate",
      icon: "🌞",
    },
    1: {
      text: "meditate",
      icon: "🌛",
    },
    2: {
      text: "regenerate",
      icon: "🌜",
    },
  };

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
      className={`flex items-center justify-center relative overflow-hidden h-fit w-fit transition-opacity duration-300 ease-in-out ${
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
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute flex items-center justify-center cursor-pointer"
                onClick={() => setIsPinned(!isPinned)}
              >
                <div className="w-full h-full aspect-square rounded-full bg-gradient-to-tr from-red-800 via-red-600 to-red-200 flex items-center justify-center text-sm text-white">
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
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute flex items-center justify-center cursor-grab"
                onMouseDown={handleDragMouseDown}
              >
                <div className="w-full h-full aspect-square rounded-full bg-gradient-to-tr from-blue-800 via-indigo-600 to-purple-200 flex items-center justify-center text-sm text-white">
                  🖐️
                </div>
              </motion.button>
            </>
          )}
          {expanded &&
            Array.from({ length: menuItems }).map((_, i) => {
              const angle = (-45 + i * 50) * (Math.PI / 180);
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.button
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0, width: "50px" }}
                  animate={{
                    x: x + (menuOption[i] === true ? 50 : 0),
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
                    // Delay based on the index for sequential animation
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setMenuOption((prev) => {
                      const next = [...Array(menuItems).fill(false)];
                      next[i] = !prev[i]; // Toggle the clicked item
                      return next.map((val, index) =>
                        index === i ? val : false
                      ); // Hide others
                    });
                  }}
                >
                  <div className="w-full h-full aspect-square rounded-full bg-gradient-to-tr from-green-800 via-lime-600 to-yellow-200 flex items-center justify-center text-xl text-white">
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
                    >
                      {menuOptionInfo[i].icon}
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: menuOption[i] ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: "absolute",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        zIndex: 20,
                      }}
                    >
                      {menuOptionInfo[i].text}
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
          }}
          className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-green-800 via-lime-600 to-yellow-200 shadow-lg flex items-center justify-center cursor-pointer"
        >
          <p className="absolute font-semibold text-white">{count}</p>
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
