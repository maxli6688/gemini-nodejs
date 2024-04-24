const axios = require("axios");

const modelId = 'gemini-pro';
const API_KEY = process.env.API_KEY || '';
/*
https://ai.google.dev/gemini-api/docs/get-started/rest

https://ai.google.dev/api/rest/v1beta/models/generateContent?hl=zh-cn

client
{
  "messages":[
    ["Write a story about a magic backpack."]
  ]
}

*/
const generateContent = async (req, res) => {
  try {
    const { messages } = req.body;
    console.log(req.body.messages);
    const contents = [];
    for (const [inputText, responseText] of messages) {
      contents.push({ role: "user", parts: [{ text: inputText }] });
      if (responseText) {
        contents.push({ role: "model", parts: [{ text: responseText }] });
      }
    }
    // const contents = [{ parts }];
    // console.log(contents);
    // res.status(200).json({ response: contents });

    const result = await axios.request({
      method: "POST",
      url: `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${API_KEY}`,
      // url: `https://generativelanguage.googleapis.com/v1beta/models?key=${constants.API_KEY}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { contents },
    });
    const response = await result.data;
    console.log(response);
    res.status(200).json({ response });
    const responseText = response.text();
    res.send({ response: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      // status: err.status,
      // status: err.response.status,
      // data: err.response.data,
      message: err.message,
    });
  }
}

module.exports = {
  generateContent
}
