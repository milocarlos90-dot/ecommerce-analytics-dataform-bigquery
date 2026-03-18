const isProd = dataform.projectConfig.vars && dataform.projectConfig.vars.env === "prod";
const suffix = isProd ? "" : "_dev";

module.exports = {
  staging: "analytics_staging" + suffix,
  intermediate: "analytics_intermediate" + suffix,
  mart: "analytics_mart" + suffix,
};