import {
  ActionFunctionArgs,
  json,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import PromptModal from "~/components/PromptModal";
import PromptToggle from "~/components/PromptToggle";
import ResumeToggle from "~/components/ResumeToggle";
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
  ];
  if (category) {
    prompts.push(
      `- My prompt is used to get knowledges of ${category}. You should be ready with ${category} knowledge.`
    );
  }
  prompts.push(
    `- You should act like 'Sam Altman' teaching university students how to write prompts very well.`,
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
      <article className="flex flex-col max-w-4xl w-full h-full mx-auto gap-y-8 mt-8">
        <section className="flex flex-col gap-y-2">
          <h3 className="font-raleway font-bold text-4xl">
            Enhance Your AI Prompts
          </h3>
          <p className="font-lato text-2xl">
            Have you ever been tired of ambiguous and unclear answers? You can
            reform your prompts, and get the precise, informative answers you
            may need.
          </p>
          <PromptToggle />
          <Link
            to={"/prompt"}
            className="py-2 px-2 w-40 bg-blue-700 text-white rounded font-medium text-center mx-auto mt-4"
          >
            Try Prompt
          </Link>
        </section>
        <section className="flex flex-col gap-y-2">
          <h3 className="font-raleway font-bold text-4xl">
            Rewrite Your Resume
          </h3>
          <p className="font-lato text-2xl">
            Make your resume outstanding from the people. You can revise your
            resume, highlighting your strengths and achievements.
          </p>
          <ResumeToggle />
          <Link
            to={"/resume"}
            className="py-2 px-2 w-40 bg-green-500 text-white rounded font-medium text-center mx-auto mt-4"
          >
            Try Resume
          </Link>
        </section>
      </article>
    </div>
  );
}
