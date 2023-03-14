import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

import { ColumnBodyProps } from "./types";

function CommitTableDataHead() {
  return <>Commit</>;
}

function CommitTableDataBody(props: ColumnBodyProps) {
  if ("workflow" in props) {
    return (
      <>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <p className="block max-w-xs truncate">{props.workflow.headCommitMessage}</p>
            </Tooltip.Trigger>

            <Tooltip.Portal>
              <Tooltip.Content
                sideOffset={4}
                className={
                  "inline-flex max-w-xs items-center rounded-md bg-gray-900 px-4 py-2.5 text-xs leading-none  text-gray-100"
                }
              >
                <Tooltip.Arrow className="fill-current text-gray-900" />
                <p>{props.workflow.headCommitMessage}</p>
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>

        <a
          onClick={(e) => e.stopPropagation()}
          href={`https://www.github.com/${props.workflow.repositoryFullName}/commit/${props.workflow.headCommit}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-gray-500 hover:text-blue-500 hover:underline"
        >
          {props.workflow.headCommit}
        </a>
      </>
    );
  }

  if ("task" in props) {
    return <p className="inline">{props.task.preset} preset</p>;
  }

  return <></>;
}

const CommitColumn = {
  Head: CommitTableDataHead,
  Body: CommitTableDataBody,
};

export default CommitColumn;
