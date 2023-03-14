import React from "react";

import { ColumnBodyProps } from "./types";

function CommitTableDataHead() {
  return <>Commit</>;
}

function CommitTableDataBody(props: ColumnBodyProps) {
  if ("workflow" in props) {
    return (
      <>
        <p className="">{props.workflow.headCommitMessage}</p>
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
