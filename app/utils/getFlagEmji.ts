export const getFlagEmoji = (countryCode: string) => {
  console.log(countryCode)
  if (!/^[A-Za-z]{2}$/.test(countryCode)) {
    return '🏳️' // Return white flag for invalid codes.
  }
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export const regionNames = new Intl.DisplayNames(['kr'], {type: 'region'})
