import {
  createStyles,
  Flex,
  Button,
  Header as MantineHeader,
  Title,
  Menu,
  ActionIcon,
} from "@mantine/core";
import Link from "next/link";
import React from "react";
import { IconUserCircle } from "@tabler/icons";

import { useUser } from "../../context/user";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    color: theme.colors[theme.primaryColor][theme.primaryShade as number],
  },
}));

function UnauthenticatedRightHeader() {
  return (
    <Button component={Link} href="/login" variant="outline">
      Log In
    </Button>
  );
}

function AuthenticatedRightHeader() {
  return (
    <Flex gap={10} align="center">
      <Menu shadow="md" trigger="hover">
        <Menu.Target>
          <ActionIcon>
            <IconUserCircle size={40} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item component={Link} href="/account/details">
            Account Details
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item color="red" component={Link} href="/logout">
            Log Out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  );
}

function Header() {
  const { classes } = useStyles();

  const { user } = useUser();

  const RightHeader = user ? AuthenticatedRightHeader : UnauthenticatedRightHeader;

  return (
    <MantineHeader height={60} className={classes.header}>
      <Flex fw={700} color="white" h="100%" w="100%" align="center" fz="30px">
        <Title order={1}>evergreendocs</Title>
      </Flex>
      <Flex gap={10} align="center">
        <RightHeader />
      </Flex>
    </MantineHeader>
  );
}

export default Header;
