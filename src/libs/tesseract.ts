import { Worker, createScheduler, createWorker } from "tesseract.js";

import untypedConfig from "../../config/config.json" assert { type: "json" };
import type { Config } from "../types/Config.js";
const config = untypedConfig as Config;

export const ocr = createScheduler();

export async function newWorkerWithConfig(): Promise<Worker> {
    //CUSTOM WORKER CONFIG HERE
    return await createWorker(
        undefined,
        1,
        {
            langPath: "../../eng.traineddata",
            errorHandler(arg) {
                console.error(arg);
            },
        },
        "--PSM=12",
    );
}

for (let i = 0; i < config.Workers; ++i) {
    ocr.addWorker(await newWorkerWithConfig());
}

console.log(`${ocr.getNumWorkers()} Workers prepared`);
