import { Link as LinkIcon } from 'lucide-react';
import { ReactNode, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { Link, useLocation } from 'react-router-dom';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/xcode.min.css';
import CopyIcon from '../CopyIcon';
import Note from '../Note';
import Help from '../Help';

interface MarkdownProps {
  source: string;
}

const MarkdownContent = ({ source }: MarkdownProps) => {
  return (
    <div className="w-full scroll-pt-20">
      <Markdown
        skipHtml={true}
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl font-light mt-6 mb-10">{children}</h1>
          ),
          h2: Heading2,
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-7 mb-4">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold mb-4">{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-semibold mb-4">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-base font-semibold mb-4">{children}</h6>
          ),
          p: ({ children }) => <p className="mb-4">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc pl-6 space-y-1 mt-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-1 mt-2">{children}</ol>
          ),
          a: ({ children, href }) => (
            <Link
              to={href as string}
              className="text-blue-700 hover:underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </Link>
          ),
          pre: ({ children }) => (
            <pre className="rounded-sm overflow-hidden relative ring-1 ring-muted bg-primary/10">
              <CopyIcon
                value={children?.toString() || ''}
                className="absolute top-2 right-2 cursor-pointer bg-muted/50 text-muted-foreground hover:text-primary"
              />
              {children}
            </pre>
          ),
          // @ts-expect-error - custom FWS component - ignore ts error
          note: ({ node, children }) => (
            <Note variant={node.properties.variant}>{children}</Note>
          ),
          help: Help,
        }}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
      >
        {source}
      </Markdown>
    </div>
  );
};

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

interface HeadingProps {
  children?: ReactNode;
}

const Heading2 = ({ children }: HeadingProps) => {
  const location = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const slug = generateSlug(children as string);
  const url = `${window.location.href.split('#')[0]}#${slug}`;

  useEffect(() => {
    if (location.hash === `#${slug}`) {
      headingRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [location.hash, slug]);

  return (
    <h2
      ref={headingRef}
      className="text-2xl font-semibold mt-6 mb-3 pt-6 border-t-2 border-muted relative group"
    >
      <span id={slug} className="absolute -top-20" />
      <CopyIcon
        icon={
          <LinkIcon
            size={14}
            className="text-muted-foreground hover:text-primary"
          />
        }
        value={url}
        className="absolute top-[22px] -left-9 hover:bg-transparent cursor-pointer hidden group-hover:block"
      />
      {children}
    </h2>
  );
};

export default MarkdownContent;
