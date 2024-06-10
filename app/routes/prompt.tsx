import { ActionFunctionArgs, json, type MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import PromptModal from "~/components/PromptModal";
import Textarea from "~/components/Textarea";
import useClickOutside from "~/hooks/useClickOutside";
import useLocalStorage from "~/hooks/useLocalStorage";
import usePromptModal from "~/hooks/usePromptModal";
import { cs } from "~/libs/classnames";
import ai from "~/libs/openai.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const action = async (args: ActionFunctionArgs) => {
  const formData = await args.request.formData();
  const prompt = formData.get("prompt") as string;
  const tokens = formData.get("tokens") as string;
  const category = formData.get("category") as string;

  const prompts = [
    `You are the mastered prompt engineer.`,
    `- I want to improve my prompt that can give much more specific and detailed answers.`,
    `- Your mission is to give me the improved prompt from my prompt input.`,
    `- It means You should not answer of my prompt directly, You should rewrite my prompt to the refined prompt,`,
  ];
  if (category) {
    prompts.push(
      `- My prompt is used to get knowledges of ${category}. You should be ready with ${category} knowledge.`
    );
  }
  prompts.push(
    `- You should act like 'Sam Altman' using ChatGPT, teaching university students how to write prompts very well.`,
    `- Your prompt should have a better readability that even middle school students and senior people can understand.`,
    `- You should give me the improved, and extremely detailed prompt from my prompt.`,
    `- Your prompt should be more unique than any plagiarism prompts.`,
    `- Your prompt must not be detected in any plagiarism systems.`
  );
  const textResponse = await ai.text([
    {
      role: "system",
      content: prompts.join("\n"),
    },
    {
      role: "system",
      content: `The prompt should be longer than ${tokens} tokens.`,
    },
    { role: "user", content: prompt },
  ]);
  const content = textResponse.content;
  return json({
    content,
  } as const);
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  const { onOpen } = usePromptModal();
  const [storedPrompt] = useLocalStorage<string>("app:previousPrompt");

  const [errors, setErrors] = useState({
    prompt: null as string | null,
    tokens: null as string | null,
  });
  const isDisabled = Object.values(errors).some((error) => error !== null);
  useEffect(() => {
    if (actionData) {
      onOpen(actionData.content);
    }
  }, [actionData, onOpen]);
  const onTokensChange: ChangeEventHandler<HTMLInputElement> = function (
    event
  ) {
    const element = event.target;
    const value = Number(element.value);
    if (isNaN(value) || element.value === "") {
      setErrors((errors) => ({
        ...errors,
        tokens: "Tokens should be the number value.",
      }));
    } else {
      setErrors((errors) => ({
        ...errors,
        tokens: null,
      }));
    }
  };
  const onClickOutside = useCallback(
    (event: MouseEvent, element: HTMLInputElement) => {
      const value = Number(element.value);
      if (isNaN(value) || element.value === "") {
        return;
      }
      element.value = parseFloat(element.value).toString(10);
    },
    []
  );
  const { ref: tokensRef } = useClickOutside({
    onMousedownOutside: onClickOutside,
  });

  return (
    <div className="flex w-full min-h-min gap-x-4 justify-start my-8 flex-col gap-y-4 px-4">
      <PromptModal />
      <section className="w-full flex justify-center flex-col items-center gap-y-4">
        <h2 className="text-6xl font-raleway font-semibold">Coolify</h2>
        <p className="font-normal text-xl text-center font-lato">
          <span>Write and Improve your prompts.</span>
          <br />
          <span>Get much better answers with more engaging prompts.</span>
        </p>
      </section>
      <div className="flex flex-col max-w-2xl w-full h-full mx-auto gap-y-4">
        <section className="flex flex-col w-full gap-y-2">
          {actionData && (
            <div className="bg-green-500 border border-green-500 px-2 py-2 rounded flex gap-x-2 items-center">
              <p className="text-white font-semibold">
                A new prompt is created.
              </p>
              <button
                className="py-0.5 w-16 text-center bg-white text-green-500 border-green-500 tracking-wide rounded text-sm"
                onClick={() => {
                  if (actionData) {
                    onOpen(actionData.content);
                  }
                }}
              >
                CLICK
              </button>
              <button className="text-white tracking-wide rounded text-sm ml-auto mr-1">
                CLOSE
              </button>
            </div>
          )}
          {storedPrompt && (
            <div className="border-green-500 border text-green-500 bg-white px-2 py-2 rounded flex gap-x-2 items-center">
              <p className="text-green-500 font-semibold">
                Click to show the previous prompt.
              </p>
              <button
                className="py-0.5 w-16 text-center bg-green-500 text-white tracking-wide rounded text-sm"
                onClick={() => {
                  if (storedPrompt) {
                    onOpen(storedPrompt);
                  }
                }}
              >
                CLICK
              </button>
              <button className="text-green-500 tracking-wide rounded text-sm ml-auto mr-1">
                CLOSE
              </button>
            </div>
          )}
        </section>
        <Form
          method="post"
          className="w-full flex flex-col h-full gap-y-4 mt-4"
        >
          <div className="flex flex-col w-full gap-y-0.5">
            <label htmlFor="prompt" className="text-xl font-semibold">
              Prompt
            </label>
            <Textarea
              name="prompt"
              id="prompt"
              className="w-full border focus:border-blue-500 outline-none py-0.5 px-1 rounded-sm font-light flex h-56"
            />
            <p className="font-light text-sm">Feel free to enter prompts.</p>
          </div>
          <div className="w-full flex flex-col mt-4 gap-y-0.5">
            <label htmlFor="tokens" className="text-xl font-semibold">
              Tokens
            </label>
            <input
              type="number"
              name="tokens"
              id="tokens"
              ref={(element) => (tokensRef.current = element)}
              defaultValue={0}
              className={cs(
                "w-full border outline-none py-0.5 px-1 rounded-sm font-light",
                errors.tokens && "border-red-500",
                !errors.tokens && "focus:border-blue-500"
              )}
              onChange={onTokensChange}
            />
            {!errors.tokens && (
              <p className="font-light text-sm">
                Minimum number of tokens for prompts you want to create.
              </p>
            )}
            {errors.tokens && (
              <p className="text-red-500 text-sm font-light">{errors.tokens}</p>
            )}
          </div>
          <div className="w-full flex flex-col mt-4 gap-y-0.5">
            <label htmlFor="category" className="text-xl font-semibold">
              Category
            </label>
            <input
              type="text"
              name="category"
              id="category"
              className={cs(
                "w-full border outline-none py-0.5 px-1 rounded-sm font-light focus:border-blue-500"
              )}
            />
            <p className="font-light text-sm">
              Write down what knowledge your prompt needs.
            </p>
          </div>
          <button
            className="px-4 py-1.5 text-white uppercase rounded bg-blue-600"
            disabled={isDisabled}
            type="submit"
          >
            New Prompt
          </button>
        </Form>
      </div>
    </div>
  );
}
