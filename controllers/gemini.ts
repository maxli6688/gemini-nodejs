import { Request, Response } from "express";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import constants from "../constants";

const modelId = "gemini-pro";
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
export const generateContent = async (req: Request, res: Response) => {
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
    console.log(contents);
    // res.status(200).json({ response: contents });
    const result = await axios.request({
      method: "POST",
      url: `${constants.BASE_URL}/v1beta/models/${modelId}:generateContent?key=${constants.API_KEY}`,
      // url: `${constants.BASE_URL}/v1beta/models?key=${constants.API_KEY}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { contents },
    });
    const response = await result.data;
    console.log(response);
    res.status(200).json({ response });
    // const responseText = response.text();
    // res.send({ response: responseText });
  } catch (err) {
    console.error(err.response);
    res.status(500).json({
      // status: err.status,
      status: err.response.status,
      data: err.response.data,
      message: err.message,
    });
  }
};
