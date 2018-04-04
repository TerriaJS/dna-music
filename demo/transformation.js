const oneStep={
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

function createOctave(tone,step,sharp){
    return `${tone}${step}${sharp==1?"#":''}`;
}

export const string2Octave=function(data){
    const mData = data.split("").map(item=>{
        let tone;
        switch(item){
            case "T" : tone = "A";break;
            case "C" : tone = "B";break;
            case "G" : tone = "C";break;
            case "A" : tone = "D";break;
            default: tone = "A";
        }
        if(oneStep[tone]>=4) {
            if(oneStep[`${tone}sharp`]==1){
                oneStep[tone]=1;
                oneStep[`${tone}sharp`]=0;
            }else{
                oneStep[tone]=1;
                oneStep[`${tone}sharp`]=1;
            }
        }else{
            oneStep[tone]++;
        }
        oneStep.step++;
        if(oneStep.step>30) oneStep.step=1;
        return [
            oneStep.step,
            2,
            [createOctave(tone.toLowerCase(),oneStep[tone],oneStep[`${tone}sharp`])]
        ];
    });
    return mData;
};

