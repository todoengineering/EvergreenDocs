import { Dispatch, SetStateAction } from "react";

import { RouterOutput } from "../../trpc";

type ColumnHeadProps = {
  workflows: RouterOutput["workflowLog"]["getWorkflowsByRepository"]["items"] | undefined;
  filters: {
    includeSkippedWorkflows: boolean;
    page: number;
  };
  setFilters: Dispatch<SetStateAction<ColumnHeadProps["filters"]>>;
};

type ColumnBodyProps =
  | {
      workflow: RouterOutput["workflowLog"]["getWorkflowsByRepository"]["items"][number];
    }
  | {
      task: RouterOutput["workflowLog"]["getWorkflowsByRepository"]["items"][number]["tasks"][number];
    };

type Column = {
  Head: React.FC<ColumnHeadProps>;
  Body: React.FC<ColumnBodyProps>;
};

export type { Column, ColumnBodyProps, ColumnHeadProps };
