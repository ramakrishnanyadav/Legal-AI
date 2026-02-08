#!/usr/bin/env python3
"""Test the live backend API to verify premium features"""

import requests
import json

# Your backend URL
API_URL = "https://legal-ai-roc4.onrender.com/api/analyze-case"

print("\n" + "="*60)
print("🧪 TESTING LIVE BACKEND - PREMIUM FEATURES")
print("="*60)

# Test with authenticated user
test_payload = {
    "description": "Someone broke into my house and stole my laptop and jewelry worth 50000 rupees",
    "role": "victim",
    "urgency": False,
    "user_id": "test_user_authenticated",
    "is_authenticated": True
}

print(f"\n📤 Sending test request...")
print(f"Payload: {json.dumps(test_payload, indent=2)}")

try:
    response = requests.post(API_URL, json=test_payload, timeout=120)
    
    print(f"\n📥 Response Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        
        print(f"\n✅ API is working!")
        print(f"\nResponse keys: {list(result.keys())}")
        
        # Check for premium features
        has_action_plan = 'actionPlan' in result and result['actionPlan'] is not None
        has_documents = 'documents' in result and result['documents'] is not None
        
        print(f"\n🎯 PREMIUM FEATURES CHECK:")
        print(f"  actionPlan: {'✅ YES' if has_action_plan else '❌ NO'}")
        print(f"  documents: {'✅ YES' if has_documents else '❌ NO'}")
        
        if has_action_plan:
            print(f"\n✨ Action Plan Keys: {list(result['actionPlan'].keys())}")
        
        if has_documents:
            print(f"✨ Documents Keys: {list(result['documents'].keys())}")
            
        if not has_action_plan or not has_documents:
            print(f"\n❌ BACKEND IS NOT GENERATING PREMIUM FEATURES!")
            print(f"This is a backend issue, not frontend.")
        else:
            print(f"\n✅ BACKEND IS WORKING CORRECTLY!")
            print(f"The issue must be in the frontend.")
            
    else:
        print(f"\n❌ API Error: {response.status_code}")
        print(f"Response: {response.text[:500]}")
        
except requests.exceptions.Timeout:
    print("\n⏱️  Request timed out (backend might be cold starting)")
    print("This is normal for free-tier Render. Try again in a moment.")
except Exception as e:
    print(f"\n❌ Error: {e}")

print("\n" + "="*60)
