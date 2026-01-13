import { getImcClassification } from '@/lib/types'

describe('getImcClassification', () => {
  it('returns "No calculado" for null IMC', () => {
    const result = getImcClassification(null)
    
    expect(result.label).toBe('No calculado')
    expect(result.color).toBe('text-muted-foreground')
  })

  it('returns "Bajo peso" for IMC < 18.5', () => {
    const result = getImcClassification(17.5)
    
    expect(result.label).toBe('Bajo peso')
    expect(result.color).toBe('text-blue-500')
  })

  it('returns "Normal" for IMC between 18.5 and 24.9', () => {
    const result1 = getImcClassification(18.5)
    const result2 = getImcClassification(22)
    const result3 = getImcClassification(24.9)
    
    expect(result1.label).toBe('Normal')
    expect(result2.label).toBe('Normal')
    expect(result3.label).toBe('Normal')
    expect(result1.color).toBe('text-green-500')
  })

  it('returns "Sobrepeso" for IMC between 25 and 29.9', () => {
    const result1 = getImcClassification(25)
    const result2 = getImcClassification(27.5)
    const result3 = getImcClassification(29.9)
    
    expect(result1.label).toBe('Sobrepeso')
    expect(result2.label).toBe('Sobrepeso')
    expect(result3.label).toBe('Sobrepeso')
    expect(result1.color).toBe('text-yellow-500')
  })

  it('returns "Obesidad I" for IMC between 30 and 34.9', () => {
    const result1 = getImcClassification(30)
    const result2 = getImcClassification(32)
    const result3 = getImcClassification(34.9)
    
    expect(result1.label).toBe('Obesidad I')
    expect(result2.label).toBe('Obesidad I')
    expect(result3.label).toBe('Obesidad I')
    expect(result1.color).toBe('text-orange-500')
  })

  it('returns "Obesidad II" for IMC between 35 and 39.9', () => {
    const result1 = getImcClassification(35)
    const result2 = getImcClassification(37)
    const result3 = getImcClassification(39.9)
    
    expect(result1.label).toBe('Obesidad II')
    expect(result2.label).toBe('Obesidad II')
    expect(result3.label).toBe('Obesidad II')
    expect(result1.color).toBe('text-red-500')
  })

  it('returns "Obesidad III" for IMC >= 40', () => {
    const result1 = getImcClassification(40)
    const result2 = getImcClassification(45)
    const result3 = getImcClassification(50)
    
    expect(result1.label).toBe('Obesidad III')
    expect(result2.label).toBe('Obesidad III')
    expect(result3.label).toBe('Obesidad III')
    expect(result1.color).toBe('text-red-700')
  })

  it('handles edge case at boundary values', () => {
    expect(getImcClassification(18.4).label).toBe('Bajo peso')
    expect(getImcClassification(18.5).label).toBe('Normal')
    expect(getImcClassification(24.9).label).toBe('Normal')
    expect(getImcClassification(25).label).toBe('Sobrepeso')
    expect(getImcClassification(29.9).label).toBe('Sobrepeso')
    expect(getImcClassification(30).label).toBe('Obesidad I')
    expect(getImcClassification(34.9).label).toBe('Obesidad I')
    expect(getImcClassification(35).label).toBe('Obesidad II')
    expect(getImcClassification(39.9).label).toBe('Obesidad II')
    expect(getImcClassification(40).label).toBe('Obesidad III')
  })
})
