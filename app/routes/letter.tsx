import { ArrowPathIcon } from "@heroicons/react/24/outline";
import {
  ActionFunctionArgs,
  json,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import CoverLetterModal from "~/components/CoverLetterModal";
import Textarea from "~/components/Textarea";
import useClickOutside from "~/hooks/useClickOutside";
import useCoverLetterModal from "~/hooks/useCoverLetterModal";
import useLocalStorage from "~/hooks/useLocalStorage";
import { cs } from "~/libs/classnames";
import ai from "~/libs/flash.server";

class CoverLetterController {
  private prompt: string;
  constructor(prompt: string) {
    this.prompt = prompt;
  }
  addTokens(tokens: string) {
    if (isNaN(Number(tokens))) {
      return this;
    }
    this.prompt = `${this.prompt}\nYour answer should be longer than ${tokens} tokens`;
    return this;
  }
  addJobPosting(job?: string) {
    if (job === undefined || job.trim().length === 0) {
      return this;
    }
    this.prompt = `${this.prompt}\nJob Posting: ${job}\n`;
    return this;
  }
  addLetter(letter: string) {
    this.prompt = `${this.prompt}\nHere is the cover letter below.\n${letter}`;
    return this;
  }
  resolve() {
    return this.prompt;
  }
}

const systemPrompt = `
You are the talented human resources specialist.
- Your mission is evaluate the my cover letter for job applying.
- You should answer like the renowned professor talking to university students.
- Your answer should have a better readability that even middle school students and senior people can understand.
- Your answer should be more unique than any plagiarism plagiarized cover letters.
- Your answer must not be detected in any plagiarism systems.
- Your answer should be much more detailed.
- You should rewrite my original cover letter.
- If there is a valid job description, You should check that whether my cover letter is well related to the job description and application qualifications written on the job posting. 
- You should include that if interviewers evaluate my cover letter positively.
- You should check if my cover letter represents me well and if there is good reasons to pick me.
- You should rewrite the cover letter much richer than my original cover letter.
- Your answer should be the improved cover letter.
- The improved cover letter should be string to parse safely.
- Your answer should be normal string.
- You should use newline character into the rewritten cover letter to parse safely.
- You must adopt the language used my original cover letter. 
  - If the original cover letter is written in English, You should rewrite issues and cover letter in English. 
  - If the original cover letter is written in Japanese, You should rewrite issues and cover letter in Japanese.
  - If the original cover letter is written in Korean, You should rewrite issues and cover letter in Korean.
`;

export const meta: MetaFunction = () => {
  return [
    { title: "Coolify" },
    {
      name: "description",
      content: "Improve your cover letter better with Coolify.",
    },
  ];
};

export const action = async (args: ActionFunctionArgs) => {
  const formData = await args.request.formData();
  const letter = formData.get("coverLetter") as string;
  const tokens = formData.get("tokens") as string;
  const jobDescription = formData.get("jobDescription") as string;

  const textResponse = await ai.textCreate(
    new CoverLetterController(systemPrompt)
      .addTokens(tokens)
      .addJobPosting(jobDescription)
      .addLetter(letter)
      .resolve()
  );
  const content = textResponse;
  return json({
    content,
  } as const);
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const { onOpen } = useCoverLetterModal();
  const [storedLetter] = useLocalStorage<string>("app:previousLetter");

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
      <CoverLetterModal />
      <section className="w-full flex justify-center flex-col items-center gap-y-4">
        <h2 className="text-6xl font-raleway font-semibold">Coolify</h2>
        <p className="font-normal text-xl text-center font-lato">
          <span>Write and Improve your cover letters.</span>
          <br />
          <span>
            Create much more attractive cover letters and make you prominent.
          </span>
        </p>
      </section>
      <div className="flex flex-col max-w-2xl w-full h-full mx-auto gap-y-4">
        <section className="flex flex-col w-full gap-y-2">
          {actionData && (
            <div className="bg-green-500 border border-green-500 px-4 py-2 rounded flex gap-x-2 items-center">
              <p className="text-white font-semibold">
                A new cover letter is created.
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
          {navigation.state === "submitting" && (
            <div className="bg-rose-500 border border-rose-500 px-4 py-2 rounded flex gap-x-2 items-center">
              <p className="text-white font-medium flex gap-x-2 sm:text-base text-sm">
                Improving the cover letter. Do not close this page.
              </p>
              <ArrowPathIcon className="w-6 h-6 animate-spin text-white ml-auto" />
            </div>
          )}
        </section>
        <Form
          method="post"
          className="w-full flex flex-col h-full gap-y-4 mt-4"
        >
          <div className="flex flex-col w-full gap-y-0.5">
            <label htmlFor="coverLetter" className="text-2xl font-semibold">
              Cover Letter
            </label>
            <Textarea
              name="coverLetter"
              id="coverLetter"
              className="w-full border border-gray-400 focus:border-blue-500 outline-none py-0.5 px-1 rounded-sm font-light flex h-56"
            />
            <p className="font-light text-sm">
              Feel free to enter cover letters.
            </p>
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
                "w-full border outline-none py-0.5 px-1 rounded-sm font-light border-gray-500",
                errors.tokens && "border-red-500",
                !errors.tokens && "focus:border-blue-500"
              )}
              onChange={onTokensChange}
            />
            {!errors.tokens && (
              <p className="font-light text-sm">
                Minimum number of tokens for the cover letter you want to
                create.
              </p>
            )}
            {errors.tokens && (
              <p className="text-red-500 text-sm font-light">{errors.tokens}</p>
            )}
          </div>
          <div className="w-full flex flex-col gap-y-0.5">
            <label htmlFor="jobDescription" className="text-xl font-semibold">
              Job Description
            </label>
            <Textarea
              className="w-full min-h-56 outline-none border border-gray-400 focus:border-blue-500 rounded px-2 py-1"
              name="jobDescription"
              id="jobDescription"
              defaultValue=""
            />
            <p className="font-light text-sm">
              The detailed job description can help to improve your cover
              letter.
            </p>
          </div>
          {(isDisabled || navigation.state === "submitting") && (
            <button
              className="px-4 py-1.5 text-white uppercase rounded bg-gray-500"
              disabled={isDisabled}
              type="submit"
            >
              Submitting...
            </button>
          )}
          {!isDisabled && (
            <button
              className="px-4 py-1.5 text-white uppercase rounded bg-blue-600"
              type="submit"
            >
              New Cover Letter
            </button>
          )}
        </Form>
        {storedLetter && (
          <div>
            <button
              onClick={() => {
                if (storedLetter) {
                  onOpen("");
                }
              }}
              className="text-blue-600 font-light uppercase text-sm relative px-1 py-0.5 cursor-pointer after:bg-blue-600 after:w-full after:h-px after:bottom-0 after:left-0 after:absolute"
            >
              Show the saved cover letter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
