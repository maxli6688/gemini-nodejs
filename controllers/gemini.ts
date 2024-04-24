import { Request, Response } from "express";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import constants from "../constants";

const modelId = "gemini-pro";
/*
https://ai.google.dev/api/rest?hl=zh-cn
https://ai.google.dev/gemini-api/docs/get-started/rest

https://ai.google.dev/api/rest/v1beta/models/generateContent?hl=zh-cn

client
{
  "messages":[
    ["Write a story about a magic backpack."]
  ]
}

*/
const modellistUrl = `${constants.BASE_URL}/v1beta/models?key=${constants.API_KEY}`;

// 文字输入 多轮对话 modelId: gemini-pro
const url = `${constants.BASE_URL}/v1beta/models/${modelId}:generateContent?key=${constants.API_KEY}`;
const streamUrl = `${constants.BASE_URL}/v1beta/models/${modelId}:streamGenerateContent?alt=sse&key=${constants.API_KEY}`;

// const textData = {
//   contents: [
//     {
//       parts: [
//         {
//           text: "Write a story about a magic backpack.",
//         },
//       ],
//     },
//   ],
// };

// const textImageData = {
//   contents: [
//     {
//       parts: [
//         { text: "What is this picture?" },
//         {
//           inline_data: {
//             mime_type: "image/jpeg",
//             data: "'$(base64 -w0 image.jpg)'",
//           },
//         },
//       ],
//     },
//   ],
// };

const streamData = {
  contents: [
    { parts: [{ text: "Write long a story about a magic backpack." }] },
  ],
};

// 文字图片输入 modelId: gemini-pro-vision
const textImageUrl = `${constants.BASE_URL}/v1beta/models/gemini-pro-vision:generateContent?key=${constants.API_KEY}`;

const getChatData = (messages: any[]) => {
  // chatData
  const contents = [];
  for (const [inputText, responseText] of messages) {
    contents.push({ role: "user", parts: [{ text: inputText }] });
    if (responseText) {
      contents.push({ role: "model", parts: [{ text: responseText }] });
    }
  }
  // console.log(contents);
  return { contents };
};

export const generateContent = async (req: Request, res: Response) => {
  try {
    const { messages, stream } = req.body;

    const contents = getChatData(messages);
    const result = await axios.request({
      method: "POST",
      url: stream ? streamUrl : url,
      headers: {
        "Content-Type": "application/json",
      },
      data: { contents },
    });
    const response = await result.data;
    console.log(response);
    // TODO
    // stream candidates[0].content.parts[0].text
    res.status(200).json({ response });
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

const embeddingsUrl = `${constants.BASE_URL}/v1beta/models/embedding-001:embedContent?key=${constants.API_KEY}`;

const getEmbeddingsData = (text: string | string[]) => {
  // batchEmbedContents
  const embeddinsData = {
    model: "models/embedding-001",
    content: {
      parts: [
        {
          text: "Write a story about a magic backpack.",
        },
      ],
    },
  };
  const data = JSON.parse(JSON.stringify(embeddinsData));
  if (typeof text === "string") {
    data.content.parts = [{ text }];
  } else if (Array.isArray(text)) {
    data.content.parts = text.map((t) => ({ text: t }));
  }
  data.content.parts = [{ text }];
  return data;
};

export const embedContent = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({
        message: "Text is required",
      });
    }
    const data = getEmbeddingsData(text);
    const result = await axios.request({
      method: "POST",
      url: embeddingsUrl,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });
    const response = await result.data;
  } catch (error) {
    console.log(error);
  }
};

/*
函数调用
生成回答
语义检索器

*/
