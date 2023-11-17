import csv from "csv-parser";
import fs from "fs";

(async () => {
  const res = {};
  const fileNames = ["imax", "dolby"];
  for (const fileName of fileNames) {
    res[fileName] = {
      data: { features: [] },
    };

    // todo: remove bom
    fs.createReadStream(`../cinema-data/${fileName}.csv`)
      .pipe(csv())
      .on("data", (entry) => {
        const { lng, lat, ...other } = entry;

        res[fileName].data.features.push({
          type: "Feature",
          properties: { ...other, type: fileName },
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        });
      })
      .on("end", () => {
        fs.writeFile("./src/data.json", JSON.stringify(res), "utf-8", (err) => {
          if (err) console.log(err);
        });
      });
  }
})();
