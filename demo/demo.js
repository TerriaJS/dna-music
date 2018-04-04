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
            animals: []
        };

        this.handleAudioProcess = this.handleAudioProcess.bind(this);
        this.handlePlayToggle = this.handlePlayToggle.bind(this);
    }

    getEffect() {
        switch (this.state.animal.Kingdom) {
            case "Fungi":
                return "PingPong";
            case "Eukaryota_uK":
                return "Overdrive";
            case "Metazoa":
                return "Reverb";
            default:
                return "Chorus";
        }
    }

    componentDidMount() {
        Papa.parse(csvUrl, {
            download: true,
            header: true,
            complete: result => {
                this.setState({
                    animals: _(result.data)
                        .filter(animal => animal.sequence)
                        .uniqBy(animal => animal.Kingdom)
                        .take(20)
                        .value()
                });
                this.setAnimal(0);
            }
        });
    }

    onDropdownChange(event) {
        this.setAnimal(event.target.selectedIndex);
    }

    setAnimal(animalIndex) {
        this.setState({
            playing: false,
            animal: this.state.animals[animalIndex]
        });

        setTimeout(() => {
            this.setState({
                playing: true,
                animal: this.state.animals[animalIndex],
                music: this.state.animals[animalIndex].sequence.match(/.{1,2}/g)
            });
        }, 1000);
    }

    handleAudioProcess(analyser) {
        this.visualization.audioProcess(analyser);
    }

    handlePlayToggle() {
        this.setState({
            playing: !this.state.playing
        });
    }

    render() {
        const treble = _(this.state.music)
            .drop(4)
            .value();

        return (
            <div>
                <h1>Funky Fungi!!!</h1>
                {this.state.music ? (
                    <Song playing={this.state.playing} tempo={140}>
                        <Analyser onAudioProcess={this.handleAudioProcess}>
                            <Sequencer resolution={16} bars={1}>
                                <Sampler
                                    gain={0.7}
                                    sample="samples/kick.wav"
                                    steps={[0, 2, 8, 10]}
                                />
                                <Sampler
                                    gain={0.3}
                                    sample="samples/snare.wav"
                                    steps={[4, 12]}
                                />
                            </Sequencer>
                            <Sequencer
                                resolution={16}
                                bars={Math.ceil(treble.length / 8)}
                            >
                                <Polysynth
                                    effect={this.getEffect()}
                                    steps={treble.map((pair, index) => {
                                        return [index * 2, 1, [lookup[pair], lookup[pair]]];
                                    })}
                                />
                            </Sequencer>
                            <Sequencer resolution={2} bars={2}>
                                <Synth
                                    type="sine"
                                    gain={1}
                                    steps={_(this.state.music)
                                        .take(4)
                                        .map((pair, index) => {
                                            return [index, 1, bassLookup[pair]];
                                        })
                                        .value()}
                                />
                            </Sequencer>
                        </Analyser>
                    </Song>
                ) : null}

                <div style={{ textAlign: "center" }}>
                    Animal:
                    <select onChange={this.onDropdownChange.bind(this)}>
                        {this.state.animals.map(animal => {
                            return (
                                <option>
                                    {animal.Species} ({animal.Kingdom})
                                </option>
                            );
                        })}
                    </select>
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
