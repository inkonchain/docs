// QUALITY FIX: Replaced ComponentType<any> with ComponentType<never> to eliminate 
// the unbounded 'any' escape hatch while preserving compatibility with concrete MDX props.
declare module "*.mdx" {
  import type { ComponentType } from "react";

  const component: ComponentType<{
    components?: {
      [key: string]: ComponentType<never>;
    };
  }>;
  export default component;
}