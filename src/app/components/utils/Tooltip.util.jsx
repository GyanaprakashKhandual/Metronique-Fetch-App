"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTooltip } from "@/app/scripts/Tooltip.context";

const Tooltip = () => {
    const { tooltip, hideTooltip } = useTooltip();
    const tooltipRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [actualPlacement, setActualPlacement] = useState("bottom");
    const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });

    // Hide tooltip on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (tooltip.visible) {
                hideTooltip();
            }
        };
        window.addEventListener("scroll", handleScroll, true);
        return () => window.removeEventListener("scroll", handleScroll, true);
    }, [tooltip.visible, hideTooltip]);

    // Hide tooltip on window resize
    useEffect(() => {
        const handleResize = () => {
            if (tooltip.visible) {
                hideTooltip();
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [tooltip.visible, hideTooltip]);

    useEffect(() => {
        if (!tooltip.visible || !tooltip.targetRect || !tooltipRef.current) {
            return;
        }

        const calculatePosition = () => {
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const { targetRect, placement } = tooltip;
            const gap = 8;
            const arrowSize = 6;
            const viewportPadding = 8;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Helper function to check if tooltip fits in viewport
            const fitsInViewport = (top, left) => {
                return (
                    top >= viewportPadding &&
                    left >= viewportPadding &&
                    top + tooltipRect.height <= viewportHeight - viewportPadding &&
                    left + tooltipRect.width <= viewportWidth - viewportPadding
                );
            };

            // Calculate positions for all placements
            const positions = {
                top: {
                    top: targetRect.top - tooltipRect.height - gap,
                    left: targetRect.left + targetRect.width / 2 - tooltipRect.width / 2,
                },
                bottom: {
                    top: targetRect.bottom + gap,
                    left: targetRect.left + targetRect.width / 2 - tooltipRect.width / 2,
                },
                left: {
                    top: targetRect.top + targetRect.height / 2 - tooltipRect.height / 2,
                    left: targetRect.left - tooltipRect.width - gap,
                },
                right: {
                    top: targetRect.top + targetRect.height / 2 - tooltipRect.height / 2,
                    left: targetRect.right + gap,
                },
                "top-start": {
                    top: targetRect.top - tooltipRect.height - gap,
                    left: targetRect.left,
                },
                "top-end": {
                    top: targetRect.top - tooltipRect.height - gap,
                    left: targetRect.right - tooltipRect.width,
                },
                "bottom-start": {
                    top: targetRect.bottom + gap,
                    left: targetRect.left,
                },
                "bottom-end": {
                    top: targetRect.bottom + gap,
                    left: targetRect.right - tooltipRect.width,
                },
            };

            // Priority order for fallback placements
            const fallbackOrder = {
                top: ["top", "bottom", "right", "left"],
                bottom: ["bottom", "top", "right", "left"],
                left: ["left", "right", "top", "bottom"],
                right: ["right", "left", "top", "bottom"],
            };

            // Try preferred placement first, then fallbacks
            let finalPlacement = placement;
            let finalPosition = positions[placement];

            const placementsToTry = fallbackOrder[placement] || [
                "bottom",
                "top",
                "right",
                "left",
            ];

            for (const testPlacement of placementsToTry) {
                const testPosition = positions[testPlacement];
                if (fitsInViewport(testPosition.top, testPosition.left)) {
                    finalPlacement = testPlacement;
                    finalPosition = testPosition;
                    break;
                }
            }

            let { top, left } = finalPosition;

            // Fine-tune horizontal position to keep tooltip within viewport
            if (
                finalPlacement === "top" ||
                finalPlacement === "bottom" ||
                finalPlacement === "top-start" ||
                finalPlacement === "top-end" ||
                finalPlacement === "bottom-start" ||
                finalPlacement === "bottom-end"
            ) {
                // Ensure tooltip doesn't overflow horizontally
                if (left < viewportPadding) {
                    left = viewportPadding;
                } else if (left + tooltipRect.width > viewportWidth - viewportPadding) {
                    left = viewportWidth - tooltipRect.width - viewportPadding;
                }
            }

            // Fine-tune vertical position to keep tooltip within viewport
            if (finalPlacement === "left" || finalPlacement === "right") {
                // Ensure tooltip doesn't overflow vertically
                if (top < viewportPadding) {
                    top = viewportPadding;
                } else if (top + tooltipRect.height > viewportHeight - viewportPadding) {
                    top = viewportHeight - tooltipRect.height - viewportPadding;
                }
            }

            // Additional boundary checks
            if (top < viewportPadding) {
                top = viewportPadding;
            }
            if (top + tooltipRect.height > viewportHeight - viewportPadding) {
                top = viewportHeight - tooltipRect.height - viewportPadding;
            }
            if (left < viewportPadding) {
                left = viewportPadding;
            }
            if (left + tooltipRect.width > viewportWidth - viewportPadding) {
                left = viewportWidth - tooltipRect.width - viewportPadding;
            }

            // Calculate arrow position based on target element
            let arrowTop = 0;
            let arrowLeft = 0;

            if (
                finalPlacement === "top" ||
                finalPlacement === "bottom" ||
                finalPlacement === "top-start" ||
                finalPlacement === "top-end" ||
                finalPlacement === "bottom-start" ||
                finalPlacement === "bottom-end"
            ) {
                // Arrow should point to center of target element
                const targetCenterX = targetRect.left + targetRect.width / 2;
                arrowLeft = targetCenterX - left - arrowSize;

                // Keep arrow within tooltip bounds
                const minArrowLeft = 8;
                const maxArrowLeft = tooltipRect.width - 8;
                arrowLeft = Math.max(minArrowLeft, Math.min(maxArrowLeft, arrowLeft));

                if (finalPlacement.startsWith("top")) {
                    arrowTop = tooltipRect.height;
                } else {
                    arrowTop = -arrowSize;
                }
            } else if (finalPlacement === "left" || finalPlacement === "right") {
                // Arrow should point to center of target element
                const targetCenterY = targetRect.top + targetRect.height / 2;
                arrowTop = targetCenterY - top - arrowSize;

                // Keep arrow within tooltip bounds
                const minArrowTop = 8;
                const maxArrowTop = tooltipRect.height - 8;
                arrowTop = Math.max(minArrowTop, Math.min(maxArrowTop, arrowTop));

                if (finalPlacement === "left") {
                    arrowLeft = tooltipRect.width;
                } else {
                    arrowLeft = -arrowSize;
                }
            }

            setPosition({ top, left });
            setActualPlacement(finalPlacement);
            setArrowPosition({ top: arrowTop, left: arrowLeft });
        };

        // Calculate position after render with double RAF for accurate measurements
        requestAnimationFrame(() => {
            requestAnimationFrame(calculatePosition);
        });
    }, [tooltip.visible, tooltip.targetRect, tooltip.placement]);

    // Get arrow rotation based on placement
    const getArrowRotation = (placement) => {
        if (placement.startsWith("top")) return "rotate-180";
        if (placement.startsWith("bottom")) return "rotate-0";
        if (placement === "left") return "rotate-90";
        if (placement === "right") return "-rotate-90";
        return "rotate-0";
    };

    return (
        <AnimatePresence>
            {tooltip.visible && tooltip.content && (
                <motion.div
                    ref={tooltipRef}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                    className={`fixed z-[99999] pointer-events-none ${tooltip.customClass || ""
                        }`}
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                    }}
                >
                    <div className="relative">
                        {/* Tooltip Content */}
                        <div className="bg-[#3c4043] text-white text-[13px] leading-[18px] px-2.5 py-1.5 rounded shadow-[0_2px_8px_rgba(0,0,0,0.26)] whitespace-nowrap font-normal max-w-[300px] break-words">
                            {tooltip.content}
                        </div>

                        {/* Arrow */}
                        <div
                            className={`absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[#3c4043] ${getArrowRotation(
                                actualPlacement
                            )}`}
                            style={{
                                top: `${arrowPosition.top}px`,
                                left: `${arrowPosition.left}px`,
                                transform: `translate(-50%, -50%) ${actualPlacement === "right" ? "rotate(-90deg)" : ""
                                    } ${actualPlacement === "left" ? "rotate(90deg)" : ""} ${actualPlacement.startsWith("top") ? "rotate(180deg)" : ""
                                    }`,
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Tooltip;