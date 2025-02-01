import * as React from "react"

interface SVGProps {
  width?: number
  height?: number
  className?: string
}

const FenifutSVG = (props: SVGProps) => (
  <svg
  xmlns="http://www.w3.org/2000/svg"
  width={props.width || 500}
  height={props.height || 500}
  viewBox="0 0 2000 2000"
  {...props}
>
  <path
    fill="#FDFDFD"
    d="M723 460h44l29 2 27 4 28 6 22 6 25 9 18 8 16 8 15 8 22 14 22 15 12 9 15 13 8 8 6 5 7 8 13 13 9 11 10 12 15 22 11 17 10 18 10 19 10 22 11 33 5 21 4 11 2 18 1 4 2 23 1 2v48l-1 29-4 26-1 16-4 10-2 4v7l4 7 2 2 5-1 10-9 4-2h5l8 9 8 14 7 14v2h-5l-7-9-7-12-7-10-6 1-9 11-8 16-2 2-7-1-3-1-5 3h-11l-1-3 10-35 4-17 2-12 2-11v-7l3-10 1-13 2-7v-18l-4-13-2-3h-7l-6 3-1 1-1 44-4 20-4 21-4 20-1 10-11 28-3 2h-11l-1-4 8-21 7-24 4-21 3-18 3-21 2-16v-22l-4-10-9-12-11-14-9-12-10-14-7-8-5-2-30 10-40 12-36 12-4 3h-2l-2 4-6 15-10 30-7 24-7 23-8 22-5 17-5 14-5 17-6 13-4 2-1-1v-8l9-31 8-24 1-9 7-15 22-66 10-29 3-5 27-10 43-14 27-8 13-6 3-1h10l8 7 10 13 12 16 21 27 5 6 4 2 9-1 9-6 2-5v-8l-3-13-2-19-7-33-10-34-7-15-7-16-13-23-8-14-3-4-7 1-12 5-2 8-2 19v43l-2 16-3 6-5 4-18 6-23 7-30 10-19 6-15 6-4 1h-13l-7-3-10-7-16-12-53-39-19-14-28-20-20-14-12-10-1-7 1-125 6-5 12-5 34-12 28-11 6-4 2-2v-8l-3-8-7-4-21-6-19-2-9-2h-76l-11 1-5 2-22 3-16 3-4 2-4 7v11l6 7 16 6 33 11 13 6 14 5 4 5 1 5-1 123-2 5-12 10-9 7-15 11-14 9-16 12-13 10-18 13-18 14-9 6-12 9-10 7-7 4-9 6h-15l-17-6-18-6-50-16-17-5-9-6-4-5-2-16v-63l-3-6-6-5-8-3h-6l-5 5-8 13-6 11-7 14-11 28-8 24-6 25-6 21-1 30-1 5v7l3 3 11 4h5l16-17 10-14 12-16 9-11 2-3h2l2-4 6-6 10 1 22 8 35 11 13 4 16 5 18 6 12 6 3 6 5 19 20 59 9 29 7 22 8 21 7 23 1 8-5 1-4-4-9-30-10-30-12-38-10-28-8-28-6-16-4-6v-2l-5-2-16-6-36-12-30-9-18-6-7-3-5 1-10 13-13 16-22 28-4 10-2 12-1 28 4 6 1 16-1 9 5 12 5 20 7 22 10 30 8 17 14 24 10 17 12 17 8 7 21 6 16 4 17 6 19 5 4-1 9-8 13-18 6-9 4-4 3-1 1 3-6 12-11 17-8 12-4 4-10 1-16-3-33-10-28-9h-7l-3 1-2 4-6 10 1 5 9 10v2l4 2 7 8 10 10 7 6 5 6 11 9 13 10 14 10 18 11 16 9 13 7 4 3 1 8-3 5-6-1-26-12-20-12-15-11-14-10-17-13-26-26-5-8-14-14-11-15-2-4 1-5 2-1-1-6-4-11-8-13-4-7-5-5-5-10-2-1v9l-5-1-8-9-8-16-3-10v-7l2-4 6 5 1 3-1-10-5-11-2-7-4-20-6-13-2-1v11l-1 7h-4l-4-8-1-3v-17l-2-6v-16l-4-7v-7l1-5 2 1 3 10v3l3-1v-15l-1-9 1-4v-8l-2-8-2-1-1 13-3 14-5-1 1-17-1-12v-23l1-7v-9l2-21 4-20 5-26 9-29 14-38 11-21 9-15 12-21 8-11 10-13 13-17 15-16 20-20 11-9 13-11 16-12 20-13 15-9 14-8 34-14 16-7 27-9 28-6 20-3zm-89 27-23 8-10 5-26 10-17 8-17 10-15 10-19 14-14 11-13 12-29 29-7 8-11 14-9 12-4 7 1 4 9 5h8l5-5 10-11 9-11 9-10 9-11 14-14 8-7 15-12 16-12 20-13 22-12 17-9 29-11 13-5 6-5v-12l-3-7zm219 2-2 3v12l4 5 9 4 15 4 16 7 19 10 25 14 18 11 12 9 14 11 14 12 8 7 7 7 6 8 12 14 13 15 9 10 3 2 8-1 8-5-1-5-9-14-14-17-11-12-29-29-8-7-15-12-30-20-15-9-8-4-3-3-16-6-15-8-21-8-18-5zm-205 30-4 2-14 3-24 9-28 13-20 11-19 13-16 12-11 9-11 10-8 7-3 2v2l-4 2-7 8-11 13-12 16-11 15-1 2 1 42 2 3 1 28 2 9 6 4 22 8 21 6 27 9 16 5 19 5h6l10-6 21-16 36-26 19-14 13-10 14-10 21-16 11-8 11-9 3-4 1-85v-32l-5-6-15-7-33-11-23-8zm192 0-27 10-17 6-22 8-9 5-1 1v118l7 8 14 11 18 13 13 10 18 13 15 11 17 12 14 10 16 12 15 11 13 8 2 1h9l26-9 18-4 12-5 6-3 29-9 12-5 5-4 3-9 1-48v-21l-6-12-10-14-10-11-7-8-12-13-13-13-8-7-10-9-18-13-19-12-22-12-22-11-24-9-21-6zM1040 1071h41l20 6 16 8 9 6 11 10 9 13 8 11 7 14 2 7v6l-8 5-5 1-6-3-10-1-28-1-10-11-5-6-9-6-7-2-9-1h-11l-15 2-8 4-9 9-7 11-3 12-1 20-3 10v72l6 17 6 8 10 9 7 4 14 3 15 1 16-4 9-6 8-8 7-11 1-17-2-8-15-1h-21l-2-1-1-5v-45l1-1h63l15-1 2-1h10l8 3 1 1v55l-1 9-2 4-2 21-7 20-8 13-12 13-11 9-11 7-21 7-11 2-13 2h-23l-10-3-14-3-15-5-14-9-13-11-8-11-8-14-6-19-1-5v-133l7-25 8-15 7-9 8-9 13-9 13-8 11-3 12-2zM1657 1075h11l2 3v43l-3 5-20 18-12 10-10 7-5 5-7 8-4 5 1 4 8 6 18 10 10 8 12 12 8 11 7 15 2 11 2 10 1 4v7l-3 10-1 11-5 13-10 18-9 10-10 8-17 11-20 8-10 2h-50l-15-3-10-5-13-5-12-10-9-7-9-9-5-10-2-6 5-5 7-4 25-11h7l9 7 6 5 14 8 13 4 13 2 21-4 12-5 12-8 6-7 6-13 1-4v-10l-4-9-4-6-9-10-9-6-11-4-3-1h-30l-9 2h-10l-5-4-8-13-9-15-2-4v-6l9-10 14-11 17-14 8-7 12-12 2-3v-6l-3-1-92-1-2-5-1-42 1-2 171-1zM1297 1075h35l3 3 11 31 13 34 10 25 7 19 8 22 5 12 13 34 12 34 8 20 12 33 5 12 1 6-3 2h-51l-5-5-9-27-5-13v-2l-97 1-9 4-4 8-6 18-6 15-2 1h-53l-1-1v-7l5-13 6-12 4-15 5-11 12-31 9-24 8-24 9-21 5-13 6-18 5-11 8-22 12-29 6-18 7-16zm15 99-6 8-9 23-5 17-7 20-1 5v12l3 5 4 2h41l12-4 3-3-1-9-6-14-6-22-6-16-4-13-6-10z"
  />
  <path
    fill="#FDFDFD"
    d="m745 703 4 1 8 16 6 8 13 20 15 25 10 16 8 13 8 14 6 12 11 15 8 15 4 10 5 5 7 9 7 14-4 2 6 2 9 15 9 11 5 7v2H610l-3-1-1-7 3-6 3-3h2l2-4 7-13 4-5 6-9 6-11 8-13 6-11 11-18 6-10 13-22 14-22 17-28 6-10 7-13 12-18zm3 22-7 6-1 10 5 6 2 2 2-5 1-8v-11zm-2 25-1 5 3-1-1-4zm-3 15 1 7-4 2v3l4 2 12 1 2-2 2-7-1-5-1-1zm-6 2-3 3 1 4h4l1-6zm-18 12-2 1 1 4 8 6 1-5-5-5zm50 0-5 4 1 5 3 2 6-5 1-5zm19 9-14 6-3 1 1 5 10-2 10-5 1-4zm-88 1v4l5 3 9 3h6v-4l-11-5zm41 2-5 3-1 2-1 13-2 4 1 6 7 5h10l5-2 7-8 1-6-5-8-8-7-5-2zm-46 15-7 1-1 5 2 1h27l4-1-1-5-4-1zm81 0-2 1v5l1 1h23l6-2 1-4zm-60 11-27 10-10 4-9 6-8 9v3l6-1 13-7 10-4 15-8 12-6 2-2v-4zm57 1-1 4 5 4 26 13 20 9 6 1-1-5-9-10-15-7-28-9zm-50 9-10 10-9 7-13 11-9 5-3 3v2l-5 2-12 10-4 4 9-2 12-8 2-2 6 1 12 7 6 1-5-10 3-8 7-7 6-8v-2h2l7-8 4-3v-4zm43 0-2 2 1 4 7 7 7 8 5 6 3 6 2 9 7 8 6 1 7-8h5l9 5-2-4-10-9-14-11-12-9-15-14zm-10 7-1 1 1 11 6 17v10l5 5h8l5-5-2-6-6-10-8-14-4-9zm-24 1-8 15-4 8-10 15-2 5h7l5-5 3-4h4l6 7 5 3h8l7-6 1-7-4-11-2-18-4-1-2 1v16l-3 12v7l-6-2-3-4v-7l5-15 1-8zm75 46v2h5l-1-2zm-160 16-1 3 15 2 16 1h122l9-1 37-1 3-1v-2l-2-1zm-14 0-4 2 5 1v-3zM636 1071h7l5 1 17 1 1 1 1 227 3 6 5 2 127 1 3 1 1 2 1 12v25l-1 9-4 3H616l-2-1v-285l15-2z"
  />
  <path
    fill="#E6E9EE"
    d="m814 478 11 1 18 5 9 3 2-1 7 3-3 1h-5l-1 2v12l5 5 7 3 15 4 16 7 19 10 25 14 18 11 12 9 14 11 14 12 8 7 8 8 6 8 12 14 13 15 9 10 7 1 10-5v-5l3 2 3 8 3 1v2h2l7 12 7 10 3 6 10 19 8 20 3 6 7 21 5 22 4 16 3 8 2 21 1 5v10l1 4-2 9-2 6 4 6 1 8 2 2 1 13 4 1 2-1v26l-4 26-1 16-4 10-2 4v7l4 7 2 2 5-1 10-9 4-2h5l8 9 8 14 7 14v2h-5l-7-9-7-12-7-10-6 1-9 11-8 16-2 2-7-1-3-1-5 3h-11l-1-3 10-35 4-17 2-12 2-11v-7l3-10 1-13 2-7v-18l-4-13-2-3h-7l-6 3-1 1-1 44-4 20-4 21-4 20-1 10-11 28-3 2h-11l-1-4 8-21 7-24 4-21 3-18 3-21 2-16v-22l-4-10-9-12-11-14-9-12-10-14-7-8-5-2-30 10-40 12-36 12-4 3h-2l-2 4-6 15-10 30-7 24-7 23-8 22-5 17-5 14-5 17-6 13-4 2-1-1v-8l9-31 8-24 1-9 7-15 22-66 10-29 3-5 27-10 43-14 27-8 13-6 3-1h10l8 7 10 13 12 16 21 27 5 6 4 2 9-1 9-6 2-5v-8l-3-13-2-19-7-33-10-34-7-15-7-16-13-23-8-14-3-4-7 1-12 5-2 8-2 19v43l-2 16-3 6-5 4-18 6-23 7-30 10-19 6-15 6-4 1h-13l-7-3-10-7-16-12-53-39-19-14-28-20-20-14-12-10-1-7 1-125 6-5 12-5 34-12 28-11 6-4 2-2v-8l-3-8-7-4-21-6zm26 41-27 10-17 6-22 8-9 5-1 1v118l7 8 14 11 18 13 13 10 18 13 15 11 17 12 14 10 16 12 15 11 13 8 2 1h9l26-9 18-4 12-5 6-3 29-9 12-5 5-4 3-9 1-48v-21l-6-12-10-14-10-11-7-8-12-13-13-13-8-7-10-9-18-13-19-12-22-12-22-11-24-9-21-6z"
  />
  <path
    fill="#FDFDFD"
    d="m854 1073 9 1 34 1 3 7 1 9v248l-1 12-2 9-2 2h-45l-4-1-1-8v-276l2-3zM745 703l4 1 8 16 6 8 13 20 15 25 10 16 8 13 8 14 6 12 11 15 4 7-1 2-4-2-1 1h-7l-12-5-13-7 3-1 20 9 6 2-3-6-7-8-15-7-28-9h-3l1 4 19 10 5 4-2 1-13-7-6-2 6 7 7 6 4 4 11 8 9 8 14 11 11 7 7 8-1 3-19-12-10-5h-6l-2 2h-3l1 2 17 2 7 7 1 3-3 1-9-3v-2l-13 1-3-3v-5l-5 1-6-5-6-7v-7l-5-8-12-13h-3l4 10 6 9 4 8 3 3-1 6-5 3h-11l-1-2h10l4-4-2-6-6-10-8-14-3-8h-4l1 11 6 17-1 3-2-2-5-15-3-3-1 2 2 1h-2l3 12v5l-2-4-3-7-2-18h-5l1 2v14l-3 12-1 7h-5l-5-6v-7l5-15 1-8h-3l-9 19-12 18-3 5 9-2 6-8 5 1 5 6 5 3 8 1v1h-9l-6-3-5-4h-2l-2 4-8 4-14-1-5-2-8-5-8 1-8 5-11 5-9 4-4-1 2-4 14-9 4-3 2 1-10 8 10-3 11-8 5-1 14 8 5 1-5-8 3-9 7-7 7-10h2l2-4 5-5 3-2 1-4h-6l-10 10-9 7-13 11-4 1 2-4 5-2v-2l8-7 5-2v-2l9-6 3-5-12 4-9 6-12 5-15 7-8 3-7 1-5 6-1-2 9-15 10-16 8-14 16-26 10-16 13-21 11-20 12-18zm3 22-7 6-1 10 5 6 2 2 2-5 1-8v-11zm-2 25-1 5 3-1-1-4zm-3 15 1 7-4 2v3l4 2 12 1 2-2 2-7-1-5-1-1zm-6 2-3 3 1 4h4l1-6zm-18 12-2 1 1 4 8 6 1-5-5-5zm50 0-5 4 1 5 3 2 6-5 1-5zm19 9-14 6-3 1 1 5 10-2 10-5 1-4zm-88 1v4l5 3 9 3h6v-4l-11-5zm41 2-5 3-1 2-1 13-2 4 1 6 7 5h10l5-2 7-8 1-6-5-8-8-7-5-2zm-46 15-7 1-1 5 2 1h27l4-1-1-5-4-1zm81 0-2 1v5l1 1h23l6-2 1-4zm-60 11-27 10-10 4-9 6-8 9v3l6-1 13-7 10-4 15-8 12-6 2-2v-4zm50 10-2 2 1 4 7 7 7 8 5 6 3 6 2 9 7 8 6 1 7-8h5l9 5-2-4-10-9-14-11-12-9-15-14zm41 54v2h5l-1-2zM998 1422l6 2 8 14 6 20 6 14 5 13 3 7 2 11 7 11v2l5 1 4-2 2-4 3-5 3-1 14 7 8 2h15l8-5 3-4 1-7-2-4-14-6-18-4-10-5-7-6-2-5v-24l4-8 9-8 9-4 11-2h11l12 1 10 4 8 7-3 9-5 7-6-1-11-5-5-1h-16l-5 2-3 5v7l4 5 10 4 23 5 10 5 7 7 2 12-1 16-3 9-7 7-8 4-14 3h-19l-18-5-7-4h-5l-5 8-5-1-11-3-3-3-4-6-5-5-3-1h-26l-8 7-8 11-4 2-9-1-4-3 1-6 5-10 5-20 6-14 7-20 7-15 6-15 4-6zm-2 44-3 2-5 15 1 8 3 3 3 1h8l5-3 4-6-5-10-6-9z"
  />
  <path
    fill="#E6E9EE"
    d="M698 474h12v1l-11 1-5 2-22 3-16 3-4 2-4 7v11l6 7 16 6 33 11 13 6 14 5 4 5 1 5-1 123-2 5-12 10-9 7-15 11-14 9-16 12-13 10-18 13-18 14-9 6-12 9-10 7-7 4-9 6h-15l-17-6-18-6-50-16-17-5-9-6-4-5-2-16v-63l-3-6-6-5-8-3h-8l2-5 3-2 1-6 5 5 6 3h8l4-2 2-4 13-15 9-11 11-12 7-8 10-10 8-7 15-12 16-12 20-13 22-12 17-9 29-11 13-5 5-4v-12l-1-6 9-3 7-3 21-5 7-1 2-1zm-50 45-4 2-14 3-24 9-28 13-20 11-19 13-16 12-11 9-11 10-8 7-3 2v2l-4 2-7 8-11 13-12 16-11 15-1 2 1 42 2 3 1 28 2 9 6 4 22 8 21 6 27 9 16 5 19 5h6l10-6 21-16 36-26 19-14 13-10 14-10 21-16 11-8 11-9 3-4 1-85v-32l-5-6-15-7-33-11-23-8z"
  />
  <path
    fill="#FDFDFD"
    d="m393 1065 3 1 5 16 3 5-7 5 2 10 3 10v32l-4 15-4 9-8 9-11 3-6 7-5 3-10 1-6-2-4-2-18-1-22-10-12-11-6-9-1-5v-7l-3-7-1-9v-12l2-1 7 2 17 3 6 2h15l8 1 2-3h5l3 3 4 12 7 11 5 8 7 8 7 4-5-9-7-11-7-10-3-6-5-5-3-6-1-7 2-3 2-9 3-5 1-10 3-9 2-9 4-1 11 8 8 4 7-1 3-4zm-57 63 1 7 3 6 9 14 5 5 6 7 4 2-1-5-6-11-7-8-5-9-8-8zM308 859l4 2 10 12 3 8 3 15v27l-6 16-5 6-8 7-7 10-10 6-10 4-12-1h-14l-12-5-14-9-10-9-6-7-6-14v-43l4-8 5-7 5 1 10 10 8 6 11 4 9 6 1 5-1 6 2 20v17l2 6 1 11h3v-22l-2-6v-5l2-1 3 3 2 14 3 9 2 1-1-21-2-7-1-34 1-1 9-2 10-11 6-8zM1182 859l4 2 9 15 9 10 11 7 2 2v12l-2 19-1 4-2 25h4l1-7 2-2 4 1 1 8h2l3-8 3-22v-14l-2-7-2 3-1 5-2 27-2 3-3-1v-13l2-13 1-3-2-16 10 1 23-11 9-11 4-5 4-2 6 3 4 5 2 6 3 27-2 8-1 13-7 8-5 10-11 11-15 8-11 4h-9l-2-1-20-2-14-7-9-8-5-9-4-8-6-15-1-5-1-26 2-2 3-8 3-2 2-10 7-8zM320 963l5 2 6 6 3 6 7 3 4 4 12-1 2 3 1 14-1 1-7-1-5-3 3 17 2 9v14l-5 12-7 11-9 12-5 6h-6l-5-3-3-3-7 2v10l-2 2h-18l-12-5-13-7-14-12-6-8-6-7-2-10v-37l3-3 6 1 11 6 1 3 13 1 10 4 6 5 3 8 3 14 6 16 4 10 5 4-3-14-10-27-1-7 4 1 6 17 8 19 4 8 1-1v-8l-7-20-7-17-2-9 1-5 4-4 3-5 7-7 7-24zM423 1155l9 1 13 4 4 1 9 12 10 11v2l3 1 5 9v44l-3 11-2 2-8 2-3 12-7 6-15 3h-39l-10-3-14-9-7-7-6-10-3-4-4-16 1-6 2-2h11l8 1h20l3-2 6 1 4 1 2-5 3-2 20 20 5 3 5 5 10 5-8-11-6-4-4-6-14-9-6-3-1-1 1-29-2-16 1-5 5-6zm-13 65 2 5 22 22 10 7h2l-1-5-5-8-5-3h-2l-2-4-8-6-8-7zM496 1233h11l12 1 16 5 9 7 6 7 7 6 9 24 4 1 7 1v6l-2 2h-10l-1 20-9 4-2 5 2 6-1 5-8 6-13 5-13 3h-30l-13-4-8-5-5-5-6-8-5-9-1-7 8-3 20-6 6-3 15-1v-2l-5-1 2-5 3-5v-24l-6-15-4-7 1-3zm8 51 4 5 8 6 11 6 10 6 8 2-1-5-10-7-26-13zm-1 10 1 3 5 5 10 7 16 9h5l1-4-10-7-12-7-10-5zM847 1423l20 1 3 9 3 15 6 18 3 13 1 4 6 1 4-1 2-6 6-19 5-25 4-9h23l4 1 1 2 1 80-2 7-1 1v6l2 5-2 5-3 2h-10l-2-1-1-3v-54l2-4h-2l-1 4-1 2-7 2-2 4v7l-8 19-5 9-2 2h-11l-3-2-3-11-8-16-3-10-7-1-1 4-1 43-2 6h-11l-2-2v-107zM1474 1423h24l3 3 11 23 9 19 8 16 7 1 1-61 2-1h10l7 1 1 2v30l-1 74-2 3-6 1h-10l-5-3-6-7-9-19-10-19-5-14-4-1-5 1-2 56-3 5h-13l-2-1-1-6v-102z"
  />
  <path
    fill="#E6E9EE"
    d="m745 703 4 1 8 16 6 8 13 20 15 25 10 16 8 13 8 14 6 12 11 15 4 7-1 2-4-2-1 1h-7l-12-5-13-7 3-1 20 9 6 2-3-6-7-8-15-7-28-9h-3l1 4 19 10 5 4-2 1-13-7-6-2 6 7 7 6 4 4 11 8 9 8 14 11 11 7 7 8-1 3-19-12-10-5h-6l-2 2h-3l1 2 17 2 7 7 1 3-3 1-9-3v-2l-13 1-3-3v-5l-5 1-6-5-6-7v-7l-5-8-12-13h-3l4 10 6 9 4 8 3 3-1 6-5 3h-11l-1-2h10l4-4-2-6-6-10-8-14-3-8h-4l1 11 6 17-1 3-2-2-5-15-3-3-1 2 2 1h-2l3 12v5l-2-4-3-7-2-18h-5l1 2v14l-3 12-1 7h-5l-5-6v-7l5-15 1-8h-3l-9 19-12 18-3 5 9-2 6-8 5 1 5 6 5 3 8 1v1h-9l-6-3-5-4h-2l-2 4-8 4-14-1-5-2-8-5-8 1-8 5-11 5-9 4-4-1 2-4 14-9 4-3 2 1-10 8 10-3 11-8 5-1 14 8 5 1-5-8 3-9 7-7 7-10h2l2-4 5-5 3-2 1-4h-6l-10 10-9 7-13 11-4 1 2-4 5-2v-2l8-7 5-2v-2l9-6 3-5-12 4-9 6-12 5-15 7-8 3-7 1-5 6-1-2 9-15 10-16 8-14 16-26 10-16 13-21 11-20 12-18zm0 5-8 11-8 12-9 16-15 25-6 11 1 6-1 3-5-2-3 4-3 5 1 6 22-1 9 3 1 9h2l2 8 5 3 1 6 7 1 1 1 12 1 12-4 1-4 6-4 1-9h2l-1-9v-2l4-1 5 1 25 1-3-7-4-7-3-1-1 4-10 3-5 3h-9l-2-6-5-2v-5l4 3 6-5 1-5-7-1 7-2 1 7-2 4-2 2 1 2 6-2 7-4h4l1 2-5 1-15 6 1 5 10-2 10-5 3-3v-5l-5-3-1-7-7-14-10-16-10-14-7-10h-2v-4h-2l-3-9zm-50 98-7 1-1 5 2 1h27l4-1-1-5-4-1zm81 0-2 1v5l1 1h23l6-2 1-4zm-60 11-27 10-10 4-9 6-8 9v3l6-1 13-7 10-4 15-8 12-6 2-2v-4zm50 10-2 2 1 4 7 7 7 8 5 6 3 6 2 9 7 8 6 1 7-8h5l9 5-2-4-10-9-14-11-12-9-15-14zm41 54v2h5l-1-2zM434 777l10 1 22 8 35 11 13 4 16 5 18 6 12 6 3 6 5 19 20 59 9 29 7 22 8 21 7 23 1 8-5 1-4-4-9-30-10-30-12-38-10-28-8-28-6-16-4-6v-2l-5-2-16-6-36-12-30-9-18-6-7-3-5 1-10 13-13 16-22 28-4 10-2 12-1 28 4 6 1 16-1 9 5 12 5 20 7 22 10 30 8 17 14 24 10 17v3l-3-2v-3h-2v-2h-2l4 9 2 4v3l-5-2-4-6-4-5-10-15-6-12-6-10-4-11-6-12-6-16-4-8-2-3v-11l-3-5-2-17 3-1-1-2-3-1-3-10-1-4v-7l3-7h3v-5l1-5-1-4-6 1-1-3 2-15v-30l-1-3 1-2-4 1 6-7 7-8 9-11 9-13 11-14 7-9h2l2-4z"
  />
  <path
    fill="#FDFDFD"
    d="M1615 1421h9l11 2 12 6 9 9 4 10 1 18-1 36-3 11-7 11-9 6-12 3-14 1-9-2-11-6-7-7-6-11-1-4v-49l6-16 6-8 9-7zm2 21-6 3-7 8-4 9-1 8v22l3 10 7 10 5 3h10l8-5 7-8 3-12v-16l-3-21-4-6-6-4-4-1zM1244 1423h10l7 3 1 2v71l4 8 7 6 3 1h8l8-5 4-5 2-6v-55l1-20h16l6 2v6l-2 3v51l1 2v8l-2 10-3 9-6 8-8 7-11 4-15 1-12-3-8-4-8-7-9-18v-74l3-4zM1178 1423h16l9 2 9 6 6 9 3 8v8l-3 3h-12l-11-13-5-3h-10l-7 3-4 7-1 2v46l3 6 9 6 7 1 6-3 6-5 4-8h9l8 1 1 1v9l-7 11-7 7-9 5-9 2h-11l-10-3-10-5-7-6-3-7v-14l-3-7-1-15 4-13v-16l3-10 5-7 8-6 2-1zM217 869l5 1 10 10 8 6 11 4 9 6 1 5-1 6 2 20v17l2 6 1 12 3 3-1 6h-11l-12-5-14-9-10-9-6-7-6-14v-43l4-8zM235 997l6 1 11 6 1 3 13 1 10 4 6 5 3 8 3 14 6 16 2 5 1 9h3l4 4 1 3v8l-2 2h-18l-12-5-13-7-14-12-6-8-6-7-2-10v-37zM1270 868l7 3 4 5 2 6 3 27-2 8-1 13-7 8-5 10-11 11-5 3-12 3-7 3-4 2h-5l-1-7 5-18 3-14v-29l2-7 18-9 9-11 4-5zM486 1297h12l9 5 9 4 15 9 4 2h5l1-3-4-2-1-4h5l11 6 2 4-1 4 2 6-1 5-8 6-13 5-13 3h-30l-13-4-8-5-5-5-6-8-5-9-1-7 8-3 20-6zM1342 1423h15l4 1 1 2v74l1 14 47 1 5 2 1 2v9l-4 5-34 1-5-3-8 1-6 2h-9l-8-2-2-3v-8l1-5v-80l-2-4v-8z"
  />
  <path
    fill="#E6E9EE"
    d="m358 739 1 4-6 24-4 20-3 21-2 21-1 9-1 8-2 7v11l4 2 7-1 3 4 1 13v22l1 14 1 3v7l-1 3 2 6-1 11 2 3 4 1 2 6 4 13 5 19 4 10 3 9 1 7 2 3 2 9 3 3 4 8 4 6v3h2l2 3 1 5 6 5 1 6 3 1 2 6 4 3 3 7 4 7v2l3 2 1 7-5 5h-2l2 5 2 2v3l3 1 5 7 6 5 5 6 5 4v4l3 1 3 5 6 5 15 15 5 4v3l7 2 6 5 7 5v3l6 2 14 10 10 6 3 1v2l5 2 15 8 16 8 2 2-6-1-24-11-20-12-15-11-14-10-17-13-26-26-5-8-14-14-11-15-2-4 1-5 2-1-1-6-4-11-8-13-4-7-5-5-5-10-2-1v9l-5-1-8-9-8-16-3-10v-7l2-4 6 5 1 3-1-10-5-11-2-7-4-20-6-13-2-1v11l-1 7h-4l-4-8-1-3v-17l-2-6v-16l-4-7v-7l1-5 2 1 3 10v3l3-1v-15l-1-9 1-4v-8l-2-8-2-1-1 13-3 14-5-1 1-17-1-12v-23l1-7v-9l2-21 4-20 5-26z"
  />
  <path
    fill="#FCFDFD"
    d="M1418 937h12l5 3 10 20 4 3h6l4-1 2-24h9v62l-2 5h-9l-5-2-8-16-8-14-1-1h-6l-1 5-1 24-1 3h-10l-1-1v-65z"
  />
  <path
    fill="#FDFDFD"
    d="m847 509 4 2 7 3 12 3h4v2l4-1 7 5 3 1v2h6l7 3 2 1 1 3 7 1 4 3 10 5 5 2 4 4 5 1 2 4 12 6v2l7 2v3l4 1v3l7 1 11 9 5 5 12 6 14 14 6 8 12 14 13 15 2 7 6 8-1 4-3 1v5h2l3 4-2 14h-2v4l2 1v16l-1 2h-2l-2-4v-34l-6-12-10-14-10-11-7-8-12-13-7-7-2-5-2-3-3-1-1-4h-3l-2-4-6-4-5-5-3-1v-2h-4l-6-7-6-2-1-2-7-3-1-2-11-6-5-3-3-1-1-2-7-3-12-5-16-8-7-2-30-10-4-3v-7z"
  />
  <path
    fill="#FEFEFE"
    d="M917 1425h11l8 1 2 3 1 78-2 7-1 1v6l2 5-2 5-3 2h-10l-2-1-1-7 1-5 1-6 2-37v-14h-2l-3 7-7 3-6 4-5 1v-11l6-21 4-17 1-2z"
  />
  <path
    fill="#FDFDFD"
    d="M1431 1423h12l8 1v109h-19l-2-6v-99zM1614 934l7 1 1 10-1 4-1 41-3 6-5 5-5 3-4 1h-18l-7-3-5-6-2-6-1-18v-33l1-2 11 1 2 2v33l1 13 2 5 4 2 8-1 5-5 3-8 1-37 3-6zM1145 893h2l4 4v2h-3v2l3 1 1 4-4 26-1 16-4 10-2 4v7l4 7 2 2 5-1 10-9 4-2h5l8 9 8 14 7 14v2h-5l-7-9-7-12-7-10-6 1-9 11-8 16-2 2-7-1-3-1-5 3h-11l-1-3 3-10 5-2 3-10 3-16v-6l1-2h2v-6h2l1-7 2-2v-7l3-1-2-3 1-7v-3l2-8v-8l1-2v-6zM1361 935h14l20 1 9 1 1 1v7l-29 1-3 3v13l21 1 4 1v10l-1 1-23 1-2 7v10l35 1-1 7-2 3-10 1h-34l-1-4-1-29 1-31z"
  />
  <path
    fill="#E6E9EE"
    d="M910 1424h23l4 1 1 4-2-1v-2h-19l-5 1-3 16-3 9-4 15-1 11 10-5 4-3h4l1-5 2-3 3 1v14l-2 37-1 10-2 1v-50l2-4h-2l-1 4-1 2-7 2-2 4v7l-8 19-5 9-2 2h-11l-3-2-3-11-8-16-3-10-7-1-2 5-4-4-1-7 2-2h7l10 3h6l3-3 3 11 6 1 4-1 2-6 6-19 5-25zM386 908l2 4-1 13 5 12 5 20 7 22 10 30 8 17 14 24 10 17v3l-3-2v-3h-2v-2h-2l4 9 2 4v3l-5-2-4-6-4-5-10-15-6-12-6-10-4-11-6-12-6-16-4-8-2-3v-11l-3-5-2-17 3-1-1-2-3-1-3-10-1-4v-7l3-7h3zM723 1411h44l8 4 11 8 8 9 2 4-1 6-4 3-6-1-10-6-12-11-10-8-5-2h-7l-10 6-9 10-10 9-6 4h-5l-8-8 2-5 11-9 9-9h2v-2z"
  />
  <path
    fill="#FDFDFD"
    d="M1305 937h40v7l-1 1-12 2-14 5-1 1v6l3 3 17 2 3 1 1 7-3 2-16 2-6 3-3 6-1 20h-8l-5-5v-17l2-9 1-3 1-32zM1536 936h23l2 2-1 7-15 1-10 3-3 3-1 5 3 5 6 3 16 2v6l-2 1-15 1-3 1-5 9-4 14-2 6-5 1-3-2v-52l-1-3v-11l1-1z"
  />
  <path
    fill="#FCFDFD"
    d="m1114 862 3 1 1 3 1 11v27l-4 20-4 21-4 20-1 10-11 28-3 2h-7l1-9 4-14 3-1 1-6v-3l4-11 1-8 2-6 2-9 3-13v-9l3-19v-16l4-16z"
  />
  <path
    fill="#E6E9EE"
    d="M959 1142h1l1 149 4 15 4 8 10 15 2 4 4 2 8 8 9 6 3 1v2l5 1 6 3 9 2h4l8 1 3 2 10 1h25l7-3 13-1 15-5 13-9 9-7 4-4h2l1-4 10-13 5-7 2-4 1 3-7 14-11 13-12 11-14 9-21 7-11 2-13 2h-23l-10-3-14-3-15-5-14-9-13-11-8-11-8-14-6-19-1-5v-133z"
  />
  <path
    fill="#FCFDFD"
    d="M1628 936h27l22 1v6l-5 2-9 2-1 1-2 23-2 33-2 2-6-1-5-5v-6l2-5v-25l-4-12-5-5-9-2-2-2v-6z"
  />
  <path
    fill="#E6E9EE"
    d="m577 1071 2 1-3 9-12 19-10 15-4 4-10 1-16-3-33-10-30-10-2-7-3-4v-2l-3-1-2-7 5 5 7 8 9 4 28 7 20 7 19 5 4-1 9-8 13-18 6-9 4-4zM860 895h5l-1 2-3 1 6 2 9 15 9 11 5 7v2H610l-3-1-1-7 2-3 1 6 7 2 31-1 65-1h86l22 1h61l-1-7-6-8-6-9-2-4-7-3v-4zM1342 1423h15l4 1 1 2v74l1 14 2 1-5 1-1-1-1-69-1-17h-9l-1 28v52l-2 20 2 4-5-1-2-3v-8l1-5v-80l-2-4v-8z"
  />
  <path fill="#FEFEFE" d="M1489 937h10l1 1v64l-5 3h-7l-2-2v-28l1-37z" />
  <path
    fill="#E6E9EE"
    d="M1147 926h1l-1 22-4 10-2 4v7l4 7 2 2 5-1 10-9 4-2h5l8 9 8 14 7 14v2h-5l-7-9-7-12-7-10-6 1-9 11-8 16-2 2-7-1-3-1-5 3h-4v-2h2l2-5 2-3h11l4-4 1-7-7-2 1-12h-2l-1-7h2v-9l2-1 1-8 1-4v-5h2l-3-5zM1213 893l4 2v12l-2 19-1 4-2 25h4l1-7 2-2 4 1 1 8h2l3-8 3-22v-14l-2-7-2 3-1 5-2 27-2 3-3-1v-13l2-13 1-3-2-16 10 1 5-1-1 11v24l-5 22-3 12v5l9-3 7-3 6-2 4 1-16 7-3 1h-9l-2-1-20-2-14-7-7-6 3-1 3 3 11 5v2l8 1 11 1 3-10h-2v-3h-2l-1 4-3 2-2-2v-29l2-8 2-21zM627 896h222l2 1-1 4-13 2-27 2H666l-22-3-14-1-4-1zm20 1-1 3 15 2 16 1h122l9-1 37-1 3-1v-2l-2-1zm-14 0-4 2 5 1v-3zM771 819l5 5 17 9 5 4-2 1-13-7-6-2 6 7 7 6 4 4 11 8 9 8 14 11 11 7 7 8-1 3-19-12-10-5h-6l-2 2h-3l1 2 17 2 7 7 1 3-3 1-9-3v-2l-13 1-3-3v-5l-5 1-6-5 1-2 5 4h4l7-8h5l8 5-4-5-22-18-11-8-15-14-4-2 3-3 1-4zm36 62v2h5l-1-2zM614 1280h1l1 39v29l1 10 5 1h79l42-1h57l6-1-2 4-2 1H616l-2-1zM1071 621l5 5 10 15 11 17 10 18 10 19 10 22 11 33 5 21 4 11 2 18 1 4 2 23 1 2v41h-1l-1-11-1-5v-25l-2-5-1-20-2-7-2-14-4-13-1-7-3-13-5-12-7-22-4-8-3-7-2-4v-3h-2l-8-16-9-17-5-7-4-8-6-8-9-15z"
  />
  <path
    fill="#FDFDFD"
    d="M726 1412h23l-3 3h-5l-4 4-7 5-7 8-11 10-6 4h-5l-8-8 2-5 10-3 4-3h2l1-3h2l2-4 8-7z"
  />
  <path
    fill="#E6E9EE"
    d="m560 502 3 1-17 10-9 6-4 2-1 2-11 6-12 9-13 11-11 8-5 5-10 9-4 4h-2l-1 4-7 6-12 12-4 6-5 5-9 11-7 7-2 4h-2l-2 4-3 4-2-1 8-11 20-26 15-16 20-20 11-9 13-11 16-12 20-13 15-9zM1244 1423h10l7 3 1 2v33l-1 37-2-3-1-9v-52l-1-6-8-2-5 1-1 18v61l-2 1-3-5v-74l3-4zM1087 1422h11l12 1 10 4 8 7-3 9-5 7-6-1-11-5-5-1h-16l-5 2-3 5v7l4 5 10 4 23 5 3 2-4 1-6-2-2 2-2-1v-2l-3 1-4-1h-7l-7-5h-2l-1-3-4-2-2-6v-8l3-1 2-5 8-2h10l18 1 3 2h5l5-5-1-6-9-1-3-3-2 1-2-1-11-1v-2l-11 2-9-1v-1zM1536 936h23l2 2-1 7h-11v-3l-5-1-11 1-10-2-4 2 1 14v33l2 7h1l2-10 4-9 5-3h5l-5 5-4 9-4 16-2 2-6-1-1-1v-52l-1-3v-11l1-1zM1299 1423h16l6 2v6l-2 3v51l1 2v8l-2 9-2-2-1-47-1-28h-10l-1 15-1 36-1 16 1 2-3 7-2 1 1-6v-55z"
  />
  <path
    fill="#FEFEFE"
    d="M876 1482h3l1 5v5h8l1-2h5l4 4 2 6-2 9-5 8-2-1h-10l-1 2v-11l-1-7h-2v-2h-2l-1-6h-3l3-9zM643 507h3l1 6-1 2h-2v2l-5 1-12 5-8 3-15 5-8 3-32 16-3 1-1 2-4 1-3-1 1-3 11-6 7-4 10-5h2v-2l29-12 13-4 12-5z"
  />
  <path
    fill="#E6E9EE"
    d="m425 1117 4 1 5 7 6 5 5 6 5 4v4l3 1 3 5 6 5 15 15 5 4v3l7 2 6 5 7 5v3l6 2 14 10 10 6 3 1v2l5 2 15 8 16 8 2 2-6-1-24-11-20-12-15-11-14-10-17-13-26-26-5-8-14-14-7-9zM572 1354l3 1-1 5-16 13 2 5 8 6v2l4 2 5 5-1 4-7-1-15-12-8-12 2-4 15-9zM1628 936h27l22 1-1 5-3-1h-5l-1 1h-18l-4 1 2 4 2 14 1 21-1 21h-2l-2-3v-6l2-5v-25l-4-12-5-5-9-2-2-2v-6zM1127 1483l2 3 1 17-2 12-3 6-8 7-10 4-10 2h-19l-18-5-9-5v-2l7-2 2 5 9 1 7 4 2 1v-2l5 1h13l5-2 10-3 5-1v-2l5-1 2-6v-3l2-1 1-8-3 1-2-6 2-1 2 1v-2h-2v-3l4-3zM1539 1423h1l1 6v52l3 3-1 6-1 1h-6l-5-3-1 2v-2l-4-2-2-4h-2l-1 2-1-3v-7l-3-5-4-10-8-16-4-11 1-3 13 26 11 23 3 6 7 1 1-61zM1477 1078h4v28l-1 18h39l34 1h19l2-5 1-1h8l-1 4-4 1-2 10h-1l-1-5-3-1-92-1-2-5-1-42zM847 1423l20 1 1 2h-20l-2 1v59l1 40-2 7-3-2v-107zM1431 1423h12l8 1v109h-7l3-3v-92l1-7v-4l-1-1h-13l-1 1-2 28h-1v-27z"
  />
  <path
    fill="#FBFBFC"
    d="M338 1120h5l3 3 4 12 7 11 5 8 6 8h-2l1 6 1 5-5 1-5-4-4-8 1-2 5 6 3 2-2-6-5-9-7-8-5-9-7-7 2 11-2-1-6-16h5z"
  />
  <path
    fill="#E6E9EE"
    d="m320 963 5 2 6 6 3 6 7 3 4 4 12-1 2 3 1 14-1 1-7-1-5-3 1 9-2-3-3-8-3-4v-7l-4-1-7-8-1-3-8-3-2 5-2 4-1-3 4-11zM267 927l3 1 1 2 2 14 3 9 2 1-1-25 3 1v18l2 10 1 7-4 2v4h-12v-6l-3-3 1-3v2h3v-22l-2-6v-5z"
  />
  <path
    fill="#FEFEFE"
    d="M753 1412h10l12 6v2l5 2 4 2 5 8 3 2-2 4-5 2-6-3-1-4-5-2-6-7-11-6-3-4z"
  />
  <path
    fill="#E7EAEF"
    d="m289 1021 4 1 6 17 8 19 4 8 1-1v-8l-4-11 1-4 4 9 2 7 1 10 2 7h-3l-3-3-8 2-4-3v-2h-3l-1-6 7 6-3-14-10-27z"
  />
  <path
    fill="#E6E9EE"
    d="M1201 1326h1l-1 8-5 13h-2v10l8 1 39-1 3-2v-6l5-5 3-6 1 3-8 20-2 1h-53l-1-1v-7l5-13 6-12zM1175 1440h17l7 1 3 6-1 5-8-8-3-1h-10l-7 3-4 7-1 2v46l3 6 10 7-4 1-4-1v-2l-5-1v-3h-2l-2-3v-50l3-9 5-5zM1474 1423h24l3 3-1 3-3-2-19-1-2 1v19l1 31v30l-1 25h-2l-1-6v-102zM744 760l9 2 9 3 2 3v5l-3 7-4 1h-14l-17-2v-3l3-2 2-6 5-5 3-2zm-1 5 1 7-4 2v3l4 2 12 1 2-2 2-7-1-5-1-1zm-6 2-3 3 1 4h4l1-6zM458 1135l4 1 14 14 7 6 5 6 11 9 13 10 14 10 18 11 16 9 13 7 4 3-1 2-9-4-10-6-10-5-6-4-6-3-14-10-18-14-11-8-16-16-6-4v-2l-5-1-4-6-4-4zM1361 935h14l20 1 9 1 1 1v7l-29 1-3 3-2 3v-6l2-3-5-5h-8z"
  />
  <path
    fill="#E6E9EE"
    d="M1178 1423h16l9 2 9 6 6 9 3 8v8l-2-1-1-5-4-6-3-9-3-3-13-5h-28l-6 5h-2l-2 5-3 4h-2v6l-1 1-1 15h-1l-1-6v-9l3-10 5-7 8-6 2-1z"
  />
  <path
    fill="#FEFEFE"
    d="m684 806 1 2-1 5 13 2h7l2 1-1 3-22 10h-11l1-5 3-6 4-4z"
  />
  <path
    fill="#E6E9EE"
    d="m358 739 1 4-6 24-4 20-3 21-2 21-1 9-1 8-2 7v7l-2 4v-16l1-7v-9l2-21 4-20 5-26zM393 1065l3 1 5 16 3 5-7 5 2 12-2-1-1-7-4-1-5-6v-2h-2v-7l4 1v-2l-2-1 4-5zM1303 939l3 1-1 9v19l-1 10v24h4v-14l2-9 5-3h3v2l-4 4-1 3-1 20h-8l-5-5v-17l2-9 1-3zM1137 1103l4 4 11 15 8 14 3 10v6l-8 5-5 1-6-3-10-1-28-1-10-11 1-2 9 7 1 3 9 1h30l3 2h6v-3l4-2-1-11-5-8-6-9-7-8z"
  />
  <path
    fill="#F8F8FA"
    d="m502 1282 4 2v2l10 8 11 6 10 6 3 2h-4v2l-5-2-12-7-10-5-6-2 7 8 1 2-4-1-12-6v-1h6v-2l-5-1 2-5z"
  />
  <path
    fill="#FCFCFD"
    d="m742 796 7 1 5 5 2 4v7l-5 6-2 1h-8l-1-4 3-2-2-10v-7z"
  />
  <path
    fill="#E6E9EE"
    d="m414 1213 7 6 6 5 5 7 8 5 3 4 2 4 8 10-1 4-6-1-5-2-5-5-2-3 4 2 8 5-6-12-7-4-5-5-8-7-5-4-5-2 2-5z"
  />
  <path
    fill="#FCFCFC"
    d="M1145 893h2l4 4v2h-3v2l3 1 1 4-3 21-4 2-4 3-2-2 1-7v-3l2-8v-8l1-2v-6z"
  />
  <path
    fill="#E6E9EE"
    d="m995 1463 10 2 1 6 2 1v3h2v2l3 1 1 4 2 1 2 4-4 3-1 3-7 1 5-8-5-10-5-8-5-1-2 1-6 19-4 3h-5l2-6 2-3h3l1-5 3-3h-2l1-5 1-3z"
  />
  <path fill="#FEFEFE" d="M788 815h24l3 3 3 10-2 1-16-4-5-3-9-3z" />
  <path
    fill="#E6E9EE"
    d="m764 827 2 1-1 4 8 8 7 8 5 6 3 6 2 9 2 4-5-3-1-4-1-7-4-6-12-13h-3l4 10 6 9 4 8 3 3-1 6-5 3h-11l-1-2h10l4-4-2-6-6-10-8-14-3-8-4-2 6-1zM1111 930h2l-1 11-2 7-2 13-2 14-11 28-3 2-3-1 5-9 5-16 3-8 2-10 1-2 2-13 2-7 1-8zM1220 1500h1v9l-7 11-7 7-9 5-9 2h-11l-10-3-8-4 1-2 8 1 4 3 7 1h8l7-2h4v-2l10-5 6-11 4-6zM1571 937h5l-1 10v44l2 5-1 4-3-4-2-6-1-18v-33zM1620 1439l13 3 7 4-1 6-5-5-5-3-4-1h-8l-6 3-6 7-4 9-1 8-1 25-2-4v-24l2-12 7-12 10-3zM749 721l4 1-1 19-2 14-2 2-6-1 1-11-5-1v-10l1-10 9-2zm-1 4-7 6-1 10 5 6 2 2 2-5 1-8v-11zm-2 25-1 5 3-1-1-4zM388 697l2 1-12 31-8 24-6 25-4 13h-1v-7l6-21 5-21 7-21 6-16z"
  />
  <path fill="#FEFEFE" d="m796 790 3 1 6 10 1 4-25-1-6-2 3-2 15-6h2z" />
  <path
    fill="#E6E9EE"
    d="m406 640 1 2-6 10-4 9-8 13-4 8-5 8-12 29-3 10-5 10-1-3 14-38 11-21 9-15 12-21zM1495 1467l10 2v4l4 2 1 3 4-1 2 2 3 15-1 1-1 7-3-4-8-17-3-9-4-1-6 1 1-4zM997 604h2l4 5v3l4 1 7 8 5 6 7 6v3l4 2 1 5 3 1 5 7v2l3 1 1 3 3 3 1 7h-2l-9-15-8-10-12-14-16-17-5-6zM1615 1421h9l11 2 12 6 9 9 2 4-1 3-5-7-9-7-12-6-6-1h-10l-9 3-6 3-10 9-4 4 2-6 5-6 9-7zM496 558l3 1-15 13-32 32-7 8-7 9-1-3 6-9 5-5 5-7 4-4h2l2-4 6-4 9-9h2l2-4 4-4h2l1-3 6-4zM1077 1483h13l8 2 7 1 6 4 1 5-1 5h-2l1 3-2 5-5 5-6 3h-2v-2l8-5 3-4 1-7-2-4-14-6-15-3zM1499 938h1v64l-2 2h-3l1-9v-33l2-22z"
  />
  <path fill="#E7E9EE" d="M574 1120h3l-1 6v18l1 7-4-2-6-9-1-7 7-12z" />
  <path
    fill="#FEFEFE"
    d="M722 844h1l-1 8-9 15-3 3-4 1-2-2v-6l3-1 2-4h2l2-4 7-9z"
  />
  <path
    fill="#E6E9EE"
    d="m1586 1111 7 1 4-1 1 8h2l1 7-1 2-11 2-1-3 3-4v-3l-3-1-3-6zM1432 1339l2 3 5 12 1 6-3 2h-51l-4-3 1-2 2 1 12 1h34l4-2-1-8-2-5zM1487 944h1l1 8 1 5 1 36-1 3-1 7h-3v-28zM998 1422l6 2 8 14-1 3-6-7-2-6-3-2v-2l-4 1-3 7-2 7h-2l-1 5-8 15-5 12-1-3 5-12 5-11 6-15 4-6z"
  />
  <path
    fill="#FAFBFB"
    d="M1047 667h3l3 4-2 14h-2v4l2 1v16l-1 2h-2l-2-4v-36z"
  />
  <path
    fill="#E6E9EE"
    d="m354 1143 4 4 3 6 7 8-2 1 1 6 1 5-5 1-5-4-4-8 1-2 5 6 3 2-2-6-5-9-5-6h4zM1253 996l5 1 4 4v4h-13l-8 2h-5l1-4zM1618 934l3 1 1 10-1 4-1 41-3 6-5 5-5 3-10 1 3-2 7-2 5-5h2l1-3 2-1 1-23zM1418 937l4 1h-2v66l-3-1v-65zM1536 946l4 1-6 3-3 5 2 6 7 4 9 2-2 2-9 1-11-8-1-1v-9l4-4zM1593 1140h8l3 3-1 4-6 7-2 9-1 1-7-1v-4h2l2-4 2-1 2-6 3-1-1-3h-5l-1-3zM917 497l5 1 20 10 24 15 16 11-3 1-9-6-7-5-9-4v-2l-8-4v-2l-5-1-2-1v-2l-5-1-3-1v-2l-5-1-3-1v-2l-4-1zM937 1488h1l1 19-2 7-1 1v6l2 5-2 5-5 2 1-4v-15l4-19z"
  />
  <path fill="#E8EBEF" d="m289 1021 4 1 6 17 4 9v7h-3l-10-27z" />
  <path
    fill="#E6E9EE"
    d="M1583 1449h1v45l1 18-2-1-2-7v-49zM1166 1204h1v55l-1 9-3 9h-1v-8l2-9 1-50zM1167 881l3 3-4 13h2l-1 6 2 10-3 6h2v4h-2l-2-7-1-26 2-2z"
  />
  <path
    fill="#FEFEFE"
    d="m376 1024 1 2h2l4 4 3 8 2 4-1 6h-2v-2l-4-1-3-9-4-7v-3h2z"
  />
  <path fill="#FBFBFC" d="m396 1072 1 3 3 3 2 5 2 4-2 2h-6l-5-4-1-7 4-2z" />
  <path fill="#F6F7F8" d="m414 1213 7 6 6 5 3 4-1 4-4-1-8-8-7-3 2-5z" />
  <path
    fill="#E6E9EE"
    d="m742 796 7 1 4 3-1 2-4-3-4-1 1 11 5 6 3 1-4 4h-8l-1-4 3-2-2-10v-7zM1347 1116l2 1 13 34 8 19-1 3-4-6-5-11-5-17-4-8-3-7zM1582 1134h4l1 4-3 2-9 2-2 1-2 5-3 1-2-1-5 4-2-1 16-16 4 1zM729 1422l2 1-9 10-10 9-6 4h-5l-8-8v-2l4 2v2l8 2 11-9 7-4zM1148 1465l2 1-1 18 1 8v12h-1l-3-10-1-2-1-15 3-9zM1606 1240l5 1 5 4 7 8 4 12v17l-3 2 1-6v-10l-4-9-4-6-9-10zM218 945h4l4 5 14 10 5 3 7 3 10 4v1l-9-1-14-7-13-9-8-8zM1500 1295l3 1-13 8-12 5-5 4-2 6-2-3-1-3 5-5 7-4zM1623 1288l2 4 2 1-1 4-4-1-2 4-18 12-4 2-4-1 11-6 9-7 4-5 3-6zM988 1511l2 2-7 3-7 8-7 9-7 1v-2l7-4 5-9 5-6zM324 888h2l2 8v27l-4 10-2-3 3-7v-18zM1545 1163h2l-1 4-9 5-3 4h-2l-1 3-6 4-4 6-1 1h-5l3-5 13-11zM1461 938h9v23l-2 1v-21l-2 3 1 7h-6zM516 1295l6 2 15 9 3 2h-4v2l-5-2-12-7-7-4zM1665 1125l2 1-20 18-12 10-7 4v-2h2v-2l8-5 7-8 8-7 4-2v-2h2v-2zM1621 1161l2 1-7 9-7 8-2 2-6-1-2-2 1-4 8 1 4-5h2l2-5h2l1-3zM350 1037l1 3-8 16-10 13-6 8-2-1 5-7 1-3h2l2-5h2l2-5 1-3h2l1-5 3-3zM1301 1526l2 1-6 4-7 2-15 1-12-3-6-3v-1l7 1 3 2 11 1h9l11-4zM1667 1309h2l-2 6-8 14-5 6-1-2 1-7 3-4h2l2-4zM895 1359h2l-1 3h-45l1-2zM511 1304l5 2 15 9 4 2h5l1-3 5 2 2 3-3 3-5-1-15-6v-2l-6-2-8-6z"
  />
  <path fill="#FEFEFE" d="M738 848h2v7l1 3-3 7-3 3h-2v-9l1-5 3-3z" />
  <path
    fill="#E6E9EE"
    d="m630 474 3 1-6 4-10 2-3 2-8 2-5 3-11 4-3-1 23-10zM963 1498h1v7l-1 2-1 11h-2l-3 9v5l-4-2 1-6 5-10z"
  />
  <path
    fill="#FEFEFE"
    d="m550 553 3 1-1 3-4 1-2 4-5 2-5 1-1 4h-5v-2l7-6 9-5h3z"
  />
  <path
    fill="#E6E9EE"
    d="m543 1303 5 2 9 7 2 1v2l-5 2-5-4-8-4 2-1 2 1zM1370 1173l2 2 10 29 3 9-4-3-4-11-3-8-4-13-1-3z"
  />
  <path fill="#FEFEFE" d="m352 986 4 1v2h2l-1 8-5 1-3-3-1-5z" />
  <path
    fill="#E6E9EE"
    d="M1305 937h40v4l-3-1h-23l-12-1zM346 1116l2 2 4 7 4 2 8 15 2 5 3 1 1 6-2-1-4-7-7-10-3-6-5-5-3-6zM1505 1293h7l9 7 6 5 5 3-2 1-9-1-3-5-4-5v-2l-11-1zM417 1160h2v16l1 1v12l-2 4-3-26 1-5z"
  />
  <path fill="#FEFEFE" d="M268 949h3l2 3v3h2l1 9-5 1-2-7z" />
  <path
    fill="#E6E9EE"
    d="M763 808h1v6l-3 6-4 1v2l-9 3h-8l-5-2-2-5 7 4h10l5-2 6-7zM1036 1525l8 1 3-1-2 6-2 2-5-1-8-2 5-4zM498 1291h5l6 3-3 1-3-1 7 8 1 2-4-1-12-6v-1h6v-2l-5-1zM322 933l1 3-3 6-12 11-3 3 3-10 3-2h4v-2l4-4zM994 543l7 4 11 10 8 7 6 7-4-2-7-6-5-5-12-10-4-3zM282 1115l12 3-2 2h-6l-1 1-2 14h-1l-1-7v-12zM1203 1498l4 1-4 8-8 7-7 1 1-2 7-4 4-5zM636 1071h7l5 1 17 1v3l-3-1h-17l-11-2zM740 789l8 1 7 4 6 7 2 4-1 3-5-8-7-6-5-2-6 1-3 3-2-1 5-5zM331 1123h6l6 9-1 2-5-4 2 10-2-1zM1057 1505l12 6-1 2-5 1-6-1-1-4zM1368 1318l3 3 7 15 2 10v5l-2-4-9-25zM1513 1191l2 2 1 8 6 7 3 7-1 4-7-12-5-9v-6zM1608 1182l8 6 7 4v1h-5l-1 3-5-1 1-4h2l-3-3-4-2-1-3zM750 767h3l2 3v5l-5 1-5-1 2-4zM1037 1511h2l2 5 5 1 3-1-1 3-3 1h-7v-2l-3 1v-5zM1476 1329l4 2 9 7 2 1v2l4 2 4 4-1 2-13-10-9-9zM973 1471h1v6l-3 11-3 4-3 6-1-4 6-14z"
  />
  <path
    fill="#E7EAEF"
    d="m1270 868 7 3 4 5v2l-4-1v-3l-6-2-5 3-4 3 2-4 5-5z"
  />
  <path
    fill="#E6E9EE"
    d="m443 1118 4 1 7 8 1 3 4 2v2l-4-1-6-7-5-5zM308 859l4 2 2 3-5-1-7 9-5 3 2-4zM1396 1242l2 2 9 25-1 3-7-16-3-11zM338 1120h5l3 3 4 12 4 6-1 2-4-4-4-10-2-6-6-1z"
  />
  <path fill="#FEFEFE" d="m392 956 3 1 1 11-5 1v-11z" />
  <path
    fill="#E6E9EE"
    d="m372 1157 7 3 1 7-1 1h-6l-2-4 5 2-4-7zM401 1133h1v11l-4 15-4 9-2 1 1-5 4-8 2-11 1-2z"
  />
  <path fill="#EDEFF3" d="m354 1143 4 4 4 9-1 2-4-2-2-5-4-4h4z" />
  <path fill="#E6E9EE" d="M356 824h1l-1 17 6 6-6-2-3-2-1-6h2l-1-4z" />
  <path fill="#FEFEFE" d="M419 1030h2l2 5h2l2 4v3l3 1-1 4-4-5-2-2v-3l-3-1z" />
  <path fill="#F2F3F6" d="m267 927 3 1 1 2v11h-2l-3-8v-5z" />
  <path
    fill="#E6E9EE"
    d="m645 866 1 3-6 10-5 10-4 2 2-4 6-11zM377 1176h5l-4 3-4 2-5 6-4 2v-3l9-9zM1373 973h7l3 2-9 1-2 7v8h-2v-14z"
  />
  <path fill="#FEFEFE" d="M441 655h3l1 3-2 3-6 2-2-2 1-4z" />
  <path
    fill="#E6E9EE"
    d="m1012 1512 7 1 4 2v5l2 1-1 4-9-10-3-1zM1517 1502l5 1 4 13-1 3-8-15zM450 1237l8 6 3 4v2l-7-1-2-2h3l-5-7z"
  />
  <path fill="#EDEFF2" d="m430 1229 9 6v4l-6-1-5-6z" />
  <path
    fill="#E6E9EE"
    d="m786 474 20 1 8 2v1h-13l-15-3zM1116 908h1l-1 13-2 7-3 1 1-8 2-4v-6zM435 621l2 1-7 9-7 10-2-2h2l2-5 6-9zM1073 1425h3l-2 4-9 4-2 2-3-1 7-6zM1182 859l4 2 5 9-1 2-8-9-2-1v-2zM1413 1521h3v7l-4 5h-5l5-4v-6zM300 1023l5 3 1 8 2 2v6l-2-2-6-15zM1641 1204l4 2 13 13-1 2-9-8-7-8z"
  />
  <path fill="#FBFBFC" d="M348 933h2l1 8-4 2-1-2v-6z" />
  <path fill="#E6E9EE" d="m986 1095 2 1-5 5-7 9-3 2 2-5z" />
  <path fill="#FEFEFE" d="M350 957h2l3 9-2 4-2-7-3-3z" />
  <path
    fill="#E6E9EE"
    d="M275 891h7l-6 7-2 2v-8zM1641 1343h2v2l-15 10-2-1 10-8zM1307 1162l4 1 1 4-3 2-4-4zM1338 1090l2 3 5 13-1 3-3-5-3-9zM1059 606l5 5 7 8-1 2-8-9-2-1zM1262 1317l2 1-4 4-4 8-2-4 4-6zM1368 1527l5 2v1l-9 3h-3v-2l3-3zM313 1179l9 2 8 4-4 1-13-6zM1026 1481l3 4 2 4v4h-2l-2-4 1-2h-2l-1-4zM1642 1527l1 2-8 3h-7l2-2z"
  />
  <path fill="#EFF1F4" d="m289 1021 4 1 1 4-2 3-3-3z" />
  <path
    fill="#E6E9EE"
    d="m1028 625 5 4 7 9-2 1-7-8-3-4zM417 1202h1l1 9 4 4-5-1-2-2zM396 683l1 3-6 11-2-3 6-10z"
  />
  <path fill="#FEFEFE" d="M447 650h5l1 2-3 1-3 3-4-2z" />
  <path fill="#E7EAEF" d="m415 1097 4 4-1 2-4-3z" />
</svg>
)
export default FenifutSVG
