import React, { useState, useCallback } from 'react';
import { analyzeIp, type NetworkAnalysis, } from '../utils/ipCalculator';
import { longToIp, ipToLong, cidrToMaskString as utilCidrToMaskString } from '../utils/ipCalculator';


const subnetOptionsList = [
  { cidrSuffix: 0, mask: "0.0.0.0" }, { cidrSuffix: 1, mask: "128.0.0.0" },
  { cidrSuffix: 2, mask: "192.0.0.0" }, { cidrSuffix: 3, mask: "224.0.0.0" },
  { cidrSuffix: 4, mask: "240.0.0.0" }, { cidrSuffix: 5, mask: "248.0.0.0" },
  { cidrSuffix: 6, mask: "252.0.0.0" }, { cidrSuffix: 7, mask: "254.0.0.0" },
  { cidrSuffix: 8, mask: "255.0.0.0" }, { cidrSuffix: 9, mask: "255.128.0.0" },
  { cidrSuffix: 10, mask: "255.192.0.0" }, { cidrSuffix: 11, mask: "255.224.0.0" },
  { cidrSuffix: 12, mask: "255.240.0.0" }, { cidrSuffix: 13, mask: "255.248.0.0" },
  { cidrSuffix: 14, mask: "255.252.0.0" }, { cidrSuffix: 15, mask: "255.254.0.0" },
  { cidrSuffix: 16, mask: "255.255.0.0" }, { cidrSuffix: 17, mask: "255.255.128.0" },
  { cidrSuffix: 18, mask: "255.255.192.0" }, { cidrSuffix: 19, mask: "255.255.224.0" },
  { cidrSuffix: 20, mask: "255.255.240.0" }, { cidrSuffix: 21, mask: "255.255.248.0" },
  { cidrSuffix: 22, mask: "255.255.252.0" }, { cidrSuffix: 23, mask: "255.255.254.0" },
  { cidrSuffix: 24, mask: "255.255.255.0" }, { cidrSuffix: 25, mask: "255.255.255.128" },
  { cidrSuffix: 26, mask: "255.255.255.192" }, { cidrSuffix: 27, mask: "255.255.255.224" },
  { cidrSuffix: 28, mask: "255.255.255.240" }, { cidrSuffix: 29, mask: "255.255.255.248" },
  { cidrSuffix: 30, mask: "255.255.255.252" }, { cidrSuffix: 31, mask: "255.255.255.254" },
  { cidrSuffix: 32, mask: "255.255.255.255" },
];

interface PlannedSubnetResult {
  id: string;
  networkAddress: string;
  cidr: number;
  subnetMask: string;
  firstUsableHost: string;
  lastUsableHost: string;
  numberOfUsableHosts: number;
  broadcastAddress: string;
}

const SubnetPlanner: React.FC = () => {
  const [baseIp, setBaseIp] = useState<string>('192.168.0.0');
  const [baseCidr, setBaseCidr] = useState<string>('/24');
  const [numSubnets, setNumSubnets] = useState<string>('4');
  const [plannedSubnets, setPlannedSubnets] = useState<PlannedSubnetResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isValidIpForPlanner = (ip: string): boolean => {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);
  }
  
  const handlePlanSubnets = useCallback(() => {
    setError(null);
    setPlannedSubnets([]);

    if (!isValidIpForPlanner(baseIp)) {
      setError("Endereço IP base inválido.");
      return;
    }

    const baseCidrNum = parseInt(baseCidr.substring(1), 10);
    if (isNaN(baseCidrNum) || baseCidrNum < 0 || baseCidrNum > 30) {
      setError("CIDR base inválido para subnetting (deve ser /0 a /30).");
      return;
    }

    const desiredNumSubnets = parseInt(numSubnets, 10);
    if (isNaN(desiredNumSubnets) || desiredNumSubnets <= 0 || !Number.isInteger(desiredNumSubnets) ) {
      setError("Número de sub-redes desejadas deve ser um inteiro positivo.");
      return;
    }
    
    if (desiredNumSubnets > Math.pow(2, 30-baseCidrNum) && baseCidrNum < 30){
        setError(`Não é possível criar ${desiredNumSubnets} sub-redes a partir de um bloco /${baseCidrNum}. Máximo: ${Math.pow(2, 30-baseCidrNum)} sub-redes para ter pelo menos /30.`);
        return;
    }


    let baseIpLong: number;
    let baseMaskLong: number;
    try {
        baseIpLong = ipToLong(baseIp);
        baseMaskLong = ipToLong(utilCidrToMaskString(baseCidrNum));
    } catch {
        setError("Erro ao converter IP base ou máscara.");
        return;
    }

    const baseNetworkLong = (baseIpLong & baseMaskLong) >>> 0;

    if (ipToLong(baseIp) !== baseNetworkLong) {
        setError(`O IP base ${baseIp} não é o endereço de rede para o CIDR /${baseCidrNum}. Use ${longToIp(baseNetworkLong)}.`);
        return;
    }

    const bitsToBorrow = Math.ceil(Math.log2(desiredNumSubnets));
    const newSubnetCidrNum = baseCidrNum + bitsToBorrow;

    if (newSubnetCidrNum > 32) {
      setError(`Não é possível criar ${desiredNumSubnets} sub-redes. O CIDR resultante seria maior que /32.`);
      return;
    }
    
    const actualNumSubnetsToCreate = Math.pow(2, bitsToBorrow);
    const subnetIncrement = Math.pow(2, 32 - newSubnetCidrNum);
    const results: PlannedSubnetResult[] = [];

    for (let i = 0; i < actualNumSubnetsToCreate; i++) {
      const currentSubnetNetworkLong = (baseNetworkLong + (i * subnetIncrement)) >>> 0;
      const currentSubnetNetworkStr = longToIp(currentSubnetNetworkLong);
      
      const analysis = analyzeIp(currentSubnetNetworkStr, `/${newSubnetCidrNum}`);
      
      if (analysis.isValid) {
        results.push({
          id: `${currentSubnetNetworkStr}/${newSubnetCidrNum}`,
          networkAddress: analysis.networkAddress,
          cidr: analysis.cidr,
          subnetMask: analysis.subnetMask,
          firstUsableHost: analysis.firstUsableHost,
          lastUsableHost: analysis.lastUsableHost,
          numberOfUsableHosts: analysis.numberOfUsableHosts,
          broadcastAddress: analysis.broadcastAddress,
        });
      } else {
        setError(`Erro ao analisar a sub-rede gerada: ${currentSubnetNetworkStr}/${newSubnetCidrNum}`);
        return; 
      }
    }
    setPlannedSubnets(results);
  }, [baseIp, baseCidr, numSubnets]);

  return (
    <div className="mt-10 p-6 bg-gray-800 rounded-lg shadow-xl w-full">
      <h3 className="text-2xl font-semibold text-gray-200 mb-6 border-b border-gray-700 pb-3">
        Planejador de Sub-redes (Tamanho Fixo)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="baseIp" className="block text-sm font-medium text-gray-300 mb-1">IP Base da Rede:</label>
          <input
            type="text"
            id="baseIp"
            value={baseIp}
            onChange={(e) => setBaseIp(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
          />
        </div>
        <div>
          <label htmlFor="baseCidr" className="block text-sm font-medium text-gray-300 mb-1">CIDR Base:</label>
          <select
            id="baseCidr"
            value={baseCidr}
            onChange={(e) => setBaseCidr(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
          >
            {subnetOptionsList.filter(opt => opt.cidrSuffix <= 30).map(option => (
              <option key={option.cidrSuffix} value={`/${option.cidrSuffix}`}>
                {option.mask} (/{option.cidrSuffix})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="numSubnets" className="block text-sm font-medium text-gray-300 mb-1">Nº de Sub-redes Desejadas:</label>
          <input
            type="number"
            id="numSubnets"
            value={numSubnets}
            min="1"
            onChange={(e) => setNumSubnets(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
          />
        </div>
      </div>
      <button
        onClick={handlePlanSubnets}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-md"
      >
        Planejar Sub-redes
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-100">
          <p>{error}</p>
        </div>
      )}

      {plannedSubnets.length > 0 && (
        <div className="mt-8">
          <h4 className="text-xl font-semibold text-gray-300 mb-4">Sub-redes Planejadas:</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rede/CIDR</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Máscara</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Faixa Utilizável</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Broadcast</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Hosts Utiliz.</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {plannedSubnets.map((subnet) => (
                  <tr key={subnet.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-green-400">{subnet.networkAddress}/{subnet.cidr}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-300">{subnet.subnetMask}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-300">
                      {subnet.firstUsableHost} - {subnet.lastUsableHost}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-300">{subnet.broadcastAddress}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-300">{subnet.numberOfUsableHosts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubnetPlanner;