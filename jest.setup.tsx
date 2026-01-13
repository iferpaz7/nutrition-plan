import '@testing-library/jest-dom'

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url')
global.URL.revokeObjectURL = jest.fn()

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}))

// Mock html2canvas
jest.mock('html2canvas', () => jest.fn(() => Promise.resolve({
  toBlob: jest.fn((callback) => callback(new Blob(['test'], { type: 'image/png' }))),
})))

// Mock jspdf
jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    internal: {
      pageSize: { getWidth: () => 297, getHeight: () => 210 },
    },
    setFontSize: jest.fn(),
    setTextColor: jest.fn(),
    text: jest.fn(),
    save: jest.fn(),
  }))
})

jest.mock('jspdf-autotable', () => jest.fn())

// Mock xlsx
jest.mock('xlsx', () => ({
  utils: {
    book_new: jest.fn(() => ({})),
    aoa_to_sheet: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}))

// Suppress console errors in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const message = args[0]
    // Suppress known jsdom navigation errors and React deprecation warnings
    if (
      (typeof message === 'string' && 
        (message.includes('Warning: ReactDOM.render is no longer supported') ||
         message.includes('Not implemented: navigation'))) ||
      (message instanceof Error && 
        message.message.includes('Not implemented: navigation'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
