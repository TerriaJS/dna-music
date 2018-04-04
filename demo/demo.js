import React, { Component } from "react";

import { Analyser, Song, Sequencer, Sampler, Synth } from "../src";

import Polysynth from "./polysynth";
import Visualization from "./visualization";
import Papa from "papaparse";

import csvUrl from "./sequences.csv";
import {string2Octave} from "./transformation";

import "./index.css";

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
                console.log(result);
                this.setState({ csv: result });
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
        if(!this.state.csv || !this.state.csv.data) return null;
        const mData = string2Octave(this.state.csv.data.slice(0,100).reduce(function(prev,item){
            prev+=item['sequence'];
            return prev;
        },""));
        console.log(mData);
        return (
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
                <div>
                    Result:{" "}
                    {this.state.csv
                        ? this.state.csv.toString()
                        : "Not downloaded"}
                </div>
                <Song playing={this.state.playing} tempo={90}>
                    <Analyser onAudioProcess={this.handleAudioProcess}>
                        <Sequencer resolution={16} bars={2}>
                            <Synth
                                type="sine"
                                steps={mData}
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
        );
    }
}
