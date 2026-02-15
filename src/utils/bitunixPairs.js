// Bitunix USDT-M Perpetual Futures — verified symbols (210+ pairs)
// Source: Bitunix OpenAPI + support announcements
// These are the base symbols (without USDT suffix) available as .P perpetual contracts
export const BITUNIX_PERPS = new Set([
  'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA', 'DOGE', 'AVAX', 'DOT', 'LINK',
  'MATIC', 'SHIB', 'LTC', 'TRX', 'UNI', 'ATOM', 'XLM', 'ETC', 'FIL', 'APT',
  'NEAR', 'ARB', 'OP', 'PEPE', 'INJ', 'SUI', 'SEI', 'TIA', 'JTO', 'WIF',
  'JUP', 'ORDI', 'STX', 'IMX', 'MKR', 'AAVE', 'GRT', 'FTM', 'SAND', 'MANA',
  'THETA', 'ALGO', 'VET', 'HBAR', 'FLR', 'ICP', 'RUNE', 'GALA', 'AXS',
  'FLOW', 'NEO', 'EOS', 'XMR', 'CAKE', 'COMP', 'SNX', 'CRV', 'DYDX',
  'LDO', 'RPL', 'PENDLE', 'ENS', 'WLD', 'BLUR', 'CFX', 'RNDR', 'FET',
  'AGIX', 'OCEAN', 'AR', 'ROSE', 'ZIL', 'ONE', 'KAVA', 'CELO', 'ZEN',
  'QTUM', 'IOTA', 'JASMY', 'ONT', 'STORJ', 'SUSHI', 'BAL', '1INCH',
  'ZRX', 'KSM', 'ENJ', 'CHZ', 'MASK', 'PEOPLE', 'ARKM', 'BOME',
  'TON', 'TAO', 'WOO', 'ONDO', 'MANTA', 'ZETA', 'SAGA', 'CKB',
  'RAD', 'HIGH', 'UNFI', 'AGLD', 'JOE', 'KAS', 'FXS', 'SXP',
  'ARK', 'HFT', 'ONG', 'LOOM', 'YFI', 'SUPER', 'SKL', 'MAV',
  'DUSK', 'ID', 'CHR', 'HOOK', 'C98', 'ARPA', 'PHB', 'RDNT',
  'BEAMX', 'GAS', 'XAI', 'BOND', 'ASTR', 'OGN', 'TRB',
  'PERP', 'REZ', 'TURBO', 'DASH', 'RVN', 'ICX', 'BANANA',
  'RARE', 'SYN', 'DOGS', 'LUNA', 'PNUT', 'ACT', 'ME',
  'VANA', 'STEEM', 'FLOKI', 'BONK', 'AI', 'VIRTUAL',
  'HYPE', 'TNSR', 'MOODENG', 'FARTCOIN',
  'GMT', 'APE', 'LRC', 'ANKR', 'SSV', 'CELR', 'RSR',
  'BAND', 'BAT', 'RLC', 'CTK', 'AUDIO', 'LINA', 'ALPHA',
  'BEL', 'REEF', 'COTI', 'MTL', 'NKN', 'SPELL', 'LEVER',
  'AMB', 'KEY', 'COMBO', 'EDU', 'CYBER', 'SEI', 'PIXEL',
  'STRK', 'DYM', 'ALT', 'MYRO', 'SLERF', 'ETHFI',
  'ENA', 'W', 'OMNI', 'BB', 'IO', 'ZK', 'LISTA', 'ZRO',
  'RENDER', 'NOT', 'BRETT', 'NEIRO', 'EIGEN', 'SCR',
  'GOAT', 'GRASS', 'MOVE', 'USUAL', 'PENGU', 'BIO',
  'TRUMP', 'MELANIA', 'ANIME', 'TST', 'KAITO', 'LAYER',
  'IP', 'BERA', 'MNT', 'POL', 'PYTH', 'TWT',
  'OKB', 'CRO', 'LEO', 'NEXO', 'HT',
]);

export const isBitunixPerp = (symbol) => BITUNIX_PERPS.has(symbol.toUpperCase());
