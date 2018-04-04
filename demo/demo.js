import React, { Component } from "react";

import { Analyser, Song, Sequencer, Sampler, Synth, Monosynth } from "../src";

import Polysynth from "./polysynth";
import Visualization from "./visualization";
import Papa from "papaparse";
import _ from "lodash";
import "lodash.product";

import csvUrl from "./sequences.csv";

import "./index.css";

const notes = ["a", "b", "c", "d", "e", "f", "f", "g"];
const withOctaves = _(notes)
    .flatMap(letter => [letter + "3", letter + "4"])
    .value();

const genes = ["A", "T", "G", "C"];
const genePairs = _.product(genes, genes).map(arr => arr.join(""));

const lookup = _.zipObject(genePairs, withOctaves);

export default class Demo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playing: true,
            lightMode: true
        };

        this.handleAudioProcess = this.handleAudioProcess.bind(this);
        this.handlePlayToggle = this.handlePlayToggle.bind(this);
        this.toggleLightMode = this.toggleLightMode.bind(this);
    }

    componentDidMount() {
        Papa.parse(csvUrl, {
            download: true,
            header: true,
            complete: result => {
                this.setState({
                    csv: _(result.data)
                        .filter(animal => animal.sequence)
                        .take(10)
                        .flatMap(animal => animal.sequence.match(/.{1,2}/g))
                        .value()
                });
            }
        });
    }

    handleAudioProcess(analyser) {
        this.visualization.audioProcess(analyser);
    }
    handlePlayToggle() {
        this.setState({
            playing: !this.state.playing
        });
    }
    toggleLightMode() {
        this.setState({ lightMode: !this.state.lightMode });
    }
    render() {
        console.log(this.state.csv);
        return this.state.csv ? (
            <div
                style={
                    this.state.lightMode
                        ? {
                              paddingTop: "30px"
                          }
                        : {
                              backgroundColor: "#000",
                              width: "100%",
                              height: "100%",
                              paddingTop: "30px"
                          }
                }
            >
                <Song playing={this.state.playing} tempo={90}>
                    <Analyser onAudioProcess={this.handleAudioProcess}>
                        <Sequencer resolution={16} bars={1}>
                            <Sampler
                                sample="samples/kick.wav"
                                steps={[0, 2, 8, 10]}
                            />
                            <Sampler
                                sample="samples/snare.wav"
                                steps={[4, 12]}
                            />
                        </Sequencer>
                        <Sequencer resolution={16} bars={32}>
                            {/* steps={[
                                        [0, 1, ["c3", "d#3", "g3"]],
                                        [2, 1, ["c4"]],
                                        [8, 1, ["c3", "d#3", "g3"]],
                                        [10, 1, ["c4"]],
                                        [12, 1, ["c3", "d#3", "g3"]],
                                        [14, 1, ["d#4"]],
                                        [16, 1, ["f3", "g#3", "c4"]],
                                        [18, 1, ["f3", "g#3", "c4"]],
                                        [24, 1, ["f3", "g#3", "c4"]],
                                        [26, 1, ["f3", "g#3", "c4"]],
                                        [28, 1, ["f3", "g#3", "c4"]],
                                        [30, 1, ["f3", "g#3", "c4"]]
                                    ]} */}
                            <Polysynth
                                steps={this.state.csv.map((pair, index) => {
                                    console.log(lookup[pair]);
                                    return [index * 2, 1, lookup[pair]];
                                })}
                            />
                        </Sequencer>
                        {/* <Sequencer resolution={16} bars={2}>
                            <Synth
                                type="sine"
                                steps={[
                                    [0, 8, "c2"],
                                    [8, 4, "c2"],
                                    [12, 4, "d#2"],
                                    [16, 8, "f2"],
                                    [24, 8, "f1"]
                                ]}
                            />
                        </Sequencer> */}
                    </Analyser>
                </Song>

                <div style={{ textAlign: "center" }}>
                    <p
                        style={
                            this.state.lightMode
                                ? { color: "black" }
                                : { color: "white" }
                        }
                    >
                        Light Mode
                    </p>
                    <label className="switch">
                        <input
                            type="checkbox"
                            onChange={this.toggleLightMode}
                            checked={this.state.lightMode}
                        />
                        <div className="slider round" />
                    </label>
                </div>

                <Visualization
                    ref={c => {
                        this.visualization = c;
                    }}
                />

                <button
                    className="react-music-button"
                    type="button"
                    onClick={this.handlePlayToggle}
                >
                    {this.state.playing ? "Stop" : "Play"}
                </button>
            </div>
        ) : null;
    }
}
