import * as React from "react"
import Svg, { Ellipse, Path, SvgProps } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      viewBox="-19.632 -19.632 542.068 542.068"
      {...props}
    >
      <Ellipse
        cx={250}
        cy={250}
        rx={250}
        ry={250}
        stroke="#2E3A59"
        fill="#2E3A59"
        strokeWidth="30px"
      />
      <Path
        d="M252.102 366.05c23.784 12.223 23.784 24.445 0 36.667L85.616 488.273c-23.784 12.222-35.676 6.11-35.676-18.334v-171.11c0-24.445 11.892-30.556 35.676-18.334z"
        transform="translate(110 -130)"
        stroke="white"
        fill="transparent"
        strokeWidth="30px"
      />
    </Svg>
  )
}

export default SvgComponent
