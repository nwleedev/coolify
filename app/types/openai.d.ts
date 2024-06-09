/* eslint-disable no-var */
import OpenAI from "openai";

export {};

declare global {
  var _DEV_OPEN_AI: OpenAI | undefined;
}
