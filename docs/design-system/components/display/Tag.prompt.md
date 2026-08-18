Flavor chip for topics/metadata; pass an event-flavor token as `flavor`, add `onRemove` for a ✕.

```jsx
<Tag flavor="var(--lime)">AI tools</Tag>
<Tag onRemove={()=>drop(t)}>Design</Tag>
```
