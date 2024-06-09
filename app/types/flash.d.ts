/* eslint-disable no-var */
import { GenerativeModel } from "@google/generative-ai";

export {};

declare global {
  var _DEV_FLASH_AI: GenerativeModel | undefined;
}
