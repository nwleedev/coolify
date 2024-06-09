import { useState } from "react";
import { cs } from "~/libs/classnames";
import Switch from "../Switch";
import Textarea from "../Textarea";

const inputPrompt = `You are a good web developer.
Teach me when I should use controlled input or uncontrolled input in React projects.

Your answer should be detailed, and step-by-step.`;

const improvedPrompt = `**Prompt:**

You are a highly skilled web developer with significant experience in React development. Please provide a detailed and step-by-step explanation on when to use controlled inputs and uncontrolled inputs in React projects. Your answer should include the following aspects:

1. **Definitions:**
    - Clearly define what controlled inputs and uncontrolled inputs are in the context of React.

2. **Key Differences:**
    - Highlight the main differences between controlled and uncontrolled inputs. Explain how data handling, state management, and rendering differ between the two.

3. **Use Cases:**
    - Provide specific scenarios or examples where controlled inputs are more suitable.
    - Provide specific scenarios or examples where uncontrolled inputs are more suitable.
   
4. **Pros and Cons:**
    - List the advantages and disadvantages of using controlled inputs.
    - List the advantages and disadvantages of using uncontrolled inputs.

5. **Implementation Guide:**
    - Offer a step-by-step guide on how to implement controlled inputs, including relevant code snippets.
    - Offer a step-by-step guide on how to implement uncontrolled inputs, including relevant code snippets.

6. **Best Practices:**
    - Outline best practices for working with controlled inputs.
    - Outline best practices for working with uncontrolled inputs.

7. **Performance Considerations:**
    - Discuss the impact on performance when using controlled versus uncontrolled inputs.
    - Suggest how to optimize applications for better performance when using either type of input.

8. **Advanced Tips:**
    - Share advanced tips and tricks for managing complex forms efficiently in React.
    - Explain how to handle edge cases or common issues that may arise with both controlled and uncontrolled inputs.`;

export default function PromptToggle() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="w-full max-w-2xl mt-10 flex flex-col mx-auto gap-y-1">
      <div className="w-full gap-x-1 flex justify-end items-center">
        <p className="font-lato text-sm">Toggle Prompts</p>
        <Switch
          id="promptToggle"
          isClicked={isChecked}
          onClick={() => setIsChecked((isChecked) => !isChecked)}
        />
      </div>
      <Textarea
        className={cs(
          "min-h-80 mt-2 w-full border-2 py-0.5 px-1 outline-none",
          isChecked ? "border-blue-700" : "border-black"
        )}
        value={isChecked ? improvedPrompt : inputPrompt}
        readOnly
        name="promptTextarea"
      />
    </div>
  );
}
