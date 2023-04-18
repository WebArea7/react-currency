import {useState} from "react";

export default function Form({onSubmitForm}) {
  const [amount, setAmount] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if(!amount) return
    onSubmitForm(amount)
    setAmount('')
  }

  return (
    <form className="max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md"
      onSubmit={e => handleSubmit(e)}
    >
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
          Amount to convert (USD to EUR)
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="number"
          placeholder="Enter your amount in USD"
          onChange={(e) => {
            const value = parseFloat(e.target.value)
            if (value >= 0 || e.target.value === '') {
              setAmount(value)
            }
          }}
          value={amount}
        />
      </div>
      <div className="flex items-center justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit">
          Convert to EUR
        </button>
      </div>
    </form>
  )
}