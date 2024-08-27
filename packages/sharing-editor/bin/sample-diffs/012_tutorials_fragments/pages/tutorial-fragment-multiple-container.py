2c2
< import time
---
> import asyncio
13,14c13,14
< def black_cats():
<     time.sleep(1)
---
> async def black_cats():
>     await asyncio.sleep(1)
19,20c19,20
< def orange_cats():
<     time.sleep(1)
---
> async def orange_cats():
>     await asyncio.sleep(1)
26c26
< def herd_black_cats(card_a, card_b, card_c):
---
> async def herd_black_cats(card_a, card_b, card_c):
32c32
<         black_cats()
---
>         await black_cats()
34c34
<         black_cats()
---
>         await black_cats()
36c36
<         black_cats()
---
>         await black_cats()
40c40
< def herd_orange_cats(card_a, card_b, card_c):
---
> async def herd_orange_cats(card_a, card_b, card_c):
46c46
<         orange_cats()
---
>         await orange_cats()
48c48
<         orange_cats()
---
>         await orange_cats()
50c50
<         orange_cats()
---
>         await orange_cats()
54,56c54,56
<     herd_black_cats(grid[0].empty(), grid[2].empty(), grid[4].empty())
<     herd_orange_cats(grid[1].empty(), grid[3].empty(), grid[5].empty())
<     st.button("Herd all the cats")
\ No newline at end of file
---
>     await herd_black_cats(grid[0].empty(), grid[2].empty(), grid[4].empty())
>     await herd_orange_cats(grid[1].empty(), grid[3].empty(), grid[5].empty())
>     st.button("Herd all the cats")
