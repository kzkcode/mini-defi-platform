export function shortenAddress(address, head = 10, tail = 10) {
  if (!address) return "";
  return `${address.slice(0, head)}...${address.slice(-tail)}`;
}