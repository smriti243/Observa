import { TypeAnimation } from "react-type-animation";
//import "./loadingAnimation.css";

function LoadingAnimation() {
  return (
    <TypeAnimation
      sequence={[
        "Ready to Observe?", // Types 'One'

        () => {
          console.log("Sequence completed");
        },
      ]}
      wrapper="span"
      cursor={true}
      style={{
        fontSize: "2em",
        display: "inline-block",
        fontFamily: '"JetBrains Mono", serif',
        fontWeight: "700",
      }}
    />
  );
}

export default LoadingAnimation;
