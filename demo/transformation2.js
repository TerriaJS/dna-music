const oneStep={
    step: 0,
    duration: 1,
    A:0,
    B:0,
    C:0,
    D:0,
    E:0,
    F:0,
    Asharp:0,
    Bsharp:0,
    Csharp:0,
    Dsharp:0,
    Esharp:0,
    Fsharp:0
};

const mappings={
    "CT":"a",
    "CG":"b",
    "CA":"c",
    "GA":"d",
    "GT":"e",
    "TA":"f",
    "TC":"a",
    "GC":"b",
    "AC":"c",
    "GA":"d",
    "TG":"e",
    "AT":"f"
};

function createOctave(tone,step,sharp){
    return `${tone}${sharp==1?"#":''}${step}`;
}

export const string2Octave=function(data){
    
    const Octaves=[];

    let lastChar='';
    let steps=1;
    let sharp=0;
    let idx=1;
    data.split('').forEach(c=>{
        if(c==lastChar) {
            if(steps>=4){
                steps=1;
                if(sharp==1){
                    sharp=0;
                }else{
                    sharp==1;
                }
            }
            steps++;
            Octaves.push([
                idx,
                2,
                ["REST"]
            ]);
            idx++;
            return;
        }
        if(lastChar==''){
            lastChar=c;
            return;
        }
        let cb = lastChar+c;
        let tone = mappings[cb];
        lastChar=c;
        Octaves.push([
            idx,
            2,
            [createOctave(tone,steps,sharp)]
        ]);
        idx++;
    });
    return Octaves;
};

