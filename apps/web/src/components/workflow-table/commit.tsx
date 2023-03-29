import React from "react";

import { Tooltip } from "../common";

import { ColumnBodyProps, ColumnHeadProps } from "./types";

function CommitTableDataHead({}: ColumnHeadProps) {
  return <>Commit</>;
}

function CommitTableDataBody(props: ColumnBodyProps) {
  const commitHash = "workflow" in props ? props.workflow.headCommit : props.task.output_commit;
  const commitMessage =
    "workflow" in props ? props.workflow.headCommitMessage : props.task.output_commit_message;
  const repositoryFullName =
    // "workflow" in props ? props.workflow.repositoryFullName : props.task.repositoryFullName;
    "workflow" in props ? props.workflow.repositoryFullName : "";

  return (
    <>
      <Tooltip
        mainComponent={<p className="max-w-xs truncate">{commitMessage}</p>}
        tooltipComponent={<p>{commitMessage}</p>}
      />

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
