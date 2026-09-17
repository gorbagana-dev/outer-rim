Uppercase tab strip — glowing acid underline for page sections, pill segmented control for view toggles.

```jsx
<Tabs value={tab} onChange={setTab} tabs={[{value:'tx',label:'Transactions',count:128},{value:'blocks',label:'Blocks'},{value:'validators',label:'Validators',icon:'server'}]} />
<Tabs variant="pill" size="sm" value={v} onChange={setV} tabs={[{value:'grid',label:'Grid'},{value:'list',label:'List'}]} />
```
