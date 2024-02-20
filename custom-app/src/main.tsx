import './main.css'

import ReactDOM from 'react-dom'

import React from 'react'

import Header from './components/Header'
import Footer from './components/footer'

function render() {
  ReactDOM.render(
    React.createElement(Header),
    document.getElementById('fern-header'),
  )
  ReactDOM.render(
    React.createElement(Footer),
    document.getElementById('fern-footer'),
  )
}

let observations = 0
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded')
  render()
  new MutationObserver((e, o) => {
    render()
    for (const item of e) {
      if (item.target instanceof HTMLElement) {
        const target = item.target
        if (target.id === 'fern-header' || target.id === 'fern-footer') {
          if (observations < 3) {
            // react hydration will trigger a mutation event
            observations++
          } else {
            o.disconnect()
          }
          break
        }
      }
    }
  }).observe(document.body, { childList: true, subtree: true })
})
