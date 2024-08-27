6c6
< import time
---
> import asyncio
27,28c27,28
< def show_daily_sales(data):
<     time.sleep(1)
---
> async def show_daily_sales(data):
>     await asyncio.sleep(1)
61,62c61,62
< def show_monthly_sales(data):
<     time.sleep(1)
---
> async def show_monthly_sales(data):
>     await asyncio.sleep(1)
85c85
<     show_daily_sales(data)
---
>     await show_daily_sales(data)
87c87
<     show_monthly_sales(data)
\ No newline at end of file
---
>     await show_monthly_sales(data)
