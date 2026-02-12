import type { Transition } from "framer-motion";

export const TOUCH_HOLD_DELAY_MS = 140;
export const TOUCH_MOVE_CANCEL_PX = 10;
export const TOUCH_SCROLL_CANCEL_PX = 26;
export const TOUCH_DRAG_ACTIVATE_PX = 10;

export const AUTO_SCROLL_VIEWPORT_EDGE_PX = 72;
export const AUTO_SCROLL_VIEWPORT_STEP_PX = 20;

export const AUTO_SCROLL_LIST_EDGE_PX = 48;
export const AUTO_SCROLL_LIST_STEP_PX = 12;

export const LAYOUT_TRANSITION: Transition = {
  type: "spring",
  stiffness: 460,
  damping: 36,
  mass: 0.65,
};

export const DRAG_TRANSITION: Transition = {
  type: "spring",
  stiffness: 560,
  damping: 42,
  mass: 0.6,
};
