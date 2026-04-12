// frontend/src/utils/loadRazorpay.js

/**
 * Dynamically loads the Razorpay checkout script.
 * We load it only when the customer reaches checkout
 * instead of loading it on every page — faster initial load.
 * 
 * Returns a Promise that resolves to true if loaded successfully,
 * false if the script failed to load (no internet, etc.)
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // If already loaded, resolve immediately
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}