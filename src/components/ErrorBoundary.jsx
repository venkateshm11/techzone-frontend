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
            <p className="text-5xl mb-4">⚠️</p>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              Please refresh the page or go back to the homepage.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white font-semibold px-6 py-3
                rounded-xl hover:bg-blue-700 transition-colors"
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