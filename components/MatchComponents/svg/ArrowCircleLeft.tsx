import * as React from "react"

interface SVGProps {
  width?: number
  height?: number
  className?: string
}

const ArrowCircleLeft = (props: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={31}
    fill="none"
    {...props}
  >
    <path
      stroke="#2919A6"
      strokeLinecap="round"
      strokeWidth={2}
      d="M1 1C11.5 10.667 11.5 21 1 30"
    />
  </svg>
)
export default ArrowCircleLeft