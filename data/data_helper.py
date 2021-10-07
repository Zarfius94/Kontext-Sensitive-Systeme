import pandas as pd

from datetime import datetime

from influxdb_client import InfluxDBClient, Point, WritePrecision
#from influxdb_client.client.write_api import SYNCHRONOUS

from os import walk
from os.path import join

# Global variables for the save locations
csv_dir = "csv"
raw_data_dir = csv_dir + "/raw"
processed_data_dir = csv_dir + "/processed"

# Global variables of the aggregation functions
aggregation = ["min", "max", "mean", "median", "std", "var"]

def get_data_from_online_db():
    # Connect to the lecture db and download the data in a usable format then save the result to files.
    token = "d5oSFVlZ-7TuaJgq4XYosp-6E5Bh_6MsJAit7GbcshHdUh7mKy5v-pFGfH4DGg775t_FwpK7pTsKDItRiM9nJQ=="
    org = "css21"
    bucket = "css21"

    client = InfluxDBClient(url="https://css21.teco.edu", token=token, verify_ssl=False)
    query_api = client.query_api()


    query = f'from(bucket: \"{bucket}\") |> range(start: 2021-01-01) |> filter(fn: (r) => r["_measurement"] == "devicemotion") |> filter(fn: (r) => r["label"] == "sitting" or r["label"] == "standing" or r["label"] == "walking") |> pivot(rowKey: ["_start", "_stop", "_time", "_measurement", "label", "mobile"], columnKey: ["_field"], valueColumn: "_value")'
    
    df_list = query_api.query_data_frame(query, org = org)
    counter = 0
    for df in df_list:
        df.head()
        name = raw_data_dir + "/data" + str(counter) + ".csv"
        df.to_csv(name)
        counter += 1

def prepare_data(raw_dir = raw_data_dir):
    # Read the saved files and select the used features then return the list of single recordings with it's label.
    data = []
    for _,_,filenames in walk(raw_data_dir):
        for fname in filenames:
            fpath = join(raw_dir, fname)
            df = pd.read_csv(fpath, index_col=0, parse_dates=[3,4,5])
            # Different recording sessions are detected with the table column
            tables = df["table"].unique()
            for t in tables:
                sub_df = df[df["table"] == t]
                label = sub_df["label"].iloc[0]
                d = sub_df[["_time", "alpha", "beta", "gamma", "x", "y", "z"]]
                data.append((label, d))
    return data

def aggregate(data, agg = aggregation):
    # Aggregate the data into 1s windows then return one DataFrame with features, label and an id (subject) to differentiate between recordings
    frames = []
    counter = 0
    for l, df in data:
        # Windowing in 1s steps, after grouping time isn't needed anymore, only the order ist needed
        adf = df.groupby(pd.Grouper(freq="1s", key="_time")).aggregate(agg).dropna()
        # 2d column names are hard to read -> combining the dimensions
        adf.columns = [col[0] + "_" + col[1] for col in adf.columns]
        adf["label"] = l
        adf["subject"] = counter
        counter += 1
        frames.append(adf)
    ret = pd.concat(frames, ignore_index=True)
    # ret.to_csv(join(processed_data_dir,"result.csv"))
    return ret