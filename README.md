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
    - Tokens: Minimum numbers of the rewritten prompts.
    - Category: Indicates the prompts need knowledge of this category before running.
  - Response
    - The rewritten prompts.
  - Modal
    - Save the rewritten prompts to storages like `Local Storage`.
    - Copy the prompts to clipboard.

- `/resume`
  - Improve resumes
  - Form
    - Resume
    - Job Description
  - Response
    - Issues of the original resumes.
    - The rewritten resumes.
  - Modal
    - Save the rewritten resumes to storages like `Local Storage`.
    - Copy the resumes to clipboard.
