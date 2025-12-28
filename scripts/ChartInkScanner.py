import os
import warnings
import sys
import pandas as pd
warnings.filterwarnings("ignore")

try:
    import xlwings as xw
except (ModuleNotFoundError, ImportError):
    print("xlwings module not found")
    os.system(f"{sys.executable} -m pip install -U xlwings")
finally:
    import xlwings as xw

try:
    import requests
except (ModuleNotFoundError, ImportError):
    print("requests module not found")
    os.system(f"{sys.executable} -m pip install -U requests")
finally:
    import requests

try:
    from bs4 import BeautifulSoup
except (ModuleNotFoundError, ImportError):
    print("BeautifulSoup module not found")
    os.system(f"{sys.executable} -m pip install -U beautifulsoup4")
finally:
    from bs4 import BeautifulSoup


chartink_link = "https://chartink.com/screener/"
chartink_screener_url = "https://chartink.com/screener/process"
chartink_widget_url = "https://chartink.com/widget/process"

def GetDataFromChartinkScanner(payload):
    payload = {'scan_clause': payload}

    with requests.session() as s:
        r = s.get(chartink_link)
        soup = BeautifulSoup(r.text, "html.parser")
        csrf = soup.select_one("[name='csrf-token']")['content']
        s.headers['x-csrf-token'] = csrf
        r = s.post(chartink_screener_url, data=payload)

        df = []

        for item in r.json()['data']:
            if len(item) > 0:
                df.append(item['nsecode'])#.concat([df, pd.DataFrame.from_dict(item, orient='index').T], ignore_index = True)

    #print(df)
    return df 


def GetDataFromChartinkWidget(payload):
    payload = {'query': payload}

    with requests.session() as s:
        r= s.get(chartink_link)
        soup = BeautifulSoup(r.text, "html.parser")
        csrf = soup.select_one("[name='csrf-token']")['content']
        s.headers['x-csrf-token'] = csrf
        r = s.post(chartink_widget_url, data=payload)

        df = []

        print(r.json())

