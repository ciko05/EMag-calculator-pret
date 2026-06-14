import React, { useState, useEffect, useMemo } from 'react';
import { Euro, TrendingUp, ShoppingCart, Percent, Truck, Package } from 'lucide-react';
import { CalculatorState, CalculatedResults, CONSTANTS } from './types';
import { StatCard } from './components/StatCard';
import { InputGroup } from './components/InputGroup';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorState>({
    euroPrice: '',
    leiPrice: '',
    sellingPriceIncVat: '', // User now inputs price with VAT
    commissionPercent: 18,
    returnRatePercent: 8, // Default 8%
    euroRate: 5.1, // Default dynamic rate
  });

  // Handle Euro Change (updates Lei)
  const handleEuroChange = (val: string) => {
    const numVal = val === '' ? '' : parseFloat(val);
    if (numVal === '') {
      setInputs(prev => ({ ...prev, euroPrice: '', leiPrice: '' }));
      return;
    }
    
    // Calculate Lei based on current dynamic rate
    const calculatedLei = parseFloat((numVal * inputs.euroRate).toFixed(2));
    setInputs(prev => ({ ...prev, euroPrice: numVal, leiPrice: calculatedLei }));
  };

  // Handle Lei Change (updates Euro - bi-directional per prompt)
  const handleLeiChange = (val: string) => {
    const numVal = val === '' ? '' : parseFloat(val);
    if (numVal === '') {
      setInputs(prev => ({ ...prev, leiPrice: '', euroPrice: '' }));
      return;
    }
    
    // Calculate Euro in real-time
    const calculatedEuro = parseFloat((numVal / inputs.euroRate).toFixed(2));
    setInputs(prev => ({ ...prev, leiPrice: numVal, euroPrice: calculatedEuro }));
  };

  // Handle Euro Rate Change
  const handleEuroRateChange = (val: string) => {
    const parsedRate = val === '' ? 0 : parseFloat(val);
    setInputs(prev => {
      // Recalculate price fields to maintain sync
      let newEuro = prev.euroPrice;
      let newLei = prev.leiPrice;
      
      if (typeof prev.euroPrice === 'number' && parsedRate > 0) {
        newLei = parseFloat((prev.euroPrice * parsedRate).toFixed(2));
      } else if (typeof prev.leiPrice === 'number' && parsedRate > 0) {
        newEuro = parseFloat((prev.leiPrice / parsedRate).toFixed(2));
      }
      
      return {
        ...prev,
        euroRate: parsedRate,
        euroPrice: newEuro,
        leiPrice: newLei
      };
    });
  };

  // Handle Selling Price Change (Now Input is WITH VAT)
  const handleSellingChange = (val: string) => {
    setInputs(prev => ({ ...prev, sellingPriceIncVat: val === '' ? '' : parseFloat(val) }));
  };

  // Handle Commission Change
  const handleCommissionChange = (val: string) => {
    setInputs(prev => ({ ...prev, commissionPercent: val === '' ? 0 : parseFloat(val) }));
  };

  // Handle Return Rate Change
  const handleReturnRateChange = (val: string) => {
    setInputs(prev => ({ ...prev, returnRatePercent: val === '' ? 0 : parseFloat(val) }));
  };

  // Main Calculation Logic
  const results: CalculatedResults = useMemo(() => {
    const { leiPrice, sellingPriceIncVat, commissionPercent, returnRatePercent } = inputs;
    const acquisitionCost = typeof leiPrice === 'number' ? leiPrice : 0;
    
    // Derive Ex VAT price from Input (Inc VAT)
    const priceIncVat = typeof sellingPriceIncVat === 'number' ? sellingPriceIncVat : 0;
    const priceExVat = priceIncVat / (1 + CONSTANTS.VAT_RATE);

    // 1. Transport Logic (Based on Selling Price Inc VAT per image)
    let transport = 0;
    if (priceIncVat > 0) {
      if (priceIncVat < 40) transport = 3;
      else if (priceIncVat < 50) transport = 4;
      else if (priceIncVat < 75) transport = 5;
      else transport = 8;
    }

    // 2. Commission Logic
    // "Calculated from Selling Price Ex Vat"
    const commissionExVat = priceExVat * (commissionPercent / 100);
    const commissionIncVat = commissionExVat * (1 + CONSTANTS.VAT_RATE);

    // 3. Profit Calculation
    // Profit = Revenue (Ex VAT) - Acquisition - Transport (Ex VAT) - Commission (Ex VAT)
    const totalCost = acquisitionCost + transport + commissionExVat;
    const profit = priceExVat - totalCost;

    // 4. Margin & Markup
    // Margin (Marja) = Profit / Revenue
    // Markup (Adaos) = Profit / Acquisition Cost
    const profitMargin = priceExVat > 0 ? (profit / priceExVat) * 100 : 0;
    
    // Avoid division by zero for markup
    const markup = acquisitionCost > 0 ? (profit / acquisitionCost) * 100 : 0;

    // 5. Risk Calculation
    const packagingLossCost = 2;
    const failureCost = packagingLossCost + transport;
    const returnRate = returnRatePercent;
    const expectedValue = ((100 - returnRate) / 100 * profit) - ((returnRate / 100) * failureCost);

    return {
      transportCost: transport,
      commissionValueExVat: commissionExVat,
      commissionValueIncVat: commissionIncVat,
      sellingPriceIncVat: priceIncVat,
      sellingPriceExVat: priceExVat,
      totalCost,
      profit,
      profitMargin,
      markup,
      failureCost,
      expectedValue
    };
  }, [inputs]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(val);

  return (
    <div className="min-h-screen bg-slate-50 p-2 md:p-4 flex flex-col justify-start">
      <div className="max-w-6xl mx-auto w-full space-y-3">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span className="bg-emag-blue text-white p-1.5 rounded-md">
                <ShoppingCart size={18} />
              </span>
              Calculator Profit eMAG
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Simulare costuri, comisioane și profitabilitate</p>
          </div>
          <div className="flex gap-3 text-[11px] font-bold text-slate-550 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm self-start sm:self-auto">
             <span className="flex items-center gap-0.5"><Euro size={12}/> 1 = {inputs.euroRate} RON</span>
             <span className="w-px h-3 bg-slate-300"></span>
             <span>TVA Vânzare: {(CONSTANTS.VAT_RATE * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-150">
              <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                <Package className="text-slate-400" size={16}/>
                Date Intrare
              </h2>
              
              <div className="space-y-3.5">
                {/* Acquisition Costs */}
                <div className="grid grid-cols-3 gap-3">
                  <InputGroup 
                    label="Preț Euro" 
                    value={inputs.euroPrice} 
                    onChange={handleEuroChange}
                    prefix="€"
                    placeholder="0.00"
                  />
                  <InputGroup 
                    label="Curs Euro" 
                    value={inputs.euroRate} 
                    onChange={handleEuroRateChange}
                    suffix="RON"
                    placeholder="5.10"
                    enableSlider={true}
                    sliderMin={4.0}
                    sliderMax={6.0}
                    sliderStep={0.01}
                  />
                  <InputGroup 
                    label="Preț Net Lei" 
                    value={inputs.leiPrice} 
                    onChange={handleLeiChange}
                    suffix="RON"
                    placeholder="0.00"
                    enableSlider={true}
                    sliderMin={0}
                    sliderMax={1000}
                    sliderStep={1}
                  />
                </div>

                <hr className="border-slate-100 my-1" />

                {/* Selling Price - UPDATED TO INCLUDE VAT */}
                <InputGroup 
                  label="Preț Vânzare (TVA Inclus)" 
                  value={inputs.sellingPriceIncVat} 
                  onChange={handleSellingChange}
                  suffix="RON"
                  placeholder="0.00"
                  helperText="Prețul de vânzare pe site; deduce automat TVA-ul."
                  enableSlider={true}
                  sliderMin={0}
                  sliderMax={1000}
                  sliderStep={1}
                />

                {/* Commission */}
                <div className="grid grid-cols-2 gap-3">
                    <InputGroup 
                      label="Comision eMAG" 
                      value={inputs.commissionPercent} 
                      onChange={handleCommissionChange}
                      suffix="%"
                      placeholder="0"
                      enableSlider={true}
                      sliderMin={0}
                      sliderMax={50}
                      sliderStep={1}
                    />
                    
                    {/* Read Only Transport Display */}
                    <div className="opacity-90">
                      <InputGroup 
                        label="Cost Transport (Auto)" 
                        value={results.transportCost} 
                        onChange={() => {}} // Read only
                        suffix="RON"
                        placeholder="0.00"
                        helperText={results.sellingPriceIncVat ? (
                          results.sellingPriceIncVat < 40 ? "<40 RON (TVA Inc)" : 
                          results.sellingPriceIncVat < 50 ? "40-50 RON (TVA Inc)" :
                          results.sellingPriceIncVat < 75 ? "50-75 RON (TVA Inc)" : "≥75 RON (TVA Inc)"
                        ) : "Calculat automat"}
                      />
                    </div>
                </div>

                <hr className="border-slate-100 my-1" />

                {/* Estimated Return Rate (%) with interactive slider */}
                <InputGroup 
                  label="Rată Retur Estimată" 
                  value={inputs.returnRatePercent} 
                  onChange={handleReturnRateChange}
                  suffix="%"
                  placeholder="8"
                  helperText="Procentul de colete eșuate/returnate în sistem."
                  enableSlider={true}
                  sliderMin={0}
                  sliderMax={50}
                  sliderStep={1}
                />
              </div>
            </div>
            
            {/* Quick Summary of Inputs if needed or instructions */}
            <div className="bg-blue-50/70 p-3 rounded-lg text-[11px] text-blue-900 border border-blue-100/60 flex flex-col gap-1">
              <span className="font-bold flex items-center gap-1">⚡ Grilă Genius Transport (fără TVA):</span>
              <div className="grid grid-cols-4 gap-1 text-center font-semibold mt-0.5">
                <div className="bg-white/80 p-1 rounded border border-blue-105/20">&lt;40: <strong className="text-blue-700">3 RON</strong></div>
                <div className="bg-white/80 p-1 rounded border border-blue-105/20">40-50: <strong className="text-blue-700">4 RON</strong></div>
                <div className="bg-white/80 p-1 rounded border border-blue-105/20">50-75: <strong className="text-blue-700">5 RON</strong></div>
                <div className="bg-white/80 p-1 rounded border border-blue-105/20">&ge;75: <strong className="text-blue-700">8 RON</strong></div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS (CARDS) */}
          <div className="lg:col-span-7 space-y-3">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 lg:hidden">
              <TrendingUp className="text-slate-400" size={16}/>
              Rezultate
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Selling Price */}
              <StatCard 
                title="Preț Vânzare eMAG"
                mainValue={formatCurrency(results.sellingPriceIncVat)}
                mainLabel="(TVA Inclus)"
                subLabel="Fără TVA"
                subValue={formatCurrency(results.sellingPriceExVat)}
                accentColor="blue"
                icon={<ShoppingCart className="text-blue-600" size={14} />}
              />

              {/* Card 2: Commission */}
              <StatCard 
                title="Cost Comision"
                mainValue={formatCurrency(results.commissionValueExVat)}
                mainLabel="(Fără TVA)"
                subLabel="Cu TVA"
                subValue={formatCurrency(results.commissionValueIncVat)}
                extraLabel="Rată"
                extraValue={`${inputs.commissionPercent}%`}
                accentColor="amber"
                icon={<Percent className="text-amber-600" size={14} />}
              />
            </div>

            {/* Card 3: Profit (Full Width) */}
            <StatCard 
              title="Profit per Produs"
              mainValue={formatCurrency(results.profit)}
              mainLabel="Profit Net"
              subLabel="Marjă Profit (netă)"
              subValue={`${results.profitMargin.toFixed(1)}%`}
              subLabelClassName="text-xs font-bold uppercase tracking-tight opacity-90"
              subValueClassName="text-xs md:text-sm font-black"
              extraLabel="Adaos Comercial"
              extraValue={`${results.markup.toFixed(1)}%`}
              accentColor={results.profit >= 0 ? 'green' : 'red'}
              highlight={true}
              icon={<TrendingUp className={results.profit >= 0 ? "text-emerald-600" : "text-red-600"} size={14} />}
            />

            {/* Cost Summary Badges (Replaced bulky table for extreme space-saving) */}
            <div className="bg-white rounded-xl border border-slate-200 p-2 flex flex-wrap justify-between items-center text-[11px] text-slate-600 gap-2 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Marfă:</span>
                <span className="font-bold text-slate-800">{formatCurrency(typeof inputs.leiPrice === 'number' ? inputs.leiPrice : 0)}</span>
              </div>
              <div className="w-px h-3 bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Transport:</span>
                <span className="font-bold text-slate-800">{formatCurrency(results.transportCost)}</span>
              </div>
              <div className="w-px h-3 bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-400 uppercase tracking-wide text-[9px]">Comision:</span>
                <span className="font-bold text-slate-800">{formatCurrency(results.commissionValueExVat)}</span>
              </div>
              <div className="ml-auto bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-extrabold flex items-center gap-1 text-[11px]">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wide">Total Cost:</span>
                <span>{formatCurrency(results.totalCost)}</span>
              </div>
            </div>

            {/* Risk Engine (EV) */}
            <div className={`rounded-xl border border-2 overflow-hidden shadow-sm transition-all ${
              results.expectedValue > 0 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950' 
                : 'bg-rose-50 border-rose-500 border-2 text-rose-950'
            }`}>
              <div className={`px-3 py-1.5 border-b flex justify-between items-center text-[11px] ${
                results.expectedValue > 0 
                  ? 'border-emerald-250/20 bg-emerald-100/30' 
                  : 'border-rose-200/50 bg-rose-100/30'
              }`}>
                <h3 className="font-bold uppercase tracking-wide flex items-center gap-1">
                  <span>⚠</span>
                  Risk Engine (EV)
                </h3>
              </div>
              <div className="p-3.5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider block opacity-75">
                      Expected Value (Valoare Estimată per Vânzare)
                    </span>
                    <span 
                      id="ev-display-value"
                      className="text-2xl md:text-3xl font-black tracking-tight block leading-none mt-0.5"
                    >
                      {formatCurrency(results.expectedValue)}
                    </span>
                  </div>
                  
                  <div className={`flex items-center gap-3 p-2 rounded-lg border text-[11px] ${
                    results.expectedValue > 0 
                      ? 'bg-emerald-100/20 border-emerald-200/30 text-emerald-800' 
                      : 'bg-rose-100/20 border-rose-200/30 text-rose-800'
                  }`}>
                    <div>
                      <span className="opacity-75">Succes:</span> <span className="font-bold">{(100 - inputs.returnRatePercent).toFixed(0)}%</span>
                    </div>
                    <div className="w-px h-3 bg-current/20"></div>
                    <div>
                      <span className="opacity-75">Eșec:</span> <span className="font-bold">-{formatCurrency(results.failureCost)}</span>
                    </div>
                  </div>
                </div>

                {/* Main prominent verdict alert */}
                <div className={`p-2.5 rounded-lg border text-xs font-bold leading-tight flex gap-2 items-center shadow-sm ${
                  results.expectedValue > 0
                    ? 'bg-white border-emerald-300 text-emerald-800'
                    : 'bg-white border-rose-300 text-rose-900 font-extrabold border-2'
                }`}>
                  <div className="flex-1">
                    {results.expectedValue > 0 ? (
                      <span>✅ VALUE BET: Aprobat pentru comercializare.</span>
                    ) : (
                      <span>🛑 SABOTAJ MATEMATIC: Nu lista produsul. Vei munci strict pentru eMAG și curieri.</span>
                    )}
                  </div>
                </div>

                <p className="text-[10px] opacity-90 leading-normal">
                  {results.expectedValue > 0 ? (
                    <span className="text-emerald-700 font-semibold">Model matematic profitabil: afacerea rămâne sustenabilă chiar și cu {inputs.returnRatePercent}% colete returnate.</span>
                  ) : (
                    <span className="text-rose-700 font-bold">Avertisment: Costurile de retur (Livrare + pierdere ambalaj 2 RON) depășesc profitul generat din vânzările reușite.</span>
                  )}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;