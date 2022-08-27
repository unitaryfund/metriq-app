import './App.css'
import MainRouter from './MainRouter'
import SimpleReactFooter from './components/simple-react-footer/SimpleReactFooter'

const App = () =>
  <div className='App'>
    <MainRouter id='metriq-main-content' />
    <SimpleReactFooter
      title='metriq'
      description='Quantum computing benchmarks by community contributors'
      copyright='2021, 2022 Unitary Fund'
      discord='unitary.fund'
      github='unitaryfund'
      twitch='unitaryfund'
      twitter='unitaryfund'
      youtube='UCDbDLAzGRTHnhkoMMOX7D1A'
      linkedin='unitary-fund'
      backgroundColor='#212529'
      fontColor='#FFFFFF'
      iconColor='#FFFFFF'
      columns={[]}
    />
  </div>

export default App
