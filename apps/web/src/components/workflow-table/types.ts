import { RouterOutput } from "../../trpc";

type ColumnBodyProps =
  | {
      workflow: RouterOutput["workflowLog"]["getLoggedInUserWorkflowLogs"]["items"][number];
    }
  | {
      task: RouterOutput["workflowLog"]["getLoggedInUserWorkflowLogs"]["items"][number]["tasks"][number];
    };

type Column = {
  Head: React.FC;
  Body: React.FC<ColumnBodyProps>;
};

export type { Column, ColumnBodyProps };
