# Component Comparison Notes

## dialog.tsx (shadcn/ui) vs. my Modal.tsx

1. **Uses a library primitive, not plain React.** shadcn's dialog imports from `@base-ui/react/dialog` instead of building directly on raw React like I did. I built my focus-trap logic by hand; theirs relies on a tested library underneath.

2. **Uses "Portal."** The word "Portal" appears in their file, which I didn't use at all. I'm not fully certain what it does yet, but it's a real, concrete thing I noticed my version doesn't have — worth learning next.

3. **Noticeably longer than mine.** Their file is longer than my ~90-line Modal.tsx, suggesting it handles more cases or edge behavior than my version does.

## tabs.tsx (shadcn/ui) vs. my Tabs.tsx

1. **Also uses a library primitive.** Same pattern — `@base-ui/react/tabs` instead of plain React, same as their dialog.