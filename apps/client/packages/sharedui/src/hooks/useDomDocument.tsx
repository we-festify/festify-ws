import { useEffect, useState } from 'react';

export function useDomDocument() {
  const [document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDocument(window.document);
    } else {
      setDocument(null);
    }
  }, []);

  return document;
}
