import { IconGitPullRequest } from "@tabler/icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import React from "react";

import RenderIf from "../render-if";

import { ColumnBodyProps } from "./types";

function OutputsTableDataHead() {
  return <>Outputs</>;
}

function OutputsTableDataBody(props: ColumnBodyProps) {
  if ("workflow" in props) {
    const pullRequests = props.workflow.tasks.reduce<string[]>((acc, task) => {
      const outputLinks = task.outputLinks || [];

      const pullRequestLinks = outputLinks.filter((link) =>
        link.match(/https:\/\/github.com\/.*\/pull\/.*/)
      );

      return [...acc, ...pullRequestLinks];
    }, []);

    return (
      <div className="flex flex-row items-center gap-3">
        <RenderIf condition={pullRequests.length > 0}>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div>
                  <IconGitPullRequest className="text-purple-700" />
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  sideOffset={4}
                  className={"inline-flex items-center rounded-md bg-gray-900 px-4 py-2.5"}
                >
                  <Tooltip.Arrow className="fill-current text-gray-900" />
                  <span className="block text-xs leading-none text-gray-100">
                    {pullRequests.length} pull request
                    {pullRequests.length > 1 ? "s" : ""}
                  </span>
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </RenderIf>
      </div>
    );
  }

  if ("task" in props) {
    const pullRequests =
      props.task.outputLinks?.filter((link) => link.match(/https:\/\/github.com\/.*\/pull\/.*/)) ||
      [];

    return (
      <>
        {pullRequests.map((pullRequest) => (
          <a
            onClick={(e) => e.stopPropagation()}
            key={pullRequest}
            className="inline-flex items-center gap-1 rounded-full bg-purple-700 px-1 py-2 text-xs text-white hover:bg-purple-800"
          >
            <IconGitPullRequest size={15} />
            <a href={pullRequest} target="_blank" rel="noreferrer">
              #{pullRequest.split("/").pop()}
            </a>
          </a>
        ))}
      </>
    );
  }

  return <></>;
}

const OutputsColumn = {
  Head: OutputsTableDataHead,
  Body: OutputsTableDataBody,
};

export default OutputsColumn;
