import { AppShell, createStyles } from "@mantine/core";

import Header from "./header";

interface LayoutProps {
  children: React.ReactNode;
}

const useStyles = createStyles(() => ({
  body: {
    padding: "0 10vw",
  },
}));

function Layout({ children }: LayoutProps) {
  const { classes } = useStyles();

  return (
    <AppShell padding="md" fixed={false} header={<Header />} classNames={classes}>
      {children}
    </AppShell>
  );
}

export default Layout;
