import React, { Component } from 'react';

import {
  Analyser,
  Song,
  Sequencer,
  Sampler,
  Synth,
} from '../src';

import Polysynth from './polysynth';
import Visualization from './visualization';

import './index.css';

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

    this.oneStep={
        step: 0,
        duration: 1,
        A:0,
        B:0,
        C:0,
        D:0,
        Asharp:0,
        Bsharp:0,
        Csharp:0,
        Dsharp:0
    };

  }
  handleAudioProcess(analyser) {
    this.visualization.audioProcess(analyser);
  }
  handlePlayToggle() {
    this.setState({
      playing: !this.state.playing,
    });
  }
  toggleLightMode(){
    this.setState({lightMode: !this.state.lightMode});
  }

  createOctave(tone,step,sharp){
    return `${tone}${step}${sharp==1?"#":''}`;
  }

  render() {
    const data = "TCGTGGAGCGATTTGTCTGCTTGATTGCGATAACGAACGAGATTTCCAGTCTTTGTTCTGCGGTGGCCTTCACTAGCGGCTTCGGCTGCTGGCTGCGGGCTATCGTAGACTAAGGCTACAGACAGCATTAAAGCTGTACGAGAGGGAGCAATAACA";
    const mData = data.split("").map(item=>{
        let tone;
        switch(item){
            case "T" : tone = "A";break;
            case "C" : tone = "B";break;
            case "G" : tone = "C";break;
            case "A" : tone = "D";break;
            default: tone = "A";
        }
        if(this.oneStep[tone]>=4) {
            if(this.oneStep[`${tone}sharp`]==1){
                this.oneStep[tone]=1;
                this.oneStep[`${tone}sharp`]=0;
            }else{
                this.oneStep[tone]=1;
                this.oneStep[`${tone}sharp`]=1;
            }
        }else{
            this.oneStep[tone]++;
        }
        this.oneStep.step++;
        if(this.oneStep.step>30) this.oneStep.step=1;
        return [
            this.oneStep.step,
            2,
            [this.createOctave(tone.toLowerCase(),this.oneStep[tone],this.oneStep[`${tone}sharp`])]
        ];
    });
    return (
      <div style={this.state.lightMode ? {
        paddingTop: '30px'
      } : {
        backgroundColor: '#000',
        width: '100%',
        height: '100%',
        paddingTop: '30px'
      }}>
        <Song
          playing={this.state.playing}
          tempo={90}
        >
          <Analyser onAudioProcess={this.handleAudioProcess}>
            <Sequencer
              resolution={16}
              bars={2}
            >
              <Polysynth
                steps={mData}
              />
            </Sequencer>
            
          </Analyser>
        </Song>

        <div style={{ textAlign: 'center' }}>
          <p style={this.state.lightMode ? {color: 'black'} : {color: 'white'}}>Light Mode</p>
          <label className="switch">
            <input type="checkbox" onChange={this.toggleLightMode} checked={this.state.lightMode} />
            <div className="slider round"></div>
          </label>
        </div>

        <Visualization ref={(c) => { this.visualization = c; }} />

        <button
          className="react-music-button"
          type="button"
          onClick={this.handlePlayToggle}
        >
          {this.state.playing ? 'Stop' : 'Play'}
        </button>
      </div>
    );
  }
}
