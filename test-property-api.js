// Test script to verify property API is accessible
async function testPropertyAPI() {
  try {
    console.log("Testing Property API...");
    
    const response = await fetch('http://localhost:3003/api/public/properties', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      return;
    }

    const data = await response.json();
    console.log("✅ Property API is working!");
    console.log("Properties found:", data.properties?.length || 0);
    
    if (data.properties && data.properties.length > 0) {
      console.log("Sample property:", {
        name: data.properties[0].property_name,
        city: data.properties[0].address?.city,
        rooms: data.properties[0].rooms?.length || 0
      });
    }
    
  } catch (error) {
    console.error("❌ Error testing Property API:", error);
    console.log("Make sure your property service is running on port 3001");
  }
}

testPropertyAPI();
