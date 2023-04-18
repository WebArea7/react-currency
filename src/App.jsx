import './App.css'
import {useState, useEffect} from "react";
import Form from './Form'
import axios from "axios";

function App() {
  const API_URL = 'https://api.frankfurter.app/latest';
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState('')
  const [date, setDate] = useState('')
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('history')
    if (saved === null) return []

    return JSON.parse(saved)
  })

  useEffect(() => {
    if(!result) return
    const index = history.findIndex(item => item.amount === amount)
    if(index !== -1) return
    const newHistory = [{amount, result, date}, ...history]
    if(newHistory.length > 5) newHistory.pop()
    setHistory(newHistory)
    localStorage.setItem('history', JSON.stringify(newHistory))
  }, [result]);

  const handleAmountChange = async (value) => {
    setLoading(true)
    setError(null)
    try {
      const { result, date } = await convertCurrency(value);
      setResult(result)
      setDate(date)
    } catch (error) {
      setError(error)
      setResult('')
      setDate('')
    }
    setAmount(value)
    setLoading(false)
  }

  async function convertCurrency(amount) {
    try {
      const response = await axios.get(`${API_URL}?from=USD&to=EUR&amount=${amount}`);
      const { date, rates } = response.data;
      const dateObj = new Date(date)
      const dateStr = dateObj.toLocaleDateString()
      const { EUR } = rates;
      return { result: EUR, date: dateStr };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return (
    <div className="currency-app">
      <h1 className="text-4xl text-center font-bold mb-7">Currency Converter</h1>
      <Form onSubmitForm={handleAmountChange} />

      {loading && <p className="mt-7 text-center">Loading...</p>}
      {error && <p className="mt-7 text-center">Error: {error.message}</p>}

      {result && !loading &&
        <div className="text-center mt-7">
          <p><b>{amount}</b> USD = <b>{result}</b> EUR</p>
        </div>
      }

      {date && !loading &&
        <p className="text-center text-xs text-gray-600">Date updated: {date}</p>
      }

      {history.length > 0 &&
        <div className="mt-7 px-7">
          <h2 className="text-xl font-bold mb-3">History</h2>
          {history.map((item, index) => (
            <div key={index}>
              <b>{item.amount}</b> USD = <b>{item.result}</b> EUR
              <span className="text-xs text-gray-600 ml-2">({item.date})</span>
            </div>
          ))}
        </div>
      }

    </div>
  )
}

export default App
