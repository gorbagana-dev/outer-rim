Transient notification card; stack bottom-right at z-toast, 360px wide.

```jsx
<Toast title="Transaction confirmed" description="Block 4,444,201 · 0.0002 $GOR" onDismiss={...} action={<Button variant="ghost" size="sm" iconRight="external-link">View</Button>} />
<Toast tone="danger" title="Dumped" description="Slippage exceeded. The chain is trash, your tx shouldn't be." />
```
