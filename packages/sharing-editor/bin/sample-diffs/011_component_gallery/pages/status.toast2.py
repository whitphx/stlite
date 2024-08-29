2c2
< import time
---
> import asyncio
5c5
< def cook_breakfast():
---
> async def cook_breakfast():
7c7
<     time.sleep(1)
---
>     await asyncio.sleep(1)
9c9
<     time.sleep(1)
---
>     await asyncio.sleep(1)
14c14
<     cook_breakfast()
---
>     await cook_breakfast()
