// frontend/src/components/ErrorMessage.jsx

export default function ErrorMessage({ message = 'Something went wrong.' }) {
  const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0v.75m0 0a.75.75 0 10-1.5 0.75V12a.75.75 0 001.5-.75v-.75z" />
    </svg>
  )

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-lg text-sm flex items-start gap-3">
      <AlertIcon />
      <span>{message}</span>
    </div>
  )
}