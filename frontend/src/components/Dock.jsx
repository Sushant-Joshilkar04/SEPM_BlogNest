"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Edit, 
  Users, 
  User, 
  LogOut, 
  Flag, 
  Settings,
  Menu,
  BookOpen,
  Users2,
  PlusCircle,
  LayoutDashboard
} from 'lucide-react';

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full bg-[#060606] border-neutral-700 border-2 shadow-md ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) =>
        cloneElement(child, { isHovered })
      )}
    </motion.div>
  );
}

function DockLabel({ children, className = "", ...rest }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-neutral-700 bg-[#060606] px-2 py-0.5 text-xs text-white`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = "" }) {
  return (
    <div className={`flex items-center justify-center text-white ${className}`}>
      {cloneElement(children, { 
        className: "text-white stroke-2",
        color: "white",
        strokeWidth: 2
      })}
    </div>
  );
}

export function UserDock() {
  const navigate = useNavigate();
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const items = [
    { icon: <Home size={18} className="text-white" />, label: 'Dashboard', onClick: () => navigate('/dashboard') },
    { icon: <Edit size={18} className="text-white" />, label: 'Create Blog', onClick: () => navigate('/create-blog') },
    { icon: <Users2 size={18} className="text-white" />, label: 'Communities', onClick: () => navigate('/community') },
    { icon: <BookOpen size={18} className="text-white" />, label: 'My Blogs', onClick: () => navigate('/profile') },
    { icon: <LogOut size={18} className="text-white" />, label: 'Logout', onClick: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/auth');
    }},
  ];

  const spring = { mass: 0.1, stiffness: 150, damping: 12 };
  const magnification = 70;
  const distance = 200;
  const panelHeight = 64;
  const dockHeight = 256;
  const baseItemSize = 50;

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="fixed bottom-0 left-0 right-0 z-50 mx-2 flex max-w-full items-center"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl border-neutral-700 border-2 pb-2 px-4 bg-[#060606]"
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}

export function AdminDock() {
  const navigate = useNavigate();
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const items = [
    { icon: <LayoutDashboard size={18} className="text-white" />, label: 'Dashboard', onClick: () => navigate('/admin') },
    { icon: <Flag size={18} className="text-white" />, label: 'Reported Posts', onClick: () => navigate('/admin/reported-posts') },
    { icon: <Users size={18} className="text-white" />, label: 'Manage Users', onClick: () => navigate('/admin/manage-users') },
    { icon: <LogOut size={18} className="text-white" />, label: 'Logout', onClick: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/auth');
    }},
  ];

  const spring = { mass: 0.1, stiffness: 150, damping: 12 };
  const magnification = 70;
  const distance = 200;
  const panelHeight = 64;
  const dockHeight = 256;
  const baseItemSize = 50;

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="fixed bottom-0 left-0 right-0 z-50 mx-2 flex max-w-full items-center"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl border-neutral-700 border-2 pb-2 px-4 bg-[#060606]"
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}