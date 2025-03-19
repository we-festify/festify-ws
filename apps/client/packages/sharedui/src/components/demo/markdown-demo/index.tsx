import { PageContent, PageLayout, PageSecondaryNav } from '../../page-layout';
import MarkdownContent from '../../markdown-content';
import { useDomDocument } from '@sharedui/hooks/useDomDocument';

const markdown = `# Markdown

This is a markdown component.

## Features

- Supports basic markdown syntax
- Supports code highlighting
- Supports custom components

## Usage

\`\`\`tsx
<MarkdownContent source={markdown} />
\`\`\`

## Props

1. **source**: The markdown content to render

## Custom Components

1. **Note**: A custom component that renders a note message with different variants
2. **Help**: A custom component that renders a help message

### Note

<note variant="info">
This is a custom note component with info variant
</note>
<note variant="danger">
This is a custom note component with danger variant
</note>
<note variant="warn">
This is a custom note component with warn variant
</note>

### Help

This is a custom help component <help>This is a help message</help> and it works inline as well.

`;

const getSecondHeadings = (source: string) => {
  const regex = /^## (.*)/gm;
  const matches = [];
  let match;

  while ((match = regex.exec(source))) {
    matches.push(match[1]);
  }

  return matches;
};

const MarkdownDemo = () => {
  const document = useDomDocument();
  const items = getSecondHeadings(markdown).map((heading) => ({
    title: heading,
    path: `#${heading.toLowerCase().replace(/\s/g, '-')}`,
  }));

  const handleClick = (path: string) => {
    if (!document) return;
    const element = document.querySelector(path);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageLayout>
      <PageContent>
        <div className="px-20 pt-6 pb-12 bg-background">
          <MarkdownContent source={markdown} />
        </div>
      </PageContent>
      <PageSecondaryNav
        title="On this page"
        items={items}
        onItemClick={handleClick}
      />
    </PageLayout>
  );
};

export default MarkdownDemo;
