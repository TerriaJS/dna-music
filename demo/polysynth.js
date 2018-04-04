import React from "react";
import PropTypes from "prop-types";

import { Delay, MoogFilter, Reverb, Synth, Chorus, PingPong } from "../src";

const Polysynth = props => {
    const effectLookup = {
        Chorus,
        PingPong
    };

    console.log(props.effect);
    const Effect = effectLookup[props.effect];

    return (
        <Effect>
            <Synth type="sine" steps={props.steps} />
        </Effect>
    );
};

Polysynth.propTypes = {
    steps: PropTypes.array
};

export default Polysynth;
