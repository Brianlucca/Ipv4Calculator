import React, { useState } from 'react';

interface IpInputFormProps {
  onCalculate: (ip: string, subnetCidr: string) => void;
}

const subnetOptions = [
  { cidrSuffix: 0, mask: "0.0.0.0" },
  { cidrSuffix: 1, mask: "128.0.0.0" },
  { cidrSuffix: 2, mask: "192.0.0.0" },
  { cidrSuffix: 3, mask: "224.0.0.0" },
  { cidrSuffix: 4, mask: "240.0.0.0" },
  { cidrSuffix: 5, mask: "248.0.0.0" },
  { cidrSuffix: 6, mask: "252.0.0.0" },
  { cidrSuffix: 7, mask: "254.0.0.0" },
  { cidrSuffix: 8, mask: "255.0.0.0" },
  { cidrSuffix: 9, mask: "255.128.0.0" },
  { cidrSuffix: 10, mask: "255.192.0.0" },
  { cidrSuffix: 11, mask: "255.224.0.0" },
  { cidrSuffix: 12, mask: "255.240.0.0" },
  { cidrSuffix: 13, mask: "255.248.0.0" },
  { cidrSuffix: 14, mask: "255.252.0.0" },
  { cidrSuffix: 15, mask: "255.254.0.0" },
  { cidrSuffix: 16, mask: "255.255.0.0" },
  { cidrSuffix: 17, mask: "255.255.128.0" },
  { cidrSuffix: 18, mask: "255.255.192.0" },
  { cidrSuffix: 19, mask: "255.255.224.0" },
  { cidrSuffix: 20, mask: "255.255.240.0" },
  { cidrSuffix: 21, mask: "255.255.248.0" },
  { cidrSuffix: 22, mask: "255.255.252.0" },
  { cidrSuffix: 23, mask: "255.255.254.0" },
  { cidrSuffix: 24, mask: "255.255.255.0" },
  { cidrSuffix: 25, mask: "255.255.255.128" },
  { cidrSuffix: 26, mask: "255.255.255.192" },
  { cidrSuffix: 27, mask: "255.255.255.224" },
  { cidrSuffix: 28, mask: "255.255.255.240" },
  { cidrSuffix: 29, mask: "255.255.255.248" },
  { cidrSuffix: 30, mask: "255.255.255.252" },
  { cidrSuffix: 31, mask: "255.255.255.254" },
  { cidrSuffix: 32, mask: "255.255.255.255" },
];

const IpInputForm: React.FC<IpInputFormProps> = ({ onCalculate }) => {
  const [ipAddress, setIpAddress] = useState<string>('192.168.1.10');
  const [selectedCidr, setSelectedCidr] = useState<string>('/24');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(ipAddress, selectedCidr);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded-lg shadow-xl space-y-6">
      <div>
        <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-300 mb-1">
          Endereço IP:
        </label>
        <input
          type="text"
          id="ipAddress"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          placeholder="Ex: 192.168.1.1"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        />
      </div>
      <div>
        <label htmlFor="subnetCidr" className="block text-sm font-medium text-gray-300 mb-1">
          Máscara de Sub-rede (CIDR):
        </label>
        <select
          id="subnetCidr"
          value={selectedCidr}
          onChange={(e) => setSelectedCidr(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          {subnetOptions.map(option => (
            <option key={option.cidrSuffix} value={`/${option.cidrSuffix}`}>
              {option.mask} (/{option.cidrSuffix})
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Calcular
      </button>
    </form>
  );
};

export default IpInputForm;