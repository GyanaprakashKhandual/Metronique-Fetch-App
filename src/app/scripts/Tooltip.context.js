"use client";
import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";

const TooltipContext = createContext();

export const useTooltip = () => {
    const context = useContext(TooltipContext);
    if (!context) {
        throw new Error("useTooltip must be used within TooltipProvider");
    }
    return context;
};

export const TooltipProvider = ({ children }) => {
    const [tooltip, setTooltip] = useState({
        visible: false,
        content: "",
        position: null,
        targetRect: null,
        placement: "bottom",
        customClass: "",
    });
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const currentTargetRef = useRef(null);
    const isInteractingRef = useRef(false);

    const showTooltip = useCallback(
        (content, targetRect, placement = "bottom", customClass = "") => {
            // Don't show tooltip if user is interacting (clicking/dragging)
            if (isInteractingRef.current) return;

            setTooltip({
                visible: true,
                content,
                position: { x: 0, y: 0 },
                targetRect,
                placement,
                customClass,
            });
        },
        []
    );

    const hideTooltip = useCallback(() => {
        setTooltip((prev) => ({ ...prev, visible: false }));
        currentTargetRef.current = null;
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
    }, [hoverTimeout]);

    // Track mouse interaction state
    useEffect(() => {
        const handleMouseDown = () => {
            isInteractingRef.current = true;
            hideTooltip();
        };

        const handleMouseUp = () => {
            // Small delay to prevent tooltip showing immediately after click
            setTimeout(() => {
                isInteractingRef.current = false;
            }, 100);
        };

        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [hideTooltip]);

    // Main tooltip event handlers
    useEffect(() => {
        const handleMouseOver = (e) => {
            const target = e.target.closest("[tooltip-data]");
            if (!target) return;

            // Don't show tooltip if target is disabled
            if (target.hasAttribute("disabled") || target.disabled) return;

            // Don't show tooltip if target is not visible
            const rect = target.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return;

            const content = target.getAttribute("tooltip-data");
            const placement = target.getAttribute("tooltip-placement") || "bottom";
            const customClass = target.getAttribute("tooltip-class") || "";
            const delay = parseInt(target.getAttribute("tooltip-delay") || "500", 10);

            if (!content) return;

            // If hovering over the same target, don't reset
            if (currentTargetRef.current === target && tooltip.visible) return;

            currentTargetRef.current = target;

            // Clear any existing timeout
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }

            // Delay showing tooltip (Google Meet style)
            const timeout = setTimeout(() => {
                const currentRect = target.getBoundingClientRect();
                showTooltip(content, currentRect, placement, customClass);
            }, delay);

            setHoverTimeout(timeout);
        };

        const handleMouseOut = (e) => {
            const target = e.target.closest("[tooltip-data]");
            if (!target) return;

            // Check if mouse is moving to the tooltip itself
            const relatedTarget = e.relatedTarget;
            if (relatedTarget && target.contains(relatedTarget)) return;

            hideTooltip();
        };

        // Hide tooltip when element is clicked
        const handleClick = (e) => {
            const target = e.target.closest("[tooltip-data]");
            if (!target) return;
            hideTooltip();
        };

        // Hide tooltip on any keyboard interaction
        const handleKeyDown = (e) => {
            // Hide on Escape key
            if (e.key === "Escape") {
                hideTooltip();
            }
            // Hide on Tab key (user is navigating)
            if (e.key === "Tab") {
                hideTooltip();
            }
        };

        // Handle focus events for keyboard navigation
        const handleFocus = (e) => {
            const target = e.target.closest("[tooltip-data]");
            if (!target) return;

            const content = target.getAttribute("tooltip-data");
            const placement = target.getAttribute("tooltip-placement") || "bottom";
            const customClass = target.getAttribute("tooltip-class") || "";

            if (!content) return;

            // Show tooltip immediately on focus (for keyboard users)
            const rect = target.getBoundingClientRect();
            showTooltip(content, rect, placement, customClass);
        };

        const handleBlur = (e) => {
            const target = e.target.closest("[tooltip-data]");
            if (!target) return;
            hideTooltip();
        };

        // Hide tooltip when document loses focus
        const handleVisibilityChange = () => {
            if (document.hidden) {
                hideTooltip();
            }
        };

        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);
        document.addEventListener("click", handleClick, true);
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("focusin", handleFocus);
        document.addEventListener("focusout", handleBlur);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
            document.removeEventListener("click", handleClick, true);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("focusin", handleFocus);
            document.removeEventListener("focusout", handleBlur);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
            }
        };
    }, [showTooltip, hideTooltip, hoverTimeout, tooltip.visible]);

    // Handle iframe focus (hide tooltip when user clicks into iframe)
    useEffect(() => {
        const handleWindowBlur = () => {
            hideTooltip();
        };

        window.addEventListener("blur", handleWindowBlur);
        return () => window.removeEventListener("blur", handleWindowBlur);
    }, [hideTooltip]);

    return (
        <TooltipContext.Provider value={{ tooltip, showTooltip, hideTooltip }}>
            {children}
        </TooltipContext.Provider>
    );
};
