import {
  IconCalendarStats,
  IconClockHour3,
  IconTriangleInverted,
  IconEye,
  IconEyeOff,
} from "@tabler/icons";
import React, { SyntheticEvent, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { RouterOutput } from "../../trpc";
import { RenderIf, Tooltip } from "../common";

import { ColumnBodyProps, ColumnHeadProps } from "./types";

// For some reason, the IconEyeOff type is not exported from @tabler/icons. Remove this to see if it's fixed.
declare module "@tabler/icons" {
  export const IconEyeOff: typeof IconEye;
}

dayjs.extend(relativeTime);

const statusMap: Record<
  RouterOutput["workflowLog"]["getWorkflowsByRepository"]["items"][number]["status"],
  { className: string; text: string }
> = {
  SUCCEEDED: {
    className: "bg-green-500 border-green-500",
    text: "Success",
  },
  FAILED: {
    className: "bg-red-500 border-red-500",
    text: "Failed",
  },
  CANCELLED: {
    className: "border-2 border-gray-500",
    text: "Cancelled",
  },
  IN_PROGRESS: {
    className: "bg-yellow-500 border-blue-500",
    text: "In Progress",
  },
  SKIPPED: {
    className: "border-2 border-gray-500",
    text: "Skipped",
  },
};

function StatusTableDataHead({ filters, setFilters }: ColumnHeadProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  function onTriggerTooltip(e: SyntheticEvent) {
    if (e.target && buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
      return;
    }
    setTooltipVisible(!tooltipVisible);
  }

  function onToggleIncludeSkippedWorkflows() {
    setFilters((filters) => ({
      ...filters,
      includeSkippedWorkflows: !filters.includeSkippedWorkflows,
    }));
  }

  const includeSkippedWorkflowsButton = filters.includeSkippedWorkflows ? (
    <>
      <IconEyeOff className="" />
      Hide skipped workflows
    </>
  ) : (
    <>
      <IconEye className="" />
      Show skipped workflows
    </>
  );

  return (
    <div className="inline-flex cursor-pointer items-center gap-1" onClick={onTriggerTooltip}>
      Status{" "}
      <Tooltip
        onClickOutside={() => setTooltipVisible(false)}
        open={tooltipVisible}
        tooltipClassnames="bg-white text-gray-900 font-bold border border-gray-300 shadow-md"
        mainComponent={
          <div>
            <IconTriangleInverted
              className="fill-gray-500 text-gray-500 hover:fill-gray-600 hover:text-gray-600"
              size={10}
            />
          </div>
        }
        tooltipComponent={
          <button
            ref={buttonRef}
            className="inline-flex cursor-pointer items-center gap-2 rounded p-2 hover:bg-gray-100"
            onClick={onToggleIncludeSkippedWorkflows}
          >
            {includeSkippedWorkflowsButton}
          </button>
        }
        side="bottom"
      />
    </div>
  );
}

function StatusTableDataBody(props: ColumnBodyProps) {
  const status = "workflow" in props ? props.workflow?.status : props.task?.status;
  const startedAt = (
    "workflow" in props ? props.workflow?.startedAt : props.task?.started_at
  ) as Date;
  const completedAt = (
    "workflow" in props ? props.workflow?.completedAt : props.task?.completed_at
  ) as Date | null;

  return (
    <div className="flex flex-row items-center gap-3">
      <Tooltip
        mainComponent={
          <div className={`h-3 w-3 rounded-full ${statusMap[status].className}`}></div>
        }
        tooltipComponent={
          <span className="block text-xs leading-none text-gray-100">{statusMap[status].text}</span>
        }
      />

      <div className="flex flex-col">
        <p className="inline-flex items-center gap-1">
          <IconCalendarStats size={15} />
          {dayjs().to(startedAt)}
        </p>
        <RenderIf condition={Boolean(completedAt)}>
          <p className="inline-flex items-center gap-1">
            <IconClockHour3 size={15} />
            {dayjs(completedAt).to(startedAt, true)}
          </p>
        </RenderIf>
      </div>
    </div>
  );
}

const StatusColumn = {
  Head: StatusTableDataHead,
  Body: StatusTableDataBody,
};

export default StatusColumn;
