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

  if ("task" in props) {
    return <p className="ml-5 inline capitalize">{props.task.preset} preset</p>;
  }

  return <></>;
}

const ProjectColumn = {
  Head: ProjectTableDataHead,
  Body: ProjectTableDataBody,
};

export default ProjectColumn;
