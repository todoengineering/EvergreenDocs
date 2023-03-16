import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

import { ColumnBodyProps } from "./types";

function CommitTableDataHead() {
  return <>Commit</>;
}

function CommitTableDataBody(props: ColumnBodyProps) {
  const commitHash = "workflow" in props ? props.workflow.headCommit : props.task.outputCommit;
  const commitMessage =
    "workflow" in props ? props.workflow.headCommitMessage : props.task.outputCommitMessage;
  const repositoryFullName =
    "workflow" in props ? props.workflow.repositoryFullName : props.task.repositoryFullName;

  return (
    <>
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <p className="block max-w-xs truncate">{commitMessage}</p>
          </Tooltip.Trigger>

          <Tooltip.Portal>
            <Tooltip.Content
              sideOffset={4}
              className={
                "inline-flex max-w-xs items-center rounded-md bg-gray-900 px-4 py-2.5 text-xs leading-none  text-gray-100"
              }
            >
              <Tooltip.Arrow className="fill-current text-gray-900" />
              <p>{commitMessage}</p>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      <a
        onClick={(e) => e.stopPropagation()}
        href={`https://www.github.com/${repositoryFullName}/commit/${commitHash}`}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-gray-500 hover:text-blue-500 hover:underline"
      >
        {commitHash}
      </a>
    </>
  );
}

const CommitColumn = {
  Head: CommitTableDataHead,
  Body: CommitTableDataBody,
};

export default CommitColumn;
