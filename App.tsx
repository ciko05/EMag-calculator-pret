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
    commissionPercent: 20,
  });

  // Handle Euro Change (updates Lei)
  const handleEuroChange = (val: string) => {
    const numVal = val === '' ? '' : parseFloat(val);
    if (numVal === '') {
      setInputs(prev => ({ ...prev, euroPrice: '', leiPrice: '' }));
      return;
    }
    
    // Calculate Lei based on fixed rate
    const calculatedLei = parseFloat((numVal * CONSTANTS.EURO_RATE).toFixed(2));
    setInputs(prev => ({ ...prev, euroPrice: numVal, leiPrice: calculatedLei }));
  };

  // Handle Lei Change (updates Euro - bi-directional per prompt)
  const handleLeiChange = (val: string) => {
    const numVal = val === '' ? '' : parseFloat(val);
    if (numVal === '') {
      setInputs(prev => ({ ...prev, leiPrice: '', euroPrice: '' }));
      return;
    }
    
    // Calculate Euro purely for display consistency, though Lei is the "source of truth" now
    const calculatedEuro = parseFloat((numVal / CONSTANTS.EURO_RATE).toFixed(2));
    setInputs(prev => ({ ...prev, leiPrice: numVal, euroPrice: calculatedEuro }));
  };

  // Handle Selling Price Change (Now Input is WITH VAT)
  const handleSellingChange = (val: string) => {
    setInputs(prev => ({ ...prev, sellingPriceIncVat: val === '' ? '' : parseFloat(val) }));
  };

  // Handle Commission Change
  const handleCommissionChange = (val: string) => {
    setInputs(prev => ({ ...prev, commissionPercent: val === '' ? 0 : parseFloat(val) }));
  };

  // Main Calculation Logic
  const results: CalculatedResults = useMemo(() => {
    const { leiPrice, sellingPriceIncVat, commissionPercent } = inputs;
    const acquisitionCost = typeof leiPrice === 'number' ? leiPrice : 0;
    
    // Derive Ex VAT price from Input (Inc VAT)
    const priceIncVat = typeof sellingPriceIncVat === 'number' ? sellingPriceIncVat : 0;
    const priceExVat = priceIncVat / (1 + CONSTANTS.VAT_RATE);

    // 1. Transport Logic (Based on Ex VAT price)
    // < 62 Lei -> 3 Lei, >= 62 Lei -> 8 Lei (ex VAT)
    let transport = 0;
    if (priceExVat > 0) {
      transport = priceExVat < CONSTANTS.TRANSPORT_THRESHOLD 
        ? CONSTANTS.TRANSPORT_LOW 
        : CONSTANTS.TRANSPORT_HIGH;
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

    return {
      transportCost: transport,
      commissionValueExVat: commissionExVat,
      commissionValueIncVat: commissionIncVat,
      sellingPriceIncVat: priceIncVat,
      sellingPriceExVat: priceExVat,
      totalCost,
      profit,
      profitMargin,
      markup
    };
  }, [inputs]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(val);

  return (
    <div className="min-h-full bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span className="bg-emag-blue text-white p-2 rounded-lg">
                <ShoppingCart size={24} />
              </span>
              Calculator Profit eMAG
            </h1>
            <p className="text-slate-500 mt-1">Simulare costuri, comisioane și profitabilitate</p>
          </div>
          <div className="flex gap-4 text-xs font-medium text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
             <span className="flex items-center gap-1"><Euro size={14}/> 1 = {CONSTANTS.EURO_RATE} RON</span>
             <span className="w-px h-4 bg-slate-300"></span>
             <span>TVA Vânzare: {(CONSTANTS.VAT_RATE * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: INPUTS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <Package className="text-slate-400" size={20}/>
                Date Intrare
              </h2>
              
              <div className="space-y-6">
                {/* Acquisition Costs */}
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup 
                    label="Preț Euro" 
                    value={inputs.euroPrice} 
                    onChange={handleEuroChange}
                    prefix="€"
                    placeholder="0.00"
                  />
                  <InputGroup 
                    label="Preț Net Lei" 
                    value={inputs.leiPrice} 
                    onChange={handleLeiChange}
                    suffix="RON"
                    placeholder="0.00"
                    helperText={`Curs calculat: 1€ = ${CONSTANTS.EURO_RATE} lei`}
                  />
                </div>

                <hr className="border-slate-100" />

                {/* Selling Price - UPDATED TO INCLUDE VAT */}
                <InputGroup 
                  label="Preț Vânzare (TVA Inclus)" 
                  value={inputs.sellingPriceIncVat} 
                  onChange={handleSellingChange}
                  suffix="RON"
                  placeholder="0.00"
                  helperText="Prețul afișat pe eMAG (se va calcula automat baza fără TVA)"
                />

                {/* Commission */}
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup 
                      label="Comision eMAG" 
                      value={inputs.commissionPercent} 
                      onChange={handleCommissionChange}
                      suffix="%"
                      placeholder="0"
                    />
                    
                    {/* Read Only Transport Display */}
                    <div className="opacity-80">
                      <InputGroup 
                        label="Cost Transport (Auto)" 
                        value={results.transportCost} 
                        onChange={() => {}} // Read only
                        suffix="RON"
                        placeholder="0.00"
                        helperText={results.sellingPriceExVat ? (results.sellingPriceExVat < 62 ? "< 62 Lei (fără TVA)" : "≥ 62 Lei (fără TVA)") : "Depinde de preț"}
                      />
                    </div>
                </div>
              </div>
            </div>
            
            {/* Quick Summary of Inputs if needed or instructions */}
            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-100">
              <p className="font-semibold mb-1">Notă logică transport:</p>
              <ul className="list-disc list-inside space-y-1 opacity-90">
                <li>Vânzare {'<'} 62 Lei (net) = <strong>3 Lei</strong> transport</li>
                <li>Vânzare ≥ 62 Lei (net) = <strong>8 Lei</strong> transport</li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: RESULTS (CARDS) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 lg:hidden">
              <TrendingUp className="text-slate-400" size={20}/>
              Rezultate
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Card 1: Selling Price */}
              <StatCard 
                title="Preț Vânzare eMAG"
                mainValue={formatCurrency(results.sellingPriceIncVat)}
                mainLabel="(TVA Inclus)"
                subLabel="Preț Fără TVA"
                subValue={formatCurrency(results.sellingPriceExVat)}
                accentColor="blue"
                icon={<ShoppingCart className="text-blue-600" size={20} />}
              />

              {/* Card 2: Commission */}
              <StatCard 
                title="Cost Comision"
                mainValue={formatCurrency(results.commissionValueExVat)}
                mainLabel="(Fără TVA)"
                subLabel="Valoare cu TVA"
                subValue={formatCurrency(results.commissionValueIncVat)}
                extraLabel="Procent Aplicat"
                extraValue={`${inputs.commissionPercent}%`}
                accentColor="amber"
                icon={<Percent className="text-amber-600" size={20} />}
              />
            </div>

            {/* Card 3: Profit (Full Width) */}
            <StatCard 
              title="Profit per Produs"
              mainValue={formatCurrency(results.profit)}
              mainLabel="Profit Net"
              subLabel="Marjă Profit (din vânzare)"
              subValue={`${results.profitMargin.toFixed(2)}%`}
              extraLabel="Adaos Comercial (la achiziție)"
              extraValue={`${results.markup.toFixed(2)}%`}
              accentColor={results.profit >= 0 ? 'green' : 'red'}
              highlight={true}
              icon={<TrendingUp className={results.profit >= 0 ? "text-emerald-600" : "text-red-600"} size={20} />}
            />

            {/* Cost Breakdown Table (Optional visual aid) */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sumar Costuri (Fără TVA)</h3>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Achiziție Marfă</span>
                  <span className="font-medium text-slate-900">{formatCurrency(typeof inputs.leiPrice === 'number' ? inputs.leiPrice : 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Transport</span>
                  <span className="font-medium text-slate-900">{formatCurrency(results.transportCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Comision</span>
                  <span className="font-medium text-slate-900">{formatCurrency(results.commissionValueExVat)}</span>
                </div>
                <div className="border-t border-slate-100 pt-2 mt-2 flex justify-between items-center font-bold">
                  <span className="text-slate-800">Total Costuri</span>
                  <span className="text-slate-900">{formatCurrency(results.totalCost)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;