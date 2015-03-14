import Effect = require("../Effect");
import Grid = require("../../Grid");
import BlocksSketch = require("../../BlocksSketch");

class BitCrusher extends Effect {

    public Effect: Tone.BitCrusher;

    Init(sketch?: Fayde.Drawing.SketchContext): void {

        this.Effect = new Tone.BitCrusher(7);

        super.Init(sketch);

        // Define Outline for HitTest
        this.Outline.push(new Point(-1, 0),new Point(1, -2),new Point(1, 0),new Point(0, 1),new Point(-1, 1));

    }

    Draw() {
        super.Draw();

        (<BlocksSketch>this.Sketch).BlockSprites.Draw(this.Position,true,"bit crusher");

    }


    Delete() {
        this.Effect.dispose();
    }

    SetValue(param: string,value: number) {
        super.SetValue(param,value);
        var jsonVariable = {};
        jsonVariable[param] = value;
        if (param=="dryWet") {
            this.Effect.wet.value = value;
        } else {
            this.Effect.set(
                jsonVariable
            );
        }

    }

    GetValue(param: string) {
        super.GetValue(param);
        var val;
        if (param=="bits") {
            val = this.Effect.bits;
        } else if (param=="dryWet") {
            val = this.Effect.wet.value;
        }
        return val;
    }

    OpenParams() {
        super.OpenParams();

        this.ParamJson =
        {
            "name" : "Bit Crusher",
            "parameters" : [

                {
                    "type" : "slider",
                    "name" : "Bits",
                    "setting" : "bits",
                    "props" : {
                        "value" : this.GetValue("bits"),
                        "min" : 1,
                        "max" : 8,
                        "quantised" : false,
                        "centered" : false
                    }
                },

                {
                    "type" : "slider",
                    "name" : "Mix",
                    "setting" :"dryWet",
                    "props" : {
                        "value" : this.GetValue("dryWet"),
                        "min" : 0,
                        "max" : 1,
                        "quantised" : false,
                        "centered" : false
                    }
                }
            ]
        };
    }

}

export = BitCrusher;