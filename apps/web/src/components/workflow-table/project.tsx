import React from "react";

import { ColumnBodyProps } from "./types";

function ProjectTableDataHead() {
  return <>Project</>;
}

function ProjectTableDataBody(props: ColumnBodyProps) {
  if ("workflow" in props) {
    return (
      <a
        onClick={(e) => e.stopPropagation()}
        href={`https://www.github.com/${props.workflow.repositoryFullName}`}
        target="_blank"
        rel="noreferrer"
        className="font-bold hover:text-blue-500 hover:underline"
      >
        {props.workflow.repositoryFullName}
      </a>
    );
  }

  return <></>;
}

const ProjectColumn = {
  Head: ProjectTableDataHead,
  Body: ProjectTableDataBody,
};

export default ProjectColumn;
