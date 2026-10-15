import pandas as pd

# Where this writer runs, pandas has no pyarrow, so its string dtypes are backed
# by Python objects. With pyarrow installed for these tests, pandas would
# otherwise back them with pyarrow arrays, which pyarrow converts differently
# (as large_string). This is set at import time, not in a fixture, because the
# test modules build their DataFrames' columns and indexes when imported.
pd.set_option("mode.string_storage", "python")
