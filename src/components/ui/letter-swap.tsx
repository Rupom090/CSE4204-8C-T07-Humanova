'use client'

import { useState } from "react"
import {
  motion,
  stagger,
  useAnimate,
} from "framer-motion"
import { debounce } from "lodash"

interface TextProps {
  label: string
  reverse?: boolean
  transition?: any
  staggerDuration?: number
  staggerFrom?: "first" | "last" | "center" | number
  className?: string
  onClick?: () => void
}

// Utility to split classes into parent-level classes (layout/hover/sizing)
// and text fill classes (gradients/bg-clip/colors) to resolve Chrome bg-clip-text bugs on flex containers.
const splitClasses = (classes: string = "") => {
  const words = classes.split(/\s+/).filter(Boolean);
  const fillPatterns = [
    /^bg-gradient-/,
    /^from-/,
    /^to-/,
    /^via-/,
    /^bg-clip-text/,
    /^text-transparent/,
    /^text-clip/
  ];

  const parentWords = words.filter(w => !fillPatterns.some(p => p.test(w)));
  const letterWords = words.filter(w => fillPatterns.some(p => p.test(w)));

  return {
    parentClass: parentWords.join(" "),
    letterClass: letterWords.join(" ") || "text-current"
  };
};

export function LetterSwapForward({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.7,
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
  ...props
}: TextProps) {
  const [scope, animate] = useAnimate()
  const [blocked, setBlocked] = useState(false)
  const { parentClass, letterClass } = splitClasses(className)

  const hoverStart = () => {
    if (blocked) return

    setBlocked(true)

    // Function to merge user transition with stagger and delay
    const mergeTransition = (baseTransition: any) => ({
      ...baseTransition,
      delay: stagger(staggerDuration, {
        from: staggerFrom as any,
      }),
    })

    animate(
      ".letter",
      { y: reverse ? "100%" : "-100%" },
      mergeTransition(transition)
    ).then(() => {
      animate(
        ".letter",
        {
          y: 0,
        },
        {
          duration: 0,
        }
      ).then(() => {
        setBlocked(false)
      })
    })

    animate(
      ".letter-secondary",
      {
        top: "0%",
      },
      mergeTransition(transition)
    ).then(() => {
      animate(
        ".letter-secondary",
        {
          top: reverse ? "-100%" : "100%",
        },
        {
          duration: 0,
        }
      )
    })
  }

  return (
    <span
      className={`flex justify-center items-center relative overflow-hidden ${parentClass}`}
      onMouseEnter={hoverStart}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <span className="whitespace-pre relative flex" key={i}>
            <motion.span className={`relative letter ${letterClass}`} style={{ top: 0 }}>
              {letter}
            </motion.span>
            <motion.span
              className={`absolute letter-secondary ${letterClass}`}
              aria-hidden={true}
              style={{ top: reverse ? "-100%" : "100%" }}
            >
              {letter}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}

export function LetterSwapPingPong({
  label,
  reverse = true,
  transition = {
    type: "spring",
    duration: 0.7,
  },
  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
  ...props
}: TextProps) {
  const [scope, animate] = useAnimate()
  const [isHovered, setIsHovered] = useState(false)
  const { parentClass, letterClass } = splitClasses(className)

  const mergeTransition = (baseTransition: any) => ({
    ...baseTransition,
    delay: stagger(staggerDuration, {
      from: staggerFrom as any,
    }),
  })

  const hoverStart = debounce(
    () => {
      if (isHovered) return
      setIsHovered(true)

      animate(
        ".letter",
        { y: reverse ? "100%" : "-100%" },
        mergeTransition(transition)
      )

      animate(
        ".letter-secondary",
        {
          top: "0%",
        },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  )

  const hoverEnd = debounce(
    () => {
      setIsHovered(false)

      animate(
        ".letter",
        {
          y: 0,
        },
        mergeTransition(transition)
      )

      animate(
        ".letter-secondary",
        {
          top: reverse ? "-100%" : "100%",
        },
        mergeTransition(transition)
      )
    },
    100,
    { leading: true, trailing: true }
  )

  return (
    <motion.span
      className={`flex justify-center items-center relative overflow-hidden ${parentClass}`}
      onHoverStart={hoverStart}
      onHoverEnd={hoverEnd}
      onClick={onClick}
      ref={scope}
      {...props}
    >
      <span className="sr-only">{label}</span>

      {label.split("").map((letter: string, i: number) => {
        return (
          <span className="whitespace-pre relative flex" key={i}>
            <motion.span className={`relative letter ${letterClass}`} style={{ top: 0 }}>
              {letter}
            </motion.span>
            <motion.span
              className={`absolute letter-secondary ${letterClass}`}
              aria-hidden={true}
              style={{ top: reverse ? "-100%" : "100%" }}
            >
              {letter}
            </motion.span>
          </span>
        )
      })}
    </motion.span>
  )
}
