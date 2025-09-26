import { forwardRef } from "react";
import type { BaseBlockProps, BlockHandle } from "../../types/blockComponent";
import { HeadingBlock } from "./HeadingBlock";

// 为不同标题级别创建包装组件
export const H1Block = forwardRef<BlockHandle, BaseBlockProps>((props, ref) => (
  <HeadingBlock {...props} ref={ref} headingLevel="h1" />
));

export const H2Block = forwardRef<BlockHandle, BaseBlockProps>((props, ref) => (
  <HeadingBlock {...props} ref={ref} headingLevel="h2" />
));

export const H3Block = forwardRef<BlockHandle, BaseBlockProps>((props, ref) => (
  <HeadingBlock {...props} ref={ref} headingLevel="h3" />
));