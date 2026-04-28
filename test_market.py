import asyncio
from dotenv import load_dotenv
load_dotenv()
from app.agents.research.market_agent import MarketAgent

async def main():
    agent = MarketAgent()
    print(await agent.run_research("tech"))

asyncio.run(main())
