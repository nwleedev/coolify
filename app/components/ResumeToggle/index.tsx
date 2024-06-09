import { useState } from "react";
import { cs } from "~/libs/classnames";
import Switch from "../Switch";
import Textarea from "../Textarea";

const inputResume = `# John Doe

---

## Objective
Passionate and creative front-end developer with 2 years of experience in building responsive and user-friendly web applications. Seeking to leverage expertise in JavaScript, HTML, and CSS to contribute to teams.

I am always interested in improving and refactoring front-end performance and have experience in solving it.

---

## Education
**Bachelor of Science in Computer Science**  
University of XYZ, City, State  
Graduated: May 2021

---

## Skills
- **Programming Languages:** JavaScript, HTML, CSS, TypeScript
- **Frameworks/Libraries:** React, Angular, jQuery
- **Tools:** Git, Webpack, npm, Chrome DevTools
- **Design:** Responsive Web Design, UX/UI Principles, Adobe XD, Figma
- **Testing:** Jest, Cypress

---

## Professional Experience

**Front-End Developer**  
ABC Tech Solutions, City, State  
*June 2021 - Present*

- Developed and maintained web applications using React.
- Collaborated with UX/UI designers to implement responsive design.
- Optimized website performance by implementing lazy loading.

**Junior Front-End Developer**  
XYZ Innovations, City, State  
*June 2019 - May 2021*

- Worked closely with senior developers to create reusable components in React.
- Participated in code reviews and team meetings.
- Implemented CSS animations and transitions to enhance user interactions and improve user satisfaction.
- Debugged and resolved cross-browser compatibility issues.

---

## Projects

**Personal Portfolio Website**  
- Designed and developed a personal portfolio website showcasing projects and skills.
- Implemented responsive design techniques.
- Integrated smooth scrolling and interactive elements.

**E-Commerce Web Application**  
- Built a fully functional e-commerce web application using React and Zustand.
- Developed components for product listings, shopping cart, and user authentication.

---`;

const improvedResume = `# John Doe

---

## Objective
Seeking a challenging front-end developer position within a dynamic team to leverage my expertise in JavaScript, HTML, CSS, and React.js to build innovative and user-centric web applications.

I am passionate about crafting high-performance, responsive, and engaging user experiences, and I am always eager to refine my skills and contribute to projects that push the boundaries of web development.

---

## Education
**Bachelor of Science in Computer Science**
University of XYZ, City, State
Graduated: May 2021

---

## Skills
**Programming Languages:** JavaScript, HTML, CSS, TypeScript

**Frameworks/Libraries:** React, Angular, jQuery

**Tools:** Git, Webpack, npm, Chrome DevTools

**Design:** Responsive Web Design, UX/UI Principles, Adobe XD, Figma

**Testing:** Jest, Cypress

---

## Professional Experience

**Front-End Developer**
ABC Tech Solutions, City, State
*June 2021 - Present*

- Developed and maintained [mention specific web application name or type] using React, resulting in a [mention specific improvement or result, like 15% increase in user engagement].
- Collaborated with UX/UI designers to implement responsive design for [mention specific project or website].
- Optimized website performance by implementing lazy loading, reducing page load times by [mention specific percentage].

**Junior Front-End Developer**
XYZ Innovations, City, State
*June 2019 - May 2021*

- Worked closely with senior developers to create reusable React components for [mention specific project or application], reducing development time by [mention specific percentage].
- Participated in code reviews and team meetings, providing insightful feedback and contributing to best practices.
- Implemented CSS animations and transitions to enhance user interactions for [mention specific feature or project], increasing user satisfaction by [mention specific percentage].
- Debugged and resolved cross-browser compatibility issues for [mention specific project or website], ensuring a seamless user experience across various devices and browsers.

---

## Projects

**Personal Portfolio Website**
- Designed and developed a personal portfolio website using [mention specific technologies, such as React, HTML, CSS] to showcase my projects and skills.
- Implemented responsive design techniques, ensuring optimal viewing on various screen sizes.
- Integrated smooth scrolling and interactive elements, enhancing the user experience and making navigation intuitive.

**E-Commerce Web Application**
- Built a fully functional e-commerce web application using React and Zustand to provide a seamless online shopping experience.
- Developed components for product listings, shopping cart, and user authentication, creating a user-friendly interface.
- Integrated Stripe API for secure payment processing and Firebase for backend services, ensuring a reliable and secure transaction flow.

---
`;

export default function ResumeToggle() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="w-full max-w-2xl mt-10 flex flex-col mx-auto gap-y-1">
      <div className="w-full gap-x-1 flex justify-end items-center">
        <p className="font-lato text-sm">Toggle Resume</p>
        <Switch
          id="resumeToggle"
          isClicked={isChecked}
          onClick={() => setIsChecked((isChecked) => !isChecked)}
        />
      </div>
      <Textarea
        className={cs(
          "min-h-80 mt-2 w-full border-2 py-0.5 px-1 outline-none",
          isChecked ? "border-green-500" : "border-black"
        )}
        name="resumeTextArea"
        value={isChecked ? improvedResume : inputResume}
        readOnly
      />
    </div>
  );
}
