"use client";

import { cn } from "@/app/libs/utils/utils";
import {
  memo,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const getFocusableElements = (element: HTMLElement): HTMLElement[] =>
  Array.from(element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (candidate) => candidate.getAttribute("aria-hidden") !== "true",
  );

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  dialogId?: string;
  titleId: string;
  descriptionId?: string;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  closeOnBackdropClick?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
};

function BaseModalComponent({
  isOpen,
  onClose,
  dialogId,
  titleId,
  descriptionId,
  children,
  className,
  panelClassName,
  closeOnBackdropClick = true,
  initialFocusRef,
}: BaseModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const focusFirstElement = useCallback(() => {
    const panelElement = panelRef.current;
    if (!panelElement) return;

    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
      return;
    }

    const focusableElements = getFocusableElements(panelElement);
    const firstFocusableElement = focusableElements[0];

    if (firstFocusableElement) {
      firstFocusableElement.focus();
      return;
    }

    panelElement.focus();
  }, [initialFocusRef]);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (event.key !== "Tab") return;

    const panelElement = panelRef.current;
    if (!panelElement) return;

    const focusableElements = getFocusableElements(panelElement);

    if (focusableElements.length === 0) {
      event.preventDefault();
      panelElement.focus();
      return;
    }

    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      if (activeElement === firstFocusableElement || activeElement === panelElement) {
        event.preventDefault();
        lastFocusableElement.focus();
      }
      return;
    }

    if (activeElement === lastFocusableElement) {
      event.preventDefault();
      firstFocusableElement.focus();
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const animationFrame = window.requestAnimationFrame(focusFirstElement);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      trapFocus(event);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;

      const previousActiveElement = previousActiveElementRef.current;
      if (previousActiveElement?.isConnected) {
        previousActiveElement.focus();
      }
    };
  }, [focusFirstElement, isOpen, onClose, trapFocus]);

  const handleContainerPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
    },
    [],
  );

  const handleBackdropPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
      if (!closeOnBackdropClick) return;
      onClose();
    },
    [closeOnBackdropClick, onClose],
  );

  const handlePanelPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      event.stopPropagation();
    },
    [],
  );

  if (!isOpen) return null;

  return createPortal(
    <div
      className={cn("base-modal", className)}
      onPointerDown={handleContainerPointerDown}
    >
      <div className="base-modal__backdrop" onPointerDown={handleBackdropPointerDown} />
      <section
        id={dialogId}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={cn("base-modal__panel", panelClassName)}
        onPointerDown={handlePanelPointerDown}
      >
        {children}
      </section>
    </div>,
    document.body,
  );
}

const BaseModal = memo(BaseModalComponent);

export default BaseModal;
