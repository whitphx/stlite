import { RiShareLine } from "react-icons/ri";
import styles from "./ShareIcon.module.scss";

function ShareIcon() {
  return (
    <span className={styles.shareIconContainer}>
      {/* Set the gradient to the icon. Ref https://github.com/react-icons/react-icons/issues/251#issuecomment-738119416 */}
      <svg width="0" height="0">
        <linearGradient
          id="share-icon-gradient"
          x1="0"
          y1="0"
          x2="100%"
          y2="100%"
        >
          <stop stopColor="rgb(255, 127, 127)" offset="0%" />
          <stop stopColor="rgb(244, 75, 75)" offset="80%" />
          <stop stopColor="rgb(173, 74, 82)" offset="100%" />
        </linearGradient>
      </svg>
      <svg viewBox="0 0 32 32" className={styles.shareIconSquare}>
        <rect
          width={28}
          height={28}
          x={2}
          y={2}
          strokeWidth={2}
          rx={4}
          ry={4}
          fill="rgba(0,0,0,0)"
          stroke="url(#share-icon-gradient)"
        />
      </svg>
      <RiShareLine
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fill: "url(#share-icon-gradient)",
        }}
      />
    </span>
  );
}

export default ShareIcon;
