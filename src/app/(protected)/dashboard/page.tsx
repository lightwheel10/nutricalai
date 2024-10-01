import dynamic from 'next/dynamic'

// Dynamically import the DashboardContent component
const DashboardContent = dynamic(() => import('./DashboardContent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
})

const DashboardPage = () => {
  return <DashboardContent />
}

export default DashboardPage
