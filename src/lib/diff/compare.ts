export function compareContent(oldContent: string, newContent: string) {
  if (oldContent === newContent) {
    return { hasChanged: false };
  }

  // This is a naive textual diff placeholder
  // In a full production scenario, you would integrate a library like 'diff' or 'diff-match-patch'
  return {
    hasChanged: true,
    changeType: "modified",
    summary: "Content changed",
    diffData: { oldLength: oldContent.length, newLength: newContent.length },
  };
}
