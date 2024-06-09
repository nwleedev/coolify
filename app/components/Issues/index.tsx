import { useEffect } from "react";
import useLocalStorage, { storageKey } from "~/hooks/useLocalStorage";
import Scope from "~/libs/scope";
import "./styles.css";

type Issue = {
  id: string;
  content: string;
};

export interface IssuesProps {
  issues?: Issue[];
}

export default function Issues(props: IssuesProps) {
  const { issues } = props;
  const [storedIssues, setStoredIssues] = useLocalStorage<Issue[]>(
    storageKey("issues")
  );

  useEffect(() => {
    const onBeforeUnload = function () {
      new Scope(issues).run((issues) => {
        setStoredIssues(issues);
      });
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [issues, setStoredIssues]);

  if (!issues || !storedIssues) {
    return <></>;
  }

  return (
    <div className="w-full max-w-4xl flex flex-col">
      <h2 className="text-2xl text-gray-600 py-2 font-bold sticky top-0 bg-white z-10">
        Issues
      </h2>
      <div className="flex flex-col gap-y-2 w-full issues">
        {(issues ?? storedIssues)?.map((issue) => (
          <p
            className="text-red-500 font-semibold issue text-sm"
            key={issue.id}
          >
            {issue.content}
          </p>
        ))}
      </div>
    </div>
  );
}
