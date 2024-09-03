26,27c26,28
<         AWS_BUCKET_URL = "https://streamlit-demo-data.s3-us-west-2.amazonaws.com"
<         df = pd.read_csv(AWS_BUCKET_URL + "/agri.csv.gz")
---
>         # AWS_BUCKET_URL = "https://streamlit-demo-data.s3-us-west-2.amazonaws.com"
>         # df = pd.read_csv(AWS_BUCKET_URL + "/agri.csv.gz")
>         df = pd.read_csv("./agri.csv.gz")
