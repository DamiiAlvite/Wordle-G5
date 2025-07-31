import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

interface WavesBackgroundProps extends SvgProps {
  waveColor?: string;
}

function SvgComponent({ waveColor = "#fff", ...props }: WavesBackgroundProps) {
  return (
    <Svg
      viewBox="0 -240.502 587.138 1265.075"
      {...props}
      pointerEvents="none"
    >
      <Path
        d="M-92.916 698.605s259.529-316.559 260.832-474.242C169.201 68.859-78.096-240.99-78.096-240.99"
        fill={waveColor}
        stroke={waveColor}
      />
      <Path
        d="M-101.91 1018.47s69.297-88.012 119.718-98.998c64.358-14.023 166.864 68.52 244.466 65.522 72.167-2.787 169.908-96.136 206.418-72.803 34.027 21.746 54.616 151.84 17.92 189.279-65.59 66.917-605.722-45.13-605.722-45.13"
        fill={waveColor}
        stroke={waveColor}

      />
      <Path
        d="M617.667 728.53S410.858 418.515 422.084 329.217c6.4-50.91 88.147-71.511 93.717-110.016 5.084-35.144-52.819-73.968-48.896-110.015 4.294-39.457 66.543-74.295 85.568-116.126 18.164-39.937 9.019-124.731 28.522-128.351 26.727-4.961 115.895 112.569 136.5 205.769 33.828 153.014-99.828 658.052-99.828 658.052"
        fill={waveColor}
        stroke={waveColor}
      />
    </Svg>
  )
}

export default SvgComponent
