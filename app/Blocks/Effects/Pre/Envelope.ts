import PreEffect = require("../PreEffect");
import ISource = require("../../ISource");
import Grid = require("../../../Grid");
import BlocksSketch = require("../../../BlocksSketch");

class Envelope extends PreEffect {

    public attack: number;
    public decay: number;
    public sustain: number;
    public release: number;

    Init(sketch?: Fayde.Drawing.SketchContext): void {

        this.attack = 1;
        this.decay = 5;
        this.sustain = 0.7;
        this.release = 4;

        super.Init(sketch);

        // Define Outline for HitTest
        this.Outline.push(new Point(-1, -1),new Point(1, -1),new Point(1, 1),new Point(0, 2),new Point(-1, 1));
    }

    Draw() {
        super.Draw();

        (<BlocksSketch>this.Sketch).BlockSprites.Draw(this.Position,true,"envelope");
    }


    Attach(source: ISource): void{
        super.Attach(source);

        source.Envelopes.forEach((e: Tone.Envelope) => {
            e.attack = this.attack;
            e.decay = this.decay;
            e.sustain = this.sustain;
            e.release = this.release;
        });

    }

    Detach(source: ISource): void{
        super.Detach(source);

        source.Envelopes.forEach((e: Tone.Envelope) => {
            e.attack = 0.02;
            e.decay = 0.5;
            e.sustain = 0.5;
            e.release = 0.02;
        });

    }

    SetParam(param: string,value: number) {
        super.SetParam(param,value);

        if (param=="attack") {
            this.attack = value;

        } else if (param=="decay") {
            this.decay = value;
        } else if (param=="sustain") {
            this.sustain = value;
        } else if (param=="release") {
            this.release = value;
        }

        if (this.Sources.Count) {
            for (var i = 0; i < this.Sources.Count; i++) {
                var source = this.Sources.GetValueAt(i);

                source.Envelopes.forEach((e: Tone.Envelope) => {
                    e.attack = this.attack;
                    e.decay = this.decay;
                    e.sustain = this.sustain;
                    e.release = this.release;
                });
            }
        }
    }

    GetParam(param: string) {
        super.GetParam(param);
        var val = this[""+param];
        return val;
    }

    UpdateOptionsForm() {
        super.UpdateOptionsForm();

        this.OptionsForm =
        {
            "name": "Envelope",
            "parameters": [

                {
                    "type" : "ADSR",
                    "name": "ADSR",
                    "setting": "adsr",
                    "nodes": [
                        {
                            "setting": "attack",
                            "value": this.GetParam("attack"),
                            "min": 0.01,
                            "max": 10
                        },

                        {
                            "setting": "decay",
                            "value": this.GetParam("decay"),
                            "min": 0.01,
                            "max": 15
                        },

                        {
                            "setting": "sustain",
                            "value": this.GetParam("sustain"),
                            "min": 0,
                            "max": 1
                        },

                        {
                            "setting": "release",
                            "value": this.GetParam("release"),
                            "min": 0.01,
                            "max": 15
                        }
                    ]
                }
            ]
        };
    }
}

export = Envelope;