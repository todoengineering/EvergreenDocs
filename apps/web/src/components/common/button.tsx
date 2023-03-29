import Link from "next/link";
import React from "react";
import cx from "classnames";

interface ButtonWithLinkProps extends React.ComponentProps<typeof Link> {
  variant?: keyof typeof variationClasses;
  disabled?: boolean;
}

interface ButtonWithoutLinkProps extends React.ComponentProps<"button"> {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variationClasses;
}

type ButtonProps = ButtonWithLinkProps | ButtonWithoutLinkProps;

function isButtonLinkProps(
  props: Omit<ButtonProps, "children" | "className" | "variant">
): props is ButtonWithLinkProps {
  return "href" in props;
}

function isButtonWithoutLinkProps(
  props: Omit<ButtonProps, "children" | "className" | "variant">
): props is ButtonWithoutLinkProps {
  // TODO: Better way to check if it's a button
  return "onClick" in props;
}

const baseClasses = "space-x-2 rounded-full px-5 py-2 text-sm transition-colors";

const variationClasses = {
  primary: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md",
  secondary: "bg-gray-500 hover:bg-gray-600 shadow-md",
  disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
  black: "bg-black text-white border border-black hover:bg-white hover:text-black shadow-md",
  danger: "bg-red-500 hover:bg-red-600 shadow-md",
  text: "text-black hover:text-emerald-800 font-bold",
  clear: "",
} as const;

function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  const classNames = cx(
    className,
    variationClasses[props.disabled ? "disabled" : variant],
    baseClasses
  );

  if (isButtonLinkProps(props)) {
    if (variant === "clear") {
      return (
        <Link {...props} className={className}>
          {children}
        </Link>
      );
    }

    return (
      <Link {...props} className={classNames}>
        {children}
      </Link>
    );
  }

  if (isButtonWithoutLinkProps(props)) {
    if (variant === "clear") {
      return (
        <button className={className} {...props}>
          {children}
        </button>
      );
    }

    return (
      <button className={classNames} {...props}>
        {children}
      </button>
    );
  }

  throw new Error("Button must have either href or onClick");
}

export default Button;
