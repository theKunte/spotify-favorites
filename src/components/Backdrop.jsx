// The page background: a glow in the year's colors, the year's soundprint as a
// huge, faint, slowly turning watermark, and dust drifting through a light beam.
import React, { useCallback } from "react";
import PrintCanvas from "./PrintCanvas";
import Dust from "./Dust";
import { drawYear } from "../lib/soundprint";
import { glowColors } from "../lib/color";
import { useLightScheme } from "../hooks";

const Backdrop = ({ model, accent }) => {
  const light = useLightScheme();
  const [c1, c2, c3] = glowColors(model.fromCovers ? model.palette : [], accent);
  const render = useCallback((ctx, size) => drawYear(ctx, size, model, { light }), [model, light]);

  return (
    <div className="backdrop" aria-hidden="true" style={{ "--c1": c1, "--c2": c2, "--c3": c3 }}>
      <div className="glow">
        <i className="b1" />
        <i className="b2" />
        <i className="b3" />
      </div>
      <div className="wm-wrap">
        <PrintCanvas className="wm" render={render} maxSize={1400} />
      </div>
      <div className="beam" />
      <Dust />
    </div>
  );
};

export default Backdrop;
