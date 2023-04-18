import './App.css'
import {useState} from "react";
import Form from './Form'
import axios from "axios";

function App() {
  const API_URL = 'https://api.frankfurter.app/latest';
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState('')
  const [date, setDate] = useState('')

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

    </div>
  )
}

export default App
