import { render } from '@testing-library/react'
import { AmbientLight } from '../AmbientLight'
import { describe, it, expect } from 'vitest'

describe('AmbientLight', () => {
  it('renders without crashing for all themes', () => {
    const themes = ['chatgpt','gemini','claude','grok','perplexity','lmarena','deepseek','qwen'] as const
    themes.forEach(theme => {
      const { container } = render(<AmbientLight theme={theme} />)
      expect(container.firstChild).toBeTruthy()
    })
  })

  it('renders monochrome correctly', () => {
    const { container } = render(<AmbientLight theme="chatgpt" monochrome />)
    expect(container.firstChild).toBeTruthy()
  })
})
