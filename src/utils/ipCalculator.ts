export interface NetworkAnalysis {
  ipAddress: string;
  subnetMask: string;
  cidr: number;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  numberOfHosts: number;
  numberOfUsableHosts: number;
  wildcardMask: string;
  isPrivate: boolean;
  isValid: boolean;
  error?: string;
}

export function ipToLong(ip: string): number {
  return ip.split('.').reduce((acc, octetString, index) => {
    const octet = parseInt(octetString, 10);
    return acc + (octet << (24 - index * 8));
  }, 0) >>> 0;
}

export function longToIp(longIp: number): string {
  return [
    (longIp >>> 24) & 255,
    (longIp >>> 16) & 255,
    (longIp >>> 8) & 255,
    longIp & 255
  ].join('.');
}

function isValidIpFormat(ip: string): boolean {
  if (typeof ip !== 'string') return false;
  const octets = ip.split('.');
  if (octets.length !== 4) return false;
  return octets.every(octet => {
    if (!/^\d+$/.test(octet)) return false;
    const num = parseInt(octet, 10);
    return num >= 0 && num <= 255;
  });
}

function isValidMaskString(mask: string): boolean {
  if (!isValidIpFormat(mask)) return false;
  const maskLong = ipToLong(mask);
  if (maskLong === 0) return true;
  if (maskLong === 0xFFFFFFFF) return true;
  const invertedMask = ~maskLong >>> 0;
  return ((invertedMask + 1) & invertedMask) === 0;
}

function countSetBits(n: number): number {
  let num = n >>> 0;
  let count = 0;
  while (num > 0) {
    num &= (num - 1);
    count++;
  }
  return count;
}

export function cidrToMaskString(cidr: number): string {
  if (cidr < 0 || cidr > 32 || isNaN(cidr)) {
    throw new Error("Prefixo CIDR inválido (deve ser um número entre 0 e 32).");
  }
  if (cidr === 0) return "0.0.0.0";
  const maskLong = (0xFFFFFFFF << (32 - cidr)) >>> 0;
  return longToIp(maskLong);
}

function maskStringToCidr(mask: string): number {
  if (!isValidMaskString(mask)) {
    throw new Error("Tentativa de converter máscara inválida para CIDR.");
  }
  const maskLong = ipToLong(mask);
  return countSetBits(maskLong);
}

function isPrivateIp(ipLong: number): boolean {
  const MASK_10_START = ipToLong("10.0.0.0");
  const MASK_10_END = ipToLong("10.255.255.255");
  if (ipLong >= MASK_10_START && ipLong <= MASK_10_END) return true;

  const MASK_172_START = ipToLong("172.16.0.0");
  const MASK_172_END = ipToLong("172.31.255.255");
  if (ipLong >= MASK_172_START && ipLong <= MASK_172_END) return true;

  const MASK_192_START = ipToLong("192.168.0.0");
  const MASK_192_END = ipToLong("192.168.255.255");
  if (ipLong >= MASK_192_START && ipLong <= MASK_192_END) return true;

  return false;
}

export function analyzeIp(ipAddressInput: string, subnetInput: string): NetworkAnalysis {
  if (!isValidIpFormat(ipAddressInput)) {
    return { error: "Formato de endereço IP inválido.", isValid: false } as NetworkAnalysis;
  }

  let cidr: number;
  let subnetMaskString: string;

  if (subnetInput.startsWith('/')) {
    const cidrNum = parseInt(subnetInput.substring(1), 10);
    if (isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
      return { error: "Prefixo CIDR inválido (deve ser de /0 a /32).", isValid: false } as NetworkAnalysis;
    }
    cidr = cidrNum;
    try {
      subnetMaskString = cidrToMaskString(cidr);
    } catch (e: any) {
      return { error: e.message, isValid: false } as NetworkAnalysis;
    }
  } else {
    if (!isValidMaskString(subnetInput)) {
      return { error: "Formato de máscara de sub-rede inválido ou máscara não contígua.", isValid: false } as NetworkAnalysis;
    }
    subnetMaskString = subnetInput;
    try {
      cidr = maskStringToCidr(subnetMaskString);
    } catch (e: any) {
       return { error: e.message, isValid: false } as NetworkAnalysis;
    }
  }

  const ipLong = ipToLong(ipAddressInput);
  const maskLong = ipToLong(subnetMaskString);

  const networkAddressLong = (ipLong & maskLong) >>> 0;
  const broadcastAddressLong = (networkAddressLong | (~maskLong)) >>> 0;
  const wildcardMaskLong = (~maskLong) >>> 0;
  const totalHostsInSubnet = Math.pow(2, 32 - cidr);
  let usableHostsCount: number;

  if (cidr === 32) {
    usableHostsCount = 1;
  } else if (cidr === 31) {
    usableHostsCount = 2;
  } else if (cidr === 0) {
    usableHostsCount = Math.pow(2,32) -2;
  }
   else {
    usableHostsCount = totalHostsInSubnet >= 2 ? totalHostsInSubnet - 2 : 0;
  }

  let firstUsableHostLong: number;
  let lastUsableHostLong: number;

  if (cidr === 32) {
    firstUsableHostLong = networkAddressLong;
    lastUsableHostLong = networkAddressLong;
  } else if (cidr === 31) {
    firstUsableHostLong = networkAddressLong;
    lastUsableHostLong = broadcastAddressLong;
  } else if (cidr === 0 && totalHostsInSubnet > 2) {
    firstUsableHostLong = networkAddressLong + 1;
    lastUsableHostLong = broadcastAddressLong -1;
  }
  else if (totalHostsInSubnet > 2) {
    firstUsableHostLong = networkAddressLong + 1;
    lastUsableHostLong = broadcastAddressLong - 1;
  } else {
    firstUsableHostLong = networkAddressLong;
    lastUsableHostLong = broadcastAddressLong;
  }

  return {
    ipAddress: ipAddressInput,
    subnetMask: subnetMaskString,
    cidr: cidr,
    networkAddress: longToIp(networkAddressLong),
    broadcastAddress: longToIp(broadcastAddressLong),
    firstUsableHost: (cidr === 32 || cidr === 31 || (cidr < 31 && usableHostsCount > 0 && totalHostsInSubnet > 2) || (cidr === 0 && usableHostsCount > 0)) ? longToIp(firstUsableHostLong) : "N/A",
    lastUsableHost: (cidr === 32 || cidr === 31 || (cidr < 31 && usableHostsCount > 0 && totalHostsInSubnet > 2) || (cidr === 0 && usableHostsCount > 0)) ? longToIp(lastUsableHostLong) : "N/A",
    numberOfHosts: totalHostsInSubnet,
    numberOfUsableHosts: usableHostsCount,
    wildcardMask: longToIp(wildcardMaskLong),
    isPrivate: isPrivateIp(ipLong),
    isValid: true,
  };
}