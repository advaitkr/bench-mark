import fs from "fs";
import getAppModels from "../generators/appModels.js";
const modelPath = "./models/app";

const loadModels = async () => {
  await Promise.all(
    fs.readdirSync(modelPath).map(async (file) => {
      if (file !== "index.js") {
        const dynamaicallyLoadedModel = await import(`../models/app/${file}`);
        if (!global["mongoModels"]) global["mongoModels"] = {};
        if (!global["mongoModels"]["app"]) global["mongoModels"]["app"] = {};
        if (!global["app"]) global["app"] = {};
        if (!global["models"]) global["models"] = {};
        if (!global["models"]["app"]) global["models"]["app"] = {};
        let modelName = file.split(".")[0];
        const modelNameCapatilized =
          modelName.charAt(0).toUpperCase() + modelName.slice(1);
        global["mongoModels"]["app"][modelNameCapatilized] =
          dynamaicallyLoadedModel.default;
        global["app"][modelNameCapatilized] = dynamaicallyLoadedModel.default;
        global["models"]["app"][modelNameCapatilized] = getAppModels(
          modelNameCapatilized,
          dynamaicallyLoadedModel.default
        );
        console.log("loading model " + modelNameCapatilized + " [✅]");
      }
    })
  );
};

export default loadModels;
