const { getImages, getImageSrc } = require("../api");

module.exports = async (r, s) => {
  s.setHeader("Access-Control-Allow-Origin", "*");
  s.setHeader("Content-Type", "application/json");
  const { date } = r.query;
  try {
    const filenamesJson = await getImages(date);
    if (filenamesJson.error) {
      s.statusCode = 400;
      s.json(filenamesJson);
      return;
    }
    const filename = filenamesJson.parse.images[0];
    const srcJson = await getImageSrc(filename);
    s.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
    s.statusCode = 200;
    s.json(srcJson);
  } catch (e) {
    s.statusCode = 400;
    s.json({error: e.message});
  }
};
