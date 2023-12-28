/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// No Types available for paddleJS

import * as paddle from "@paddlejs/paddlejs-core"


const runner = new paddle.Runner({
    modelPath: "../../en_PP-OCRv3_rec_infer/inference.pdmodel"
})

await runner.init();

const res = await runner.predict("../../image.png")

console.log(res)