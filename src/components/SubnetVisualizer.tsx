import React from 'react';
import type { NetworkAnalysis } from '../utils/ipCalculator';

interface SubnetVisualizerProps {
  analysis: NetworkAnalysis | null;
}

const SubnetVisualizer: React.FC<SubnetVisualizerProps> = ({ analysis }) => {
  if (!analysis || !analysis.isValid) {
    return null;
  }

  const ipIsInRange = () => {
    if (analysis.cidr === 32 || analysis.cidr === 31) {
        return analysis.ipAddress === analysis.networkAddress || analysis.ipAddress === analysis.broadcastAddress;
    }
    const ipLong = analysis.ipAddress.split('.').reduce((acc, octet, index) => acc + (parseInt(octet, 10) << (24 - index * 8)), 0) >>> 0;
    const firstUsableLong = analysis.firstUsableHost !== "N/A" ? analysis.firstUsableHost.split('.').reduce((acc, octet, index) => acc + (parseInt(octet, 10) << (24 - index * 8)), 0) >>> 0 : -1;
    const lastUsableLong = analysis.lastUsableHost !== "N/A" ? analysis.lastUsableHost.split('.').reduce((acc, octet, index) => acc + (parseInt(octet, 10) << (24 - index * 8)), 0) >>> 0 : -1;
    return firstUsableLong !== -1 && lastUsableLong !== -1 && ipLong >= firstUsableLong && ipLong <= lastUsableLong;
  };

  const isIpNetworkOrBroadcast = analysis.ipAddress === analysis.networkAddress || analysis.ipAddress === analysis.broadcastAddress;

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-xl text-gray-200">
      <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
        Visualização da Sub-rede
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-center p-3 bg-gray-700 rounded">
          <div className="w-1/3 font-medium text-gray-400">Endereço de Rede:</div>
          <div className={`w-2/3 font-mono ${analysis.ipAddress === analysis.networkAddress ? 'text-yellow-400' : 'text-green-400'}`}>{analysis.networkAddress}</div>
        </div>

        {analysis.cidr < 31 && analysis.numberOfUsableHosts > 0 && (
          <div className="flex items-center p-3 bg-gray-700 rounded">
            <div className="w-1/3 font-medium text-gray-400">Primeiro Host Utilizável:</div>
            <div className={`w-2/3 font-mono ${analysis.ipAddress === analysis.firstUsableHost ? 'text-yellow-400' : 'text-green-400'}`}>{analysis.firstUsableHost}</div>
          </div>
        )}

        {analysis.ipAddress && !isIpNetworkOrBroadcast && ipIsInRange() && (
            <div className="flex items-center p-3 bg-yellow-600 bg-opacity-30 border border-yellow-500 rounded my-2">
                <div className="w-1/3 font-medium text-yellow-300">IP Inserido:</div>
                <div className="w-2/3 font-mono text-yellow-300">{analysis.ipAddress}</div>
            </div>
        )}


        {analysis.cidr < 31 && analysis.numberOfUsableHosts > 0 && (
          <div className="flex items-center p-3 bg-gray-700 rounded">
            <div className="w-1/3 font-medium text-gray-400">Último Host Utilizável:</div>
            <div className={`w-2/3 font-mono ${analysis.ipAddress === analysis.lastUsableHost ? 'text-yellow-400' : 'text-green-400'}`}>{analysis.lastUsableHost}</div>
          </div>
        )}
        
        {(analysis.cidr === 31) && (
            <>
            <div className="flex items-center p-3 bg-gray-700 rounded">
                <div className="w-1/3 font-medium text-gray-400">Host 1 (Rede):</div>
                <div className={`w-2/3 font-mono ${analysis.ipAddress === analysis.networkAddress ? 'text-yellow-400' : 'text-green-400'}`}>{analysis.networkAddress}</div>
            </div>
            <div className="flex items-center p-3 bg-gray-700 rounded">
                <div className="w-1/3 font-medium text-gray-400">Host 2 (Broadcast):</div>
                <div className={`w-2/3 font-mono ${analysis.ipAddress === analysis.broadcastAddress ? 'text-yellow-400' : 'text-green-400'}`}>{analysis.broadcastAddress}</div>
            </div>
            </>
        )}


        <div className="flex items-center p-3 bg-gray-700 rounded">
          <div className="w-1/3 font-medium text-gray-400">Endereço de Broadcast:</div>
          <div className={`w-2/3 font-mono ${analysis.ipAddress === analysis.broadcastAddress ? 'text-yellow-400' : 'text-green-400'}`}>{analysis.broadcastAddress}</div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col sm:flex-row text-center text-xs h-16 items-stretch">
        <div className={`p-2 flex items-center justify-center bg-red-700 text-white rounded-l-md sm:rounded-l-md sm:rounded-tr-none ${analysis.cidr >= 31 ? 'flex-1' : 'w-1/5 sm:w-auto'}`}>
            <div>
                <p>Rede</p>
                {analysis.cidr < 31 && <p className="font-mono hidden sm:block">{analysis.networkAddress}</p>}
            </div>
        </div>
        <div className={`p-2 flex items-center justify-center bg-green-700 text-white flex-grow ${analysis.cidr >=31 ? 'hidden' : ''}`}>
            <div>
                <p>Faixa Utilizável</p>
                {analysis.cidr < 30 && <p className="font-mono hidden sm:block">{analysis.numberOfUsableHosts} hosts</p>}
            </div>
        </div>
        <div className={`p-2 flex items-center justify-center bg-red-700 text-white rounded-r-md sm:rounded-r-md sm:rounded-bl-none ${analysis.cidr >= 31 ? 'flex-1' : 'w-1/5 sm:w-auto'}`}>
            <div>
                <p>Broadcast</p>
                {analysis.cidr < 31 && <p className="font-mono hidden sm:block">{analysis.broadcastAddress}</p>}
            </div>
        </div>
      </div>

    </div>
  );
};

export default SubnetVisualizer;