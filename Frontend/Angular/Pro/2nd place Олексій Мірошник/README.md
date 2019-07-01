# Run
`npm i`
`npm start`

# Directives (You can see example in app.component.html)

`appMatCardLazyListScrollUp` - Required to be set - adds button you your list.
``` 
<button mat-raised-button color="primary" *appMatCardLazyListScrollUp>Click</button>
```

`appMatCardsLazyListItem` - Required to be set on list item - adds element to list.
```
<mat-card *appMatCardsLazyListItem class="example-card">
...
</mat-cart
```
