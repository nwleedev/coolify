import { bundleMDX } from "mdx-bundler";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export async function bundle(content: string) {
  const { code } = await bundleMDX({
    source: content,
    mdxOptions(options) {
      options.remarkPlugins = [...(options.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeHighlight,
      ];
      return options;
    },
  });

  return code;
}
