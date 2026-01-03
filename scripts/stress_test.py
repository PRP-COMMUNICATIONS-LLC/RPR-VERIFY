import asyncio
import aiohttp
import time
import json

# Authoritative Singapore Endpoint
ENDPOINT = "https://asia-southeast1-rpr-verify-b.cloudfunctions.net/cisReportApi"
TOTAL_REQUESTS = 100
CONCURRENT_REQUESTS = 20  # Measured burst for 2026 regional benchmarks

async def send_request(session, request_id):
    payload = {
        "case_id": f"VERIFY-STRESS-{request_id:03d}",
        "document_image": "BASE64_STUB_DATA",
        "forensic_audit": True
    }
    
    start_time = time.perf_counter()
    try:
        async with session.post(ENDPOINT, json=payload, timeout=30) as response:
            latency = (time.perf_counter() - start_time) * 1000
            data = await response.json()
            
            # Accuracy Checks (Veritas Compliance)
            is_accurate = data.get("case_id") == payload["case_id"]
            is_resident = data.get("forensic_metadata", {}).get("region") == "asia-southeast1"
            
            return {
                "status": response.status,
                "latency": latency,
                "accurate": is_accurate,
                "resident": is_resident
            }
    except Exception as e:
        return {"error": str(e)}

async def main():
    print(f"🚀 Launching Stress Test against Singapore Node (asia-southeast1)...")
    semaphore = asyncio.Semaphore(CONCURRENT_REQUESTS)
    
    async with aiohttp.ClientSession() as session:
        async def sem_task(i):
            async with semaphore:
                return await send_request(session, i)
        
        tasks = [sem_task(i) for i in range(TOTAL_REQUESTS)]
        results = await asyncio.gather(*tasks)

    # Metric Aggregation
    latencies = sorted([r["latency"] for r in results if "latency" in r])
    successes = [r for r in results if r.get("status") == 200]
    accuracy = (sum(1 for r in successes if r["accurate"]) / len(successes)) * 100 if successes else 0
    
    p99_latency = latencies[int(len(latencies) * 0.99)] if latencies else 0
    
    print(f"\n--- 📊 Singapore Node Performance Metrics ---")
    print(f"Total Requests: {TOTAL_REQUESTS} | Successes: {len(successes)}")
    print(f"Avg Latency:    {sum(latencies)/len(latencies):.2f}ms")
    print(f"P99 Latency:    {p99_latency:.2f}ms")
    print(f"Accuracy Rate:  {accuracy:.2f}% (Case ID Echo)")
    print(f"Residency Lock: {'✅ PASSED' if all(r['resident'] for r in successes) else '❌ FAILED'}")

if __name__ == "__main__":
    asyncio.run(main())
