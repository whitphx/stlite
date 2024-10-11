4c4
< def intro():
---
> async def intro():
34c34
< def mapping_demo():
---
> async def mapping_demo():
132,133c132,133
< def plotting_demo():
<     import time
---
> async def plotting_demo():
>     import asyncio
158c158
<         time.sleep(0.05)
---
>         await asyncio.sleep(0.05)
168c168
< def data_frame_demo():
---
> async def data_frame_demo():
186,187c186,188
<         AWS_BUCKET_URL = "https://streamlit-demo-data.s3-us-west-2.amazonaws.com"
<         df = pd.read_csv(AWS_BUCKET_URL + "/agri.csv.gz")
---
>         # AWS_BUCKET_URL = "http://streamlit-demo-data.s3-us-west-2.amazonaws.com"
>         # df = pd.read_csv(AWS_BUCKET_URL + "/agri.csv.gz")
>         df = pd.read_csv("./agri.csv.gz")
235c236
< page_names_to_funcs[demo_name]()
---
> await page_names_to_funcs[demo_name]()
