import React from 'react';

/**
 * Renders a safely escaped JSON-LD script tag.
 * @param {{ schema: Object }} props
 */
export function JsonLd({ schema }) {
  if (!schema) return null;

  // Safe JSON serialization escaping HTML characters
  const jsonString = JSON.stringify(schema, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}

export default JsonLd;
