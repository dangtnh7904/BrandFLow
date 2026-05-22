import pandas as pd
import sys
import json

def extract_excel():
    df = pd.read_excel('docs/khảo sát định lượng.xlsx')
    columns = list(df.columns)
    
    # Let's dump some sample data
    sample_data = df.head(10).to_dict('records')
    
    with open('scratch/excel_output.json', 'w', encoding='utf-8') as f:
        json.dump({'columns': columns, 'sample': sample_data}, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    extract_excel()
