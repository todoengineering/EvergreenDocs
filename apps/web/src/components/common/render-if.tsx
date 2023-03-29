import { Fragment } from "react";

type RenderIfProps = {
  condition: boolean;
  children: React.ReactNode;
  as?: React.ElementType;
};

function RenderIf({ condition, children, as }: RenderIfProps) {
  if (!condition) return null;

  const Component = as || Fragment;

  return <Component>{children}</Component>;
}

export default RenderIf;
