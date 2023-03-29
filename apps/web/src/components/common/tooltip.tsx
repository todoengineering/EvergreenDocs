import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { MouseEventHandler, useState } from "react";
import cx from "classnames";
import { DismissableLayerProps } from "@radix-ui/react-tooltip";

type TooltipProps = {
  mainComponent: React.ReactNode;
  tooltipComponent: React.ReactNode;
  open?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onClickOutside?: DismissableLayerProps["onPointerDownOutside"];
  tooltipClassnames?: string;
};

function Tooltip({
  mainComponent,
  tooltipComponent,
  side = "top",
  open: openProp,
  onClick,
  onClickOutside,
  tooltipClassnames,
}: TooltipProps) {
  const [open, setOpen] = useState(openProp ?? false);

  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root open={openProp ?? open} onOpenChange={setOpen}>
        <TooltipPrimitive.Trigger asChild onClick={onClick}>
          {mainComponent}
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={4}
            className={cx(
              "inline-flex max-w-xs items-center rounded-md bg-gray-900 px-4 py-2.5 text-xs leading-none text-gray-100",
              tooltipClassnames
            )}
            side={side}
            onPointerDownOutside={onClickOutside ?? (() => null)}
          >
            <>
              <TooltipPrimitive.Arrow
                className={cx(
                  "fill-current text-gray-900",
                  // Hack
                  tooltipClassnames?.includes("bg-white") && "text-white"
                )}
              />
              {tooltipComponent}
            </>
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export default Tooltip;
