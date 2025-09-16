import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, TrendingUp, DollarSign } from 'lucide-react';

const LoanCalculator = () => {
  const { t } = useTranslation();
  const [loanData, setLoanData] = useState({
    principal: 500000,
    interestRate: 8.5,
    tenure: 5
  });
  const [results, setResults] = useState({
    monthlyEMI: 0,
    totalInterest: 0,
    totalAmount: 0
  });

  useEffect(() => {
    calculateEMI();
  }, [loanData]);

  const calculateEMI = () => {
    const { principal, interestRate, tenure } = loanData;
    
    if (principal && interestRate && tenure) {
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = tenure * 12;
      
      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                  (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      const totalAmount = emi * numberOfPayments;
      const totalInterest = totalAmount - principal;
      
      setResults({
        monthlyEMI: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalAmount: Math.round(totalAmount)
      });
    }
  };

  const handleInputChange = (field, value) => {
    setLoanData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary-500 text-white p-6">
          <div className="flex items-center">
            <Calculator className="w-8 h-8 mr-3" />
            <div>
              <h2 className="text-2xl font-bold">{t('loanCalculator.title')}</h2>
              <p className="text-primary-100">Calculate your agricultural loan EMI</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Details</h3>
              
              {/* Principal Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('loanCalculator.loanAmount')}
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="10000"
                    value={loanData.principal}
                    onChange={(e) => handleInputChange('principal', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹50K</span>
                    <span>₹50L</span>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="number"
                    value={loanData.principal}
                    onChange={(e) => handleInputChange('principal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter loan amount"
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('loanCalculator.interestRate')}
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.5"
                    value={loanData.interestRate}
                    onChange={(e) => handleInputChange('interestRate', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5%</span>
                    <span>20%</span>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="number"
                    step="0.1"
                    value={loanData.interestRate}
                    onChange={(e) => handleInputChange('interestRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter interest rate"
                  />
                </div>
              </div>

              {/* Tenure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('loanCalculator.tenure')}
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={loanData.tenure}
                    onChange={(e) => handleInputChange('tenure', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 Year</span>
                    <span>20 Years</span>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="number"
                    value={loanData.tenure}
                    onChange={(e) => handleInputChange('tenure', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter tenure in years"
                  />
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Results</h3>
              
              <div className="space-y-4">
                {/* Monthly EMI */}
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-primary-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {t('loanCalculator.monthlyEMI')}
                      </span>
                    </div>
                    <span className="text-xl font-bold text-primary-600">
                      {formatCurrency(results.monthlyEMI)}
                    </span>
                  </div>
                </div>

                {/* Total Interest */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {t('loanCalculator.totalInterest')}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-yellow-600">
                      {formatCurrency(results.totalInterest)}
                    </span>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calculator className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        {t('loanCalculator.totalAmount')}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatCurrency(results.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Loan Breakdown Chart */}
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Loan Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Principal Amount:</span>
                    <span className="font-medium">{formatCurrency(loanData.principal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Interest Amount:</span>
                    <span className="font-medium">{formatCurrency(results.totalInterest)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Payable:</span>
                    <span>{formatCurrency(results.totalAmount)}</span>
                  </div>
                </div>
                
                {/* Visual representation */}
                <div className="mt-4">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500"
                      style={{ 
                        width: `${(loanData.principal / results.totalAmount) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Principal</span>
                    <span>Interest</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• This is an approximate calculation. Actual EMI may vary based on bank policies.</li>
              <li>• Interest rates may vary based on your credit score and bank relationship.</li>
              <li>• Consider processing fees, insurance, and other charges while planning.</li>
              <li>• Agricultural loans may have special subsidies and lower interest rates.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;
