import React, { useState, useCallback } from 'react';
import IpInputForm from './components/IpInputForm';
import ResultsDisplay from './components/ResultsDisplay';
import SubnetVisualizer from './components/SubnetVisualizer'; 
import SubnetPlanner from './components/SubnetPlanner';  
import { analyzeIp, type NetworkAnalysis } from './utils/ipCalculator';
import GitHubIcon from './components/GithubIcon';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<NetworkAnalysis | null>(null);

  const handleCalculate = useCallback((ip: string, subnetCidr: string) => {
    const result = analyzeIp(ip, subnetCidr);
    setAnalysisResult(result);
  }, []);

  const GITHUB_PROFILE_URL = 'https://github.com/Brianlucca';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center py-10 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Calculadora e Analisador IPv4
        </h1>
        <p className="text-gray-400 mt-2">
          Insira um endereço IP e selecione uma máscara de sub-rede (CIDR) para ver os detalhes.
        </p>
      </header>

      <main className="w-full max-w-3xl px-2">
        <IpInputForm onCalculate={handleCalculate} />
        {analysisResult && <ResultsDisplay analysis={analysisResult} />}
        {analysisResult && analysisResult.isValid && <SubnetVisualizer analysis={analysisResult} />}
        
        <hr className="my-12 border-gray-700" />

        <SubnetPlanner />
      </main>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <div className="flex flex-col items-center space-y-2">
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors duration-200"
            >
              Brian Lucca
            </a>
            /Ipv4 Calculator.
          </p>
          <p className="flex items-center">
            Feito com React, TypeScript & Tailwind CSS
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="ml-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <GitHubIcon className="w-5 h-5" />
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;