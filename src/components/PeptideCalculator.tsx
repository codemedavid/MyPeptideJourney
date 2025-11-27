import React, { useState } from 'react';
import { Calculator, Beaker, Droplet, Syringe, Info, Sparkles, ArrowLeft, AlertTriangle } from 'lucide-react';

interface PeptideCalculatorProps {
  onBack?: () => void;
}

const PeptideCalculator: React.FC<PeptideCalculatorProps> = ({ onBack }) => {
  const [vialSize, setVialSize] = useState<number>(5); // mg
  const [reconstitutionVolume, setReconstitutionVolume] = useState<number>(2); // ml
  const [desiredDosage, setDesiredDosage] = useState<number>(250); // mcg
  const [dosageUnit, setDosageUnit] = useState<'mcg' | 'mg'>('mcg');

  // Calculate units to inject
  const calculateUnits = () => {
    if (vialSize <= 0 || reconstitutionVolume <= 0 || desiredDosage <= 0) {
      return null;
    }

    // Convert desired dosage to mg if needed
    const desiredDosageMg = dosageUnit === 'mcg' ? desiredDosage / 1000 : desiredDosage;
    
    // Calculate concentration: mg per ml
    const concentrationMgPerMl = vialSize / reconstitutionVolume;
    
    // Calculate ml needed for desired dosage
    const mlNeeded = desiredDosageMg / concentrationMgPerMl;
    
    // Calculate units (assuming 100 units = 1 ml for insulin syringe)
    const units = mlNeeded * 100;
    
    return {
      units: Math.round(units * 10) / 10, // Round to 1 decimal
      mlNeeded: Math.round(mlNeeded * 1000) / 1000, // Round to 3 decimals
      concentrationMgPerMl: Math.round(concentrationMgPerMl * 100) / 100,
      concentrationMcgPerUnit: Math.round((concentrationMgPerMl * 1000) / 100 * 10) / 10
    };
  };

  const result = calculateUnits();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-6 md:py-8">
      <div className="container mx-auto px-3 md:px-4 max-w-4xl">
        {/* Header */}
        {onBack && (
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 md:mb-6 flex items-center gap-2 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm md:text-base">Back to Products</span>
          </button>
        )}

        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl md:rounded-3xl shadow-xl mb-4 md:mb-6">
            <Calculator className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Peptide Dosage Calculator
            </span>
            <Sparkles className="inline-block w-6 h-6 md:w-8 md:h-8 text-yellow-500 ml-2 md:ml-3" />
          </h1>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            Calculate the exact units to inject for your desired peptide dosage
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 lg:p-10 border-2 border-blue-100 mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Beaker className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                Input Values
              </h2>

              {/* Vial Size */}
              <div>
                <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-blue-600" />
                  Vial Size (mg)
                </label>
                <input
                  type="number"
                  value={vialSize}
                  onChange={(e) => setVialSize(Number(e.target.value))}
                  min="0.1"
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-base md:text-lg"
                  placeholder="5"
                />
                <p className="text-xs md:text-sm text-gray-500 mt-1">Amount of peptide in the vial</p>
              </div>

              {/* Reconstitution Volume */}
              <div>
                <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-purple-600" />
                  Reconstitution Volume (ml)
                </label>
                <input
                  type="number"
                  value={reconstitutionVolume}
                  onChange={(e) => setReconstitutionVolume(Number(e.target.value))}
                  min="0.1"
                  step="0.1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-base md:text-lg"
                  placeholder="2"
                />
                <p className="text-xs md:text-sm text-gray-500 mt-1">Amount of BAC water to add</p>
              </div>

              {/* Desired Dosage */}
              <div>
                <label className="block text-sm md:text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Syringe className="w-4 h-4 text-pink-600" />
                  Desired Dosage
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={desiredDosage}
                    onChange={(e) => setDesiredDosage(Number(e.target.value))}
                    min="0.1"
                    step="0.1"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-base md:text-lg"
                    placeholder="250"
                  />
                  <select
                    value={dosageUnit}
                    onChange={(e) => setDosageUnit(e.target.value as 'mcg' | 'mg')}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 text-base md:text-lg bg-white"
                  >
                    <option value="mcg">mcg</option>
                    <option value="mg">mg</option>
                  </select>
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Your target dosage per injection</p>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                Results
              </h2>

              {result ? (
                <div className="space-y-4">
                  {/* Main Result */}
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
                    <p className="text-sm md:text-base font-semibold opacity-90 mb-2">Units to Inject</p>
                    <p className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">{result.units}</p>
                    <p className="text-sm md:text-base opacity-90">on your insulin syringe</p>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
                      <p className="text-xs md:text-sm font-semibold text-blue-700 mb-1">Concentration</p>
                      <p className="text-base md:text-lg font-bold text-blue-900">
                        {result.concentrationMgPerMl} mg/ml
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        ({result.concentrationMcgPerUnit} mcg per unit)
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-100">
                      <p className="text-xs md:text-sm font-semibold text-purple-700 mb-1">Volume to Inject</p>
                      <p className="text-base md:text-lg font-bold text-purple-900">
                        {result.mlNeeded} ml
                      </p>
                    </div>

                    <div className="bg-pink-50 rounded-xl p-4 border-2 border-pink-100">
                      <p className="text-xs md:text-sm font-semibold text-pink-700 mb-1">Dosage</p>
                      <p className="text-base md:text-lg font-bold text-pink-900">
                        {desiredDosage} {dosageUnit}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center border-2 border-gray-200">
                  <Calculator className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm md:text-base">
                    Enter values above to calculate
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* How to Use */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 md:p-6 border-2 border-blue-100">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              How to Use
            </h3>
            <ol className="space-y-2 text-sm md:text-base text-gray-700">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">1.</span>
                <span>Enter your vial size (e.g., 5mg, 10mg)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">2.</span>
                <span>Enter reconstitution volume (BAC water in ml)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">3.</span>
                <span>Enter your desired dosage (mcg or mg)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">4.</span>
                <span>Read the units to inject on your syringe</span>
              </li>
            </ol>
          </div>

          {/* Example */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-5 md:p-6 border-2 border-purple-100">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              Example
            </h3>
            <div className="space-y-2 text-sm md:text-base text-gray-700">
              <p><strong className="text-purple-600">Vial:</strong> 5mg peptide</p>
              <p><strong className="text-purple-600">BAC Water:</strong> 2ml</p>
              <p><strong className="text-purple-600">Desired:</strong> 250mcg</p>
              <p className="pt-2 border-t border-gray-200">
                <strong className="text-purple-600">Result:</strong> Inject <span className="font-bold text-purple-700">10 units</span>
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 md:p-6 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-900 mb-2 text-sm md:text-base">Important Disclaimer</h4>
              <p className="text-xs md:text-sm text-blue-800 leading-relaxed">
                <strong>RESEARCH USE ONLY:</strong> This calculator is for educational and research purposes only. 
                Always consult with a licensed healthcare professional before using any peptide. 
                Dosage calculations should be verified by a qualified medical professional. 
                This tool does not constitute medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeptideCalculator;

