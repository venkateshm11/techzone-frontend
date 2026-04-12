// frontend/src/components/ErrorBoundary.jsx

import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center
          justify-center px-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c.865.865 2.291 1.375 3.803 1.375H15a4.5 4.5 0 001.38-.23l2.414 2.414c.536.536 1.362.534 1.896 0l7.071-7.071c.534-.534.536-1.362 0-1.896L10.854 2.854c-.534-.536-1.362-.534-1.896 0L1.086 10.927c-.536.534-.534 1.362 0 1.896z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Please refresh the page or go back to the homepage.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white font-semibold px-6 py-2.5
                rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}