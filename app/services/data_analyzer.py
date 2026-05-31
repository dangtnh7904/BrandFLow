import pandas as pd
import io
import json

class DataAnalyzer:
    """
    Dedicated Data Analysis Agent.
    Bypasses LLM math hallucination by strictly using Pandas to process CSV/Excel data.
    """
    
    @staticmethod
    def process_csv(csv_content: str) -> str:
        """
        Parses raw CSV content, extracts key statistical data, and returns JSON.
        This JSON can then be sent to the LLM for summarization without the LLM doing the math.
        """
        try:
            df = pd.read_csv(io.StringIO(csv_content))
            return DataAnalyzer._generate_insights(df)
        except Exception as e:
            return json.dumps({"error": f"Failed to parse CSV: {str(e)}"})

    @staticmethod
    def _generate_insights(df: pd.DataFrame) -> str:
        insights = {}
        
        # Total rows & cols
        insights["total_records"] = int(len(df))
        insights["columns"] = list(df.columns)
        
        # Separate numeric and categorical
        numeric_cols = df.select_dtypes(include=['number']).columns
        categorical_cols = df.select_dtypes(include=['object', 'category']).columns
        
        # Numeric insights (Sum, Mean, Max, Min)
        num_stats = {}
        for col in numeric_cols:
            num_stats[col] = {
                "mean": float(df[col].mean()) if not pd.isna(df[col].mean()) else 0,
                "max": float(df[col].max()) if not pd.isna(df[col].max()) else 0,
                "min": float(df[col].min()) if not pd.isna(df[col].min()) else 0,
                "sum": float(df[col].sum()) if not pd.isna(df[col].sum()) else 0
            }
        insights["numeric_statistics"] = num_stats
        
        # Categorical insights (Value counts for top 5)
        cat_stats = {}
        for col in categorical_cols:
            val_counts = df[col].value_counts().head(5).to_dict()
            cat_stats[col] = {str(k): int(v) for k, v in val_counts.items()}
            
        insights["categorical_distribution"] = cat_stats
        
        return json.dumps(insights, ensure_ascii=False)
