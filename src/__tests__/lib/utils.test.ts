import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500')

    expect(result).toBe('text-red-500 bg-blue-500')
  })

  it('handles conflicting Tailwind classes', () => {
    const result = cn('text-red-500', 'text-blue-500')

    // twMerge should keep only the last conflicting class
    expect(result).toBe('text-blue-500')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const isDisabled = false

    const result = cn('base-class', isActive && 'active-class', isDisabled && 'disabled-class')

    expect(result).toBe('base-class active-class')
  })

  it('handles undefined and null values', () => {
    const result = cn('class1', undefined, null, 'class2')

    expect(result).toBe('class1 class2')
  })

  it('handles empty strings', () => {
    const result = cn('class1', '', 'class2')

    expect(result).toBe('class1 class2')
  })

  it('handles array of classes', () => {
    const result = cn(['class1', 'class2'], 'class3')

    expect(result).toBe('class1 class2 class3')
  })

  it('handles object syntax', () => {
    const result = cn({
      'active-class': true,
      'disabled-class': false,
      'hover-class': true,
    })

    expect(result).toContain('active-class')
    expect(result).toContain('hover-class')
    expect(result).not.toContain('disabled-class')
  })

  it('merges padding classes correctly', () => {
    const result = cn('p-4', 'p-6')

    expect(result).toBe('p-6')
  })

  it('merges margin classes correctly', () => {
    const result = cn('m-2', 'mx-4', 'my-6')

    // mx-4 and my-6 are more specific than m-2
    expect(result).toContain('mx-4')
    expect(result).toContain('my-6')
  })

  it('handles complex responsive classes', () => {
    const result = cn('text-sm md:text-base lg:text-lg', 'text-red-500')

    expect(result).toContain('text-sm')
    expect(result).toContain('md:text-base')
    expect(result).toContain('lg:text-lg')
    expect(result).toContain('text-red-500')
  })
})
