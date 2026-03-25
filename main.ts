// the scene

import { RIMA } from "./namespace/org";

// gui first

let Onstart = new RIMA.RIMAEvent("onStart", {

    Classes: {
        test: new RIMA.RimaGUI("testgui")
    }
})
Onstart.addEvent("onStart", (data) => {

})