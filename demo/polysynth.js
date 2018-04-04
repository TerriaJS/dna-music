import React from "react";
import PropTypes from "prop-types";

import {
    Delay,
    MoogFilter,
    Reverb,
    Synth,
    Chorus,
    PingPong,
    Overdrive
} from "../src";

const Polysynth = props => {
    const effectLookup = {
        Chorus,
        PingPong,
        Overdrive,
        Reverb
    };

    // const Effect = effectLookup[props.effect];

    return (
        // <Effect outputGain={0.1} drive={0.1}>
            <Synth type="sine" steps={props.steps} />
        // </Effect>
    );
};

Polysynth.propTypes = {
    steps: PropTypes.array
};

export default Polysynth;
