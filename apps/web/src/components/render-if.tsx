type RenderIfProps = {
  condition: boolean;
  children: React.ReactNode;
};

function RenderIf({ condition, children }: RenderIfProps) {
  return condition ? <>{children}</> : null;
}

export default RenderIf;
