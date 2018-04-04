import React, { Component } from "react";

import { Analyser, Song, Sequencer, Sampler, Synth, Monosynth } from "../src";

import Polysynth from "./polysynth";
import Visualization from "./visualization";
import Papa from "papaparse";
import _ from "lodash";
import "lodash.product";

import csvUrl from "./sequences.csv";

import "./index.css";

const notes = ["a", "b", "c", "d", "e", "f", "REST", "g"];
const withOctaves = _(notes)
    .flatMap(letter => [letter + "3", letter + "4"])
    .value();

const bassWithOctaves = _(notes)
    .flatMap(letter => [letter + "2", letter + "2"])
    .value();

const genes = ["A", "T", "G", "C"];
const genePairs = _.product(genes, genes).map(arr => arr.join(""));

const lookup = _.zipObject(genePairs, withOctaves);

const bassLookup = _.zipObject(genePairs, bassWithOctaves);

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
                <Song playing={this.state.playing} tempo={140}>
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
                        <Sequencer resolution={16} bars={16}>
                            <Polysynth
                                steps={_(this.state.csv)
                                    .take(128)
                                    .map((pair, index) => {
                                        return [index * 2, 1, lookup[pair]];
                                    })
                                    .value()}
                            />
                        </Sequencer>
                        <Sequencer resolution={2} bars={2}>
                            <Synth
                                type="sine"
                                steps={_(this.state.csv)
                                    .drop(128)
                                    .take(4)
                                    .map((pair, index) => {
                                        return [index, 1, bassLookup[pair]];
                                    })
                                    .value()}
                            />
                        </Sequencer>
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
