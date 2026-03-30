import { useState, useEffect } from 'react'

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('checking...')

  useEffect(() => {
    fetch('http://localhost:3000/api/health')
      .then(res => res.json())
      .then(data => setBackendStatus(data.status))
      .catch(() => setBackendStatus('error connecting to backend'))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Resolution App</h1>
        <p className="text-gray-600 mb-6">System Zgłoszeń Problemów z Dostawami</p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
            <span className="font-semibold text-blue-700">Frontend:</span>
            <span className="text-green-600 font-medium">Ready (Vite + React)</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-indigo-50 rounded">
            <span className="font-semibold text-indigo-700">Backend Status:</span>
            <span className={backendStatus === 'ok' ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
              {backendStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
