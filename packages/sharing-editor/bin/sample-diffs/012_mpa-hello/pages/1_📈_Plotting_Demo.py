14a15
> import asyncio
16d16
< import time
21c21
< def plotting_demo():
---
> async def plotting_demo():
33c33
<         time.sleep(0.05)
---
>         await asyncio.sleep(0.05)
52c52
< plotting_demo()
---
> await plotting_demo()
