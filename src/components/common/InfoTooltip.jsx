import { useState, useRef } from 'react'
import ReactDOM from 'react-dom'

export default function InfoTooltip({ text }) {
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)

  const updatePos = () => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    setPos({ top: rect.top + rect.height / 2, left: rect.right + 8 })
  }

  return (
    <span className="inline-flex ml-1">
      <button
        ref={btnRef}
        type="button"
        className="w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 text-[10px] font-bold leading-none flex items-center justify-center"
        onMouseEnter={() => { updatePos(); setShow(true) }}
        onMouseLeave={() => setShow(false)}
        onClick={(e) => { e.preventDefault(); updatePos(); setShow((s) => !s) }}
      >
        i
      </button>
      {show && ReactDOM.createPortal(
        <div
          className="fixed z-[9999] w-52 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg"
          style={{ top: pos.top, left: pos.left, transform: 'translateY(-50%)' }}
        >
          {text}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
        </div>,
        document.body
      )}
    </span>
  )
}
