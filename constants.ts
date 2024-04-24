const API_KEY = process.env.API_KEY;

const baseUrl = "https://generativelanguage.googleapis.com"; // OR PROXY

const port = process.env.PORT;
const constants = {
  API_KEY,
  BASE_URL: baseUrl,
  PORT: port,
};
console.log(constants);

export default constants;
