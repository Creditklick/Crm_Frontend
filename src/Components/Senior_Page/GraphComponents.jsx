const GraphComponent = ({ data }) => {
    const getBarColor = (status) => {
      switch(status) {
        case 'Partially': return '#f59e0b'; // Amber
        case 'Settlement Amount': return '#10b981'; // Emerald
        default: return '#3b82f6'; // Blue
      }
    };
  
    return data.map((item, index) => {
      const height = Number(item.amount) * 0.1;
      const xPos = index * 2.5 - (data.length * 2.5) / 2;
      
      return (
        <group key={index}>
          <mesh
            position={[xPos, height / 2, 0]}
            scale={[1, height, 1]}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
              color={getBarColor(item.status)}
              metalness={0.3}
              roughness={0.2}
            />
          </mesh>
          
          <Html
            position={[xPos, -1, 0]}
            distanceFactor={8}
            center
          >
            <div className="bg-white px-2 py-1 rounded-md shadow-sm text-xs text-center">
              <p className="font-semibold">₹{item.amount}</p>
              <p className="text-gray-500">
                {new Date(item.date).toLocaleDateString('en-IN')}
              </p>
              <p className="text-xs mt-1">{item.status}</p>
            </div>
          </Html>
        </group>
      );
    })
  };

  export default GraphComponent