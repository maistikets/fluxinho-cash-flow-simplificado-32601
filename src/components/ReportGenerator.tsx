
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download, Eye, Calendar, Filter, TrendingUp } from 'lucide-react';
import { Transaction } from '@/types/financial';
import jsPDF from 'jspdf';
import ReportPreview from '@/components/ReportPreview';

interface ReportGeneratorProps {
  transactions: Transaction[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ transactions }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filterTransactions = () => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.dueDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && transactionDate < start) return false;
      if (end && transactionDate > end) return false;
      if (selectedCategory && transaction.category !== selectedCategory) return false;

      return true;
    });
  };

  const generatePDF = () => {
    const filteredTransactions = filterTransactions();
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('Relatório Financeiro - Fluxinho', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Período: ${startDate ? formatDate(startDate) : 'Início'} até ${endDate ? formatDate(endDate) : 'Hoje'}`, 20, 35);
    
    if (selectedCategory) {
      doc.text(`Categoria: ${selectedCategory}`, 20, 45);
    }

    // Summary
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    doc.setFontSize(14);
    doc.text('Resumo:', 20, selectedCategory ? 60 : 55);
    doc.setFontSize(12);
    doc.text(`Total de Receitas: ${formatCurrency(totalIncome)}`, 20, selectedCategory ? 75 : 70);
    doc.text(`Total de Despesas: ${formatCurrency(totalExpenses)}`, 20, selectedCategory ? 85 : 80);
    doc.text(`Saldo: ${formatCurrency(balance)}`, 20, selectedCategory ? 95 : 90);

    // Transactions table
    let yPosition = selectedCategory ? 115 : 110;
    doc.setFontSize(14);
    doc.text('Transações:', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(10);
    doc.text('Data', 20, yPosition);
    doc.text('Descrição', 50, yPosition);
    doc.text('Categoria', 120, yPosition);
    doc.text('Valor', 160, yPosition);
    doc.text('Status', 185, yPosition);
    yPosition += 10;

    filteredTransactions.forEach(transaction => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.text(formatDate(transaction.dueDate), 20, yPosition);
      doc.text(transaction.description.substring(0, 20) + '...', 50, yPosition);
      doc.text(transaction.category, 120, yPosition);
      doc.text(
        `${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}`,
        160,
        yPosition
      );
      doc.text(transaction.status === 'paid' ? 'Pago' : transaction.status === 'pending' ? 'Pendente' : 'Vencido', 185, yPosition);
      yPosition += 8;
    });

    // Save the PDF
    const fileName = `relatorio_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    setIsOpen(false);
  };

  const categories = [...new Set(transactions.map(t => t.category))];
  const filteredTransactions = filterTransactions();

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 group">
            <FileText className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
            Gerar Relatório PDF
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Configurar Relatório Financeiro
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Filtros de Data */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-gray-600" />
                <Label className="text-sm font-medium text-gray-700">Período do Relatório</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate" className="text-sm text-gray-600">Data Inicial</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-sm text-gray-600">Data Final</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Filtro de Categoria */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-5 w-5 text-gray-600" />
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">Categoria (opcional)</Label>
              </div>
              <select
                id="category"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Preview Summary */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Resumo do Relatório</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-blue-600 font-semibold">{filteredTransactions.length}</p>
                  <p className="text-blue-700">Transações</p>
                </div>
                <div className="text-center">
                  <p className="text-green-600 font-semibold">
                    {filteredTransactions.filter(t => t.type === 'income').length}
                  </p>
                  <p className="text-blue-700">Receitas</p>
                </div>
                <div className="text-center">
                  <p className="text-red-600 font-semibold">
                    {filteredTransactions.filter(t => t.type === 'expense').length}
                  </p>
                  <p className="text-blue-700">Despesas</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => setShowPreview(true)} 
                variant="outline" 
                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Visualizar Prévia
              </Button>
              <Button 
                onClick={generatePDF} 
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Gerar e Baixar PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showPreview && (
        <ReportPreview
          transactions={filteredTransactions}
          startDate={startDate}
          endDate={endDate}
          selectedCategory={selectedCategory}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onDownload={generatePDF}
        />
      )}
    </>
  );
};

export default ReportGenerator;
