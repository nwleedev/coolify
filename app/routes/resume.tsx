import type { ActionFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Form, json, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import ResumeModal from "~/components/ResumeModal";
import Textarea from "~/components/Textarea";
import { ResumePayload } from "~/contexts/modal";
import useIsHydrated from "~/hooks/useIsHydrated";
import useLocalStorage from "~/hooks/useLocalStorage";
import useResumeModal from "~/hooks/useResumeModal";
import ai from "~/libs/flash.server";
import { bundle } from "~/libs/mdx.server";
import Scope from "~/libs/scope";

const example = `{
  "issues": [
    "This is Issue 1.",
    "This is Issue 2.",
    "This is Issue 3.",
    ... More issues
  ],
  "content": "TOTALLY REWRITTEN RESUME"
}`;

const systemPrompt = `
You are the talented human resources specialist.
- Your mission is evaluate the my resume.
- You should answer like the renowned professor talking to university students.
- Your answer should have a better readability that even middle school students and senior people can understand.
- Your answer should be more unique than any plagiarism plagiarized resumes.
- Your answer must not be detected in any plagiarism systems.
- Your answer should be much more detailed.
- Your answer need to be more critical.
- You should find what issues should be fixed in my current resume. 
- You should rewrite my original resume.
- You should check that whether my resume is well related to the job description and application qualifications written on the job posting. 
- You should include that if interviewers evaluate my resume positively.
- You should rewrite the resume much richer than my original resume.
- Your answer should include two things.
  - 1. Issues that need to be improved
  - 2. The rewritten resume.
- Each issue of issues should not be markdown string, and not include any asterisks. I want to show issues as normal string.
- The rewritten resume should be Markdown or MDX string to parse safely.
  - MDX is the Markdown format with Javascript expressions, and JSX.
- Your answer should be JSON Object.
- You should use newline character into the rewritten resume to parse safely.
- This is an example. ${example}
- You must adopt the language used my original resume. 
  - If the original resume is written in English, You should rewrite issues and resume in English. 
  - If the original resume is written in Japanese, You should rewrite issues and resume in Japanese.
  - If the original resume is written in Korean, You should rewrite issues and resume in Korean.
`;

class PromptController {
  private prompt: string;
  constructor(prompt: string) {
    this.prompt = prompt;
  }
  addJobPosting(job?: string) {
    if (job === undefined || job.trim().length === 0) {
      return this;
    }
    this.prompt = `${this.prompt}\nJob Posting: ${job}\n`;
    return this;
  }
  addResume(resume: string) {
    this.prompt = `${this.prompt}\nHere is the resume below.\n${resume}`;
    return this;
  }
  resolve() {
    return this.prompt;
  }
}

interface ResumeResponse {
  issues: string[];
  content: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Rewritely" },
    {
      name: "description",
      content: "Your resume can be better with Rewritely.",
    },
  ];
};

export async function action(args: ActionFunctionArgs) {
  const response = {
    content: undefined as string | undefined,
    code: undefined as string | undefined,
    issues: undefined as Array<{ id: string; content: string }> | undefined,
    error: undefined as string | undefined,
  };
  try {
    const formData = await args.request.formData();
    const input = formData.get("resumeInput");
    if (typeof input !== "string") {
      response.error = "Invalid resume input.";
      return json(response);
    }
    const resume = input.replace(/<(.*?)>/g, "");
    const jobInput = formData.get("jobDescription") as string | undefined;
    const created = await ai.textCreate(
      new PromptController(systemPrompt)
        .addJobPosting(jobInput)
        .addResume(resume)
        .resolve()
    );
    const parsed = created.replace(/```json|```yaml|```/g, "");
    const improvements = JSON.parse(parsed) as ResumeResponse;
    const mdxCode = await bundle(improvements.content);

    response.code = mdxCode;
    response.content = improvements.content;
    response.issues = improvements.issues.map((issue) => ({
      id: crypto.randomUUID(),
      content: issue,
    }));
    return json(response);
  } catch (error) {
    console.error(error);
    response.error = "Failed to rewrite your resume. Sorry for trying again.";
    return json(response);
  }
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  const textareaRef = useRef(null as HTMLTextAreaElement | null);
  const { onOpen } = useResumeModal();
  const isHydrated = useIsHydrated();
  const [storedResume] = useLocalStorage<ResumePayload>("app:previousResume");
  useEffect(() => {
    if (!actionData) {
      return;
    }
    const { content, code, issues } = actionData;
    new Scope([content, code, issues] as const).runAll(
      ([content, code, issues]) => {
        onOpen({
          code,
          content,
          issues,
        });
      }
    );
  }, [actionData, onOpen]);
  return (
    <div className="w-full min-h-min my-8 px-4">
      <ResumeModal />
      <div className="flex flex-col justify-center w-full max-w-4xl pt-8 mx-auto gap-y-4">
        <section className="w-full flex justify-center flex-col items-center gap-y-4">
          <h2 className="text-6xl font-raleway font-semibold">Coolify</h2>
          <p className="font-normal text-xl text-center font-lato">
            <span>Write and Improve your resume.</span>
            <br />
            <span>
              Create more professional resumes and make your career outstanding.
            </span>
          </p>
        </section>
        {actionData && (
          <div className="bg-green-500 border border-green-500 px-2 py-2 rounded flex gap-x-2 items-center">
            <p className="text-white font-semibold">A new prompt is created.</p>
            <button
              className="py-0.5 w-16 text-center bg-white text-green-500 border-green-500 tracking-wide rounded text-sm"
              onClick={() => {
                if (actionData) {
                  const { code, content, issues } = actionData;
                  new Scope([code, content, issues] as const).runAll(
                    ([code, content, issues]) => {
                      onOpen({ code, content, issues });
                    }
                  );
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
        {storedResume && (
          <div className="border-green-500 border text-green-500 bg-white px-2 py-2 rounded flex gap-x-2 items-center">
            <p className="text-green-500 font-semibold">
              Click to show the previous resume.
            </p>
            <button
              className="py-0.5 w-16 text-center bg-green-500 text-white tracking-wide rounded text-sm"
              onClick={() => {
                if (storedResume) {
                  onOpen(storedResume);
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
        <Form className="w-full mt-8 gap-y-4 flex flex-col" method="POST">
          <div className="flex flex-col w-full gap-y-0.5">
            <label htmlFor="resumeInput" className="text-xl font-semibold">
              Resume
            </label>
            <Textarea
              className="w-full min-h-96 outline-none border-2 border-gray-400 focus:border-blue-500 rounded px-2 py-1"
              name="resumeInput"
              id="resumeInput"
              ref={(element) => (textareaRef.current = element)}
            />
          </div>
          <div className="w-full flex flex-col gap-y-0.5">
            <label htmlFor="jobDescription" className="text-xl font-semibold">
              Job Description
            </label>
            <Textarea
              className="w-full min-h-56 outline-none border-2 border-gray-400 focus:border-blue-500 rounded px-2 py-1"
              name="jobDescription"
              id="jobDescription"
              defaultValue=""
            />
            <p className="font-light text-sm">
              The detailed job description can help to improve your resume.
            </p>
          </div>
          <button
            className="px-4 py-1.5 text-white uppercase rounded bg-blue-600 tracking-wide"
            type="submit"
          >
            Rewrite Resume
          </button>
        </Form>
      </div>
    </div>
  );
}
