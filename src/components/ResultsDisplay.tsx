import React from 'react';
import type { NetworkAnalysis } from '../utils/ipCalculator';

interface ResultsDisplayProps {
  analysis: NetworkAnalysis | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ analysis }) => {
  if (!analysis) {
    return null;
  }

  if (!analysis.isValid) {
    return (
      <div className="mt-6 p-6 bg-red-900 border border-red-700 rounded-lg shadow-xl text-red-100">
        <h3 className="text-xl font-semibold mb-2">Erro na Análise</h3>
        <p>{analysis.error}</p>
      </div>
    );
  }

  const ResultItem: React.FC<{ label: string; value: string | number | boolean }> = ({ label, value }) => (
    <div className="py-2 px-3 bg-gray-750 rounded-md flex justify-between items-center">
      <span className="text-gray-400">{label}:</span>
      <span className="font-mono text-green-400 text-sm sm:text-base">
        {typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value)}
      </span>
    </div>
  );

  return (
    <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-xl">
      <h3 className="text-2xl font-semibold text-gray-200 mb-6 border-b border-gray-700 pb-3">
        Resultados da Análise de Rede
      </h3>
      <div className="space-y-3">
        <ResultItem label="Endereço IP Inserido" value={analysis.ipAddress} />
        <ResultItem label="Máscara de Sub-rede" value={`${analysis.subnetMask} (/${analysis.cidr})`} />
        <hr className="border-gray-700 my-3" />
        <ResultItem label="Endereço de Rede" value={analysis.networkAddress} />
        <ResultItem label="Endereço de Broadcast" value={analysis.broadcastAddress} />
        <ResultItem label="Primeiro Host Utilizável" value={analysis.firstUsableHost} />
        <ResultItem label="Último Host Utilizável" value={analysis.lastUsableHost} />
        <ResultItem label="Número de Hosts Utilizáveis" value={analysis.numberOfUsableHosts} />
        <ResultItem label="Máscara Wildcard" value={analysis.wildcardMask} />
        <hr className="border-gray-700 my-3" />
        <ResultItem label="IP Privado" value={analysis.isPrivate} />
      </div>
    </div>
  );
};

export default ResultsDisplay;