# Coolify

**Improve your prompts and resumes much better.**

## Commands

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm sass` Compile scss files to css to use in Remix applications.

## Needed Envs

- `OPENAI_API_KEY` To use OpenAI APIs.
- `GEMINI_FLASH_KEY` To use Gemini Flash APIs.

## Pages

- `/`

  - The landing page
  - Toggle the input prompts and improved.
  - Toggle the input resumes and improved.

- `/prompt`

  - Improve prompts
  - Form
    - Prompt
    - Tokens: Minimum numbers of the rewritten prompt.
    - Category: Indicates that the prompt need knowledge of this category before running.
  - Response
    - The rewritten prompt.
  - Modal
    - Save the rewritten prompt to storages like `Local Storage`.
    - Copy the prompt to clipboard.

- `/resume`

  - Improve resumes
  - Form
    - Resume
    - Job Description
  - Response
    - Issues of the original resume.
    - The rewritten resume.
  - Modal
    - Save the rewritten resume to storages like `Local Storage`.
    - Copy the resume to clipboard.

- `/letter`

  - Improve cover letters
  - Form
    - Cover letter
    - Tokens: Minimum numbers of the rewritten cover letter.
    - Job Description
  - Response
    - The rewritten cover letter.
  - Modal
    - Save the rewritten cover letter to storages like `Local Storage`.
    - Copy the letter to clipboard.
